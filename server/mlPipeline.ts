import fs from 'node:fs/promises';
import path from 'node:path';
import { RandomForestClassifier } from 'ml-random-forest';
import { DecisionTreeClassifier } from 'ml-cart';
import type { CropRecord, DatasetValidationReport } from './datasetService.ts';
import { EXPECTED_FEATURES } from './datasetService.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CACHED_MODELS_PATH = path.resolve(DATA_DIR, 'trained_models.json');

export interface CropInputFeatures {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface MisclassifiedSample {
  actual: string;
  predicted: string;
  features: CropInputFeatures;
}

export interface ModelEvaluationMetrics {
  modelName: 'RandomForestClassifier' | 'DecisionTreeClassifier';
  hyperparameters: Record<string, unknown>;
  trainingTimeMs: number;
  trainSamples: number;
  testSamples: number;
  trainAccuracy: number;
  testAccuracy: number;
  oobAccuracy: number | null;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  testErrorCount: number;
  sampleMisclassifications: MisclassifiedSample[];
}

export interface ProbabilityApiVerification {
  upstreamPredictProbabilityDefectDetected: boolean;
  upstreamPredictProbabilitySumSample: number;
  verifiedTreeVoteSumSample: number;
  decisionTreeLeafDistributionVerified: boolean;
  notes: string;
}

export interface TrainingBundleResult {
  datasetReport: DatasetValidationReport;
  classes: string[];
  splitSummary: {
    trainRatio: number;
    testRatio: number;
    trainSamples: number;
    testSamples: number;
    seed: number;
  };
  randomForestMetrics: ModelEvaluationMetrics;
  decisionTreeMetrics: ModelEvaluationMetrics;
  probabilityVerification: ProbabilityApiVerification;
  modelsCached: boolean;
  trainedAt: string;
}

export interface RankedCropPrediction {
  rank: number;
  crop: string;
  probability: number;
  votes: number;
  totalTrees: number;
}

export interface PredictionResponse {
  input: CropInputFeatures;
  randomForestTopThree: RankedCropPrediction[];
  randomForestPrimaryCrop: string;
  decisionTreePrediction: string;
  decisionTreeLeafConfidence: number;
  modelAgreement: boolean;
}

interface TrainedState {
  rf: RandomForestClassifier;
  dt: DecisionTreeClassifier;
  classes: string[];
  nEstimators: number;
  summary: TrainingBundleResult;
}

interface PersistedModelBundle {
  datasetSha256: string;
  classes: string[];
  nEstimators: number;
  rfModel: ReturnType<RandomForestClassifier['toJSON']>;
  dtModel: ReturnType<DecisionTreeClassifier['toJSON']>;
  summary: TrainingBundleResult;
}

let cachedTrainedState: TrainedState | null = null;

function assertConfinedModelPath(targetPath: string): string {
  const resolved = path.resolve(targetPath);
  if (!resolved.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid server model cache path.');
  }
  return resolved;
}

// Mulberry32 deterministic PRNG for repeatable stratified train/test splitting
function createPrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toFeatureVector(record: CropInputFeatures): number[] {
  return [
    record.N,
    record.P,
    record.K,
    record.temperature,
    record.humidity,
    record.ph,
    record.rainfall,
  ];
}

function stratifiedTrainTestSplit(
  records: CropRecord[],
  testRatio: number,
  seed: number
): { trainRecords: CropRecord[]; testRecords: CropRecord[] } {
  const rng = createPrng(seed);
  const byClass = new Map<string, CropRecord[]>();

  for (const record of records) {
    const bucket = byClass.get(record.label) ?? [];
    bucket.push(record);
    byClass.set(record.label, bucket);
  }

  const trainRecords: CropRecord[] = [];
  const testRecords: CropRecord[] = [];

  for (const label of [...byClass.keys()].sort()) {
    const group = [...(byClass.get(label) ?? [])];
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
    const testCount = Math.max(1, Math.round(group.length * testRatio));
    testRecords.push(...group.slice(0, testCount));
    trainRecords.push(...group.slice(testCount));
  }

  return { trainRecords, testRecords };
}

function computeClassificationMetrics(
  actualLabels: number[],
  predictedLabels: number[],
  testRecords: CropRecord[],
  classes: string[]
): {
  accuracy: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  errorCount: number;
  sampleMisclassifications: MisclassifiedSample[];
} {
  const numClasses = classes.length;
  const tp = new Array<number>(numClasses).fill(0);
  const fp = new Array<number>(numClasses).fill(0);
  const fn = new Array<number>(numClasses).fill(0);

  let correct = 0;
  const sampleMisclassifications: MisclassifiedSample[] = [];

  for (let i = 0; i < actualLabels.length; i++) {
    const actual = actualLabels[i];
    const pred = predictedLabels[i];
    if (actual === pred) {
      correct++;
      tp[actual]++;
    } else {
      fp[pred]++;
      fn[actual]++;
      if (sampleMisclassifications.length < 10) {
        const r = testRecords[i];
        sampleMisclassifications.push({
          actual: classes[actual],
          predicted: classes[pred],
          features: {
            N: r.N,
            P: r.P,
            K: r.K,
            temperature: r.temperature,
            humidity: r.humidity,
            ph: r.ph,
            rainfall: r.rainfall,
          },
        });
      }
    }
  }

  let precisionSum = 0;
  let recallSum = 0;
  let f1Sum = 0;

  for (let c = 0; c < numClasses; c++) {
    const prec = tp[c] + fp[c] > 0 ? tp[c] / (tp[c] + fp[c]) : 0;
    const rec = tp[c] + fn[c] > 0 ? tp[c] / (tp[c] + fn[c]) : 0;
    const f1 = prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : 0;
    precisionSum += prec;
    recallSum += rec;
    f1Sum += f1;
  }

  const total = actualLabels.length;
  return {
    accuracy: total > 0 ? correct / total : 0,
    macroPrecision: numClasses > 0 ? precisionSum / numClasses : 0,
    macroRecall: numClasses > 0 ? recallSum / numClasses : 0,
    macroF1: numClasses > 0 ? f1Sum / numClasses : 0,
    errorCount: total - correct,
    sampleMisclassifications,
  };
}

/**
 * Computes exact Random Forest class probabilities by reading per-estimator votes
 * via RandomForestClassifier.prototype.predictionValues(X).
 */
export function computeRfEnsembleProbabilities(
  rf: RandomForestClassifier,
  featureVector: number[],
  classes: string[]
): { ranked: RankedCropPrediction[]; totalTrees: number } {
  const voteMatrix = rf.predictionValues([featureVector]);
  const treeVotes = voteMatrix.getRow(0);
  const totalTrees = treeVotes.length;

  const counts = new Array<number>(classes.length).fill(0);
  for (const vote of treeVotes) {
    if (vote >= 0 && vote < classes.length) {
      counts[vote]++;
    }
  }

  const scored = classes.map((crop, idx) => ({
    crop,
    votes: counts[idx],
    probability: totalTrees > 0 ? counts[idx] / totalTrees : 0,
  }));

  scored.sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return a.crop.localeCompare(b.crop);
  });

  const ranked = scored.map((item, idx) => ({
    rank: idx + 1,
    crop: item.crop,
    probability: Number(item.probability.toFixed(4)),
    votes: item.votes,
    totalTrees,
  }));

  return { ranked, totalTrees };
}

export async function ensureTrainedCropModels(
  records: CropRecord[],
  datasetReport: DatasetValidationReport,
  options?: { forceRetrain?: boolean }
): Promise<TrainingBundleResult> {
  if (records.length === 0 || datasetReport.invalidRows > 0 || datasetReport.missingValuesTotal > 0) {
    throw new Error('Cannot train models: validated dataset is not clean.');
  }

  const forceRetrain = options?.forceRetrain === true;
  await fs.mkdir(DATA_DIR, { recursive: true });
  const modelCachePath = assertConfinedModelPath(CACHED_MODELS_PATH);

  if (!forceRetrain) {
    try {
      const rawCache = await fs.readFile(modelCachePath, 'utf8');
      const bundle = JSON.parse(rawCache) as PersistedModelBundle;
      if (bundle.datasetSha256 === datasetReport.sha256) {
        const rf = RandomForestClassifier.load(bundle.rfModel);
        const dt = DecisionTreeClassifier.load(bundle.dtModel);
        const summary: TrainingBundleResult = {
          ...bundle.summary,
          datasetReport,
          modelsCached: true,
        };
        cachedTrainedState = {
          rf,
          dt,
          classes: bundle.classes,
          nEstimators: bundle.nEstimators,
          summary,
        };
        return summary;
      }
    } catch {
      // No valid model cache; proceed with training
    }
  }

  const classes = Object.keys(datasetReport.classDistribution).sort();
  const labelToIndex = new Map<string, number>();
  classes.forEach((cls, idx) => labelToIndex.set(cls, idx));

  const splitSeed = 42;
  const testRatio = 0.2;
  const { trainRecords, testRecords } = stratifiedTrainTestSplit(records, testRatio, splitSeed);

  const XTrain = trainRecords.map(toFeatureVector);
  const yTrain = trainRecords.map((r) => labelToIndex.get(r.label)!);
  const XTest = testRecords.map(toFeatureVector);
  const yTest = testRecords.map((r) => labelToIndex.get(r.label)!);

  // 1. Train Random Forest Classifier (ml-random-forest)
  const rfOptions = {
    seed: 42,
    nEstimators: 50,
    maxFeatures: 3,
    replacement: true,
    useSampleBagging: true,
    noOOB: false,
    treeOptions: {
      gainFunction: 'gini' as const,
      maxDepth: 15,
      minNumSamples: 3,
    },
  };

  const rfStart = performance.now();
  const rf = new RandomForestClassifier(rfOptions);
  rf.train(XTrain, yTrain);
  const rfDurationMs = Number((performance.now() - rfStart).toFixed(2));

  const rfTrainPreds = rf.predict(XTrain);
  const rfTestPreds = rf.predict(XTest);
  const rfTrainCorrect = rfTrainPreds.filter((p, i) => p === yTrain[i]).length;
  const rfTestEval = computeClassificationMetrics(yTest, rfTestPreds, testRecords, classes);

  let oobAccuracy: number | null = null;
  if (rf.oobResults && rf.oobResults.length > 0) {
    const oobCorrect = rf.oobResults.filter((item) => item.predicted === item.true).length;
    oobAccuracy = Number((oobCorrect / rf.oobResults.length).toFixed(4));
  }

  // 2. Train Decision Tree Classifier (ml-cart)
  const dtOptions = {
    gainFunction: 'gini' as const,
    splitFunction: 'mean' as const,
    maxDepth: 15,
    minNumSamples: 3,
    gainThreshold: 0.01,
  };

  const dtStart = performance.now();
  const dt = new DecisionTreeClassifier(dtOptions);
  dt.train(XTrain, yTrain);
  const dtDurationMs = Number((performance.now() - dtStart).toFixed(2));

  const dtTrainPreds = dt.predict(XTrain);
  const dtTestPreds = dt.predict(XTest);
  const dtTrainCorrect = dtTrainPreds.filter((p, i) => p === yTrain[i]).length;
  const dtTestEval = computeClassificationMetrics(yTest, dtTestPreds, testRecords, classes);

  // 3. Verify package probability APIs on a real test sample before enabling top-3 ranking
  const sampleVector = XTest[0];
  let upstreamProbSum = 0;
  for (let c = 0; c < classes.length; c++) {
    const res = rf.predictProbability([sampleVector], c);
    upstreamProbSum += res[0] ?? 0;
  }
  const upstreamDefectDetected = Math.abs(upstreamProbSum - 1) > 0.01;

  const verifiedEnsemble = computeRfEnsembleProbabilities(rf, sampleVector, classes);
  const verifiedTreeVoteSum = verifiedEnsemble.ranked.reduce((acc, item) => acc + item.probability, 0);

  const dtLeafDist = dt.root.classify(sampleVector);
  const dtLeafVec = dtLeafDist.getRow(0);
  const dtLeafMax = dtLeafDist.maxRowIndex(0)[1];
  const dtDirectPred = dt.predict([sampleVector])[0];
  const decisionTreeLeafDistributionVerified =
    dtLeafVec.length > 0 && dtLeafMax === dtDirectPred;

  const summary: TrainingBundleResult = {
    datasetReport,
    classes,
    splitSummary: {
      trainRatio: 0.8,
      testRatio,
      trainSamples: trainRecords.length,
      testSamples: testRecords.length,
      seed: splitSeed,
    },
    randomForestMetrics: {
      modelName: 'RandomForestClassifier',
      hyperparameters: {
        ...rfOptions,
        features: [...EXPECTED_FEATURES],
      },
      trainingTimeMs: rfDurationMs,
      trainSamples: trainRecords.length,
      testSamples: testRecords.length,
      trainAccuracy: Number((rfTrainCorrect / trainRecords.length).toFixed(4)),
      testAccuracy: Number(rfTestEval.accuracy.toFixed(4)),
      oobAccuracy,
      macroPrecision: Number(rfTestEval.macroPrecision.toFixed(4)),
      macroRecall: Number(rfTestEval.macroRecall.toFixed(4)),
      macroF1: Number(rfTestEval.macroF1.toFixed(4)),
      testErrorCount: rfTestEval.errorCount,
      sampleMisclassifications: rfTestEval.sampleMisclassifications,
    },
    decisionTreeMetrics: {
      modelName: 'DecisionTreeClassifier',
      hyperparameters: {
        ...dtOptions,
        features: [...EXPECTED_FEATURES],
      },
      trainingTimeMs: dtDurationMs,
      trainSamples: trainRecords.length,
      testSamples: testRecords.length,
      trainAccuracy: Number((dtTrainCorrect / trainRecords.length).toFixed(4)),
      testAccuracy: Number(dtTestEval.accuracy.toFixed(4)),
      oobAccuracy: null,
      macroPrecision: Number(dtTestEval.macroPrecision.toFixed(4)),
      macroRecall: Number(dtTestEval.macroRecall.toFixed(4)),
      macroF1: Number(dtTestEval.macroF1.toFixed(4)),
      testErrorCount: dtTestEval.errorCount,
      sampleMisclassifications: dtTestEval.sampleMisclassifications,
    },
    probabilityVerification: {
      upstreamPredictProbabilityDefectDetected: upstreamDefectDetected,
      upstreamPredictProbabilitySumSample: Number(upstreamProbSum.toFixed(6)),
      verifiedTreeVoteSumSample: Number(verifiedTreeVoteSum.toFixed(6)),
      decisionTreeLeafDistributionVerified,
      notes: upstreamDefectDetected
        ? 'ml-random-forest predictProbability() omits initial accumulator 0 in Array.reduce(); top-three ranking uses verified per-tree vote counts from predictionValues() summing to 1.0.'
        : 'Verified probability sum equals 1.0.',
    },
    modelsCached: false,
    trainedAt: new Date().toISOString(),
  };

  const bundleToPersist: PersistedModelBundle = {
    datasetSha256: datasetReport.sha256,
    classes,
    nEstimators: rfOptions.nEstimators,
    rfModel: rf.toJSON(),
    dtModel: dt.toJSON(),
    summary,
  };

  await fs.writeFile(modelCachePath, JSON.stringify(bundleToPersist), 'utf8');

  cachedTrainedState = {
    rf,
    dt,
    classes,
    nEstimators: rfOptions.nEstimators,
    summary,
  };

  return summary;
}

export function getTrainingMetrics(): TrainingBundleResult | null {
  return cachedTrainedState?.summary ?? null;
}

export function predictCropWithTrainedModels(input: CropInputFeatures): PredictionResponse {
  if (!cachedTrainedState) {
    throw new Error('Models are not trained yet.');
  }

  const { rf, dt, classes } = cachedTrainedState;
  const featureVector = toFeatureVector(input);

  const rfPrimaryIdx = rf.predict([featureVector])[0];
  const rfPrimaryCrop = classes[rfPrimaryIdx];

  const { ranked } = computeRfEnsembleProbabilities(rf, featureVector, classes);
  const topThree = ranked.slice(0, 3);

  const dtPredIdx = dt.predict([featureVector])[0];
  const decisionTreePrediction = classes[dtPredIdx];
  const dtLeafVector = dt.root.classify(featureVector).getRow(0);
  const decisionTreeLeafConfidence = Number((dtLeafVector[dtPredIdx] ?? 0).toFixed(4));

  return {
    input,
    randomForestTopThree: topThree,
    randomForestPrimaryCrop: rfPrimaryCrop,
    decisionTreePrediction,
    decisionTreeLeafConfidence,
    modelAgreement: rfPrimaryCrop === decisionTreePrediction,
  };
}
