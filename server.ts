import express from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  ensureValidatedDataset,
  getCachedDatasetReport,
} from './server/datasetService.ts';
import {
  ensureTrainedCropModels,
  getTrainingMetrics,
  predictCropWithTrainedModels,
  type CropInputFeatures,
  type TrainingBundleResult,
} from './server/mlPipeline.ts';

const PORT = Number(process.env.PORT) || 3000;

let initializationPromise: Promise<TrainingBundleResult> | null = null;
let lastPipelineError: string | null = null;

function sanitizeErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : 'Unexpected server error.';
  return raw.replaceAll(process.cwd(), '[server]');
}

async function initializeMlPipeline(forceRefresh = false): Promise<TrainingBundleResult> {
  if (!forceRefresh) {
    const existingMetrics = getTrainingMetrics();
    if (existingMetrics) {
      return existingMetrics;
    }
    if (initializationPromise) {
      return initializationPromise;
    }
  }

  const runPromise = (async () => {
    try {
      lastPipelineError = null;
      const dataset = await ensureValidatedDataset({ forceRefresh });
      const metrics = await ensureTrainedCropModels(dataset.records, dataset.report, {
        forceRetrain: forceRefresh,
      });
      return metrics;
    } catch (err) {
      lastPipelineError = sanitizeErrorMessage(err);
      throw err;
    } finally {
      initializationPromise = null;
    }
  })();

  initializationPromise = runPromise;
  return runPromise;
}

function validatePredictionInput(body: unknown): {
  valid: true;
  data: CropInputFeatures;
} | {
  valid: false;
  error: string;
} {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const record = body as Record<string, unknown>;
  const fields: Array<keyof CropInputFeatures> = [
    'N',
    'P',
    'K',
    'temperature',
    'humidity',
    'ph',
    'rainfall',
  ];

  const parsed: Partial<CropInputFeatures> = {};

  for (const field of fields) {
    const rawVal = record[field];
    const num =
      typeof rawVal === 'number'
        ? rawVal
        : typeof rawVal === 'string' && rawVal.trim() !== ''
        ? Number(rawVal)
        : NaN;
    if (!Number.isFinite(num)) {
      return { valid: false, error: `Field "${field}" must be a valid finite number.` };
    }
    parsed[field] = num;
  }

  const data = parsed as CropInputFeatures;

  if (data.N < 0 || data.N > 500 || data.P < 0 || data.P > 500 || data.K < 0 || data.K > 500) {
    return { valid: false, error: 'NPK values must be between 0 and 500.' };
  }
  if (data.temperature < -10 || data.temperature > 60) {
    return { valid: false, error: 'Temperature must be between -10°C and 60°C.' };
  }
  if (data.humidity < 0 || data.humidity > 100) {
    return { valid: false, error: 'Humidity must be between 0% and 100%.' };
  }
  if (data.ph < 0 || data.ph > 14) {
    return { valid: false, error: 'Soil pH must be between 0 and 14.' };
  }
  if (data.rainfall < 0 || data.rainfall > 5000) {
    return { valid: false, error: 'Rainfall must be between 0 and 5000 mm.' };
  }

  return { valid: true, data };
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  // Explicitly block direct HTTP access to server-side data and backend source directories
  app.use((req, res, next) => {
    const lowerPath = req.path.toLowerCase();
    if (
      lowerPath === '/data' ||
      lowerPath.startsWith('/data/') ||
      lowerPath === '/server' ||
      lowerPath.startsWith('/server/')
    ) {
      res.status(404).json({ error: 'Not found.' });
      return;
    }
    next();
  });

  app.get('/api/health', (_req, res) => {
    const datasetReport = getCachedDatasetReport();
    const metrics = getTrainingMetrics();
    res.json({
      status: metrics ? 'ready' : lastPipelineError ? 'error' : 'initializing',
      datasetReady: Boolean(datasetReport),
      modelsReady: Boolean(metrics),
      error: lastPipelineError,
    });
  });

  app.get('/api/ml/dataset', async (_req, res) => {
    try {
      const existing = getCachedDatasetReport();
      if (existing) {
        res.json(existing);
        return;
      }
      const metrics = await initializeMlPipeline(false);
      res.json(metrics.datasetReport);
    } catch (err) {
      res.status(502).json({
        error: sanitizeErrorMessage(err),
      });
    }
  });

  app.post('/api/ml/dataset/sync', async (_req, res) => {
    try {
      const metrics = await initializeMlPipeline(true);
      res.json({
        synced: true,
        datasetReport: metrics.datasetReport,
        trainedAt: metrics.trainedAt,
      });
    } catch (err) {
      res.status(502).json({
        synced: false,
        error: sanitizeErrorMessage(err),
      });
    }
  });

  app.get('/api/ml/metrics', async (_req, res) => {
    try {
      const existing = getTrainingMetrics();
      if (existing) {
        res.json(existing);
        return;
      }
      const metrics = await initializeMlPipeline(false);
      res.json(metrics);
    } catch (err) {
      res.status(502).json({
        error: sanitizeErrorMessage(err),
      });
    }
  });

  app.post('/api/ml/predict', async (req, res) => {
    const validation = validatePredictionInput(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const existingMetrics = getTrainingMetrics();
    if (!existingMetrics) {
      res.status(503).json({
        error: lastPipelineError
          ? `ML pipeline unavailable: ${lastPipelineError}`
          : 'ML models are still initializing. Please try again shortly.',
      });
      return;
    }

    try {
      const prediction = predictCropWithTrainedModels(validation.data);
      res.json(prediction);
    } catch (err) {
      res.status(500).json({ error: sanitizeErrorMessage(err) });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*all', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BhoomiMitra server listening on http://0.0.0.0:${PORT}`);
  });

  initializeMlPipeline(false)
    .then((metrics) => {
      console.log(
        `[ML Pipeline] Ready (cached=${metrics.modelsCached}): ${metrics.datasetReport.validRecords} records, ${metrics.datasetReport.classCount} classes, RF test accuracy=${(metrics.randomForestMetrics.testAccuracy * 100).toFixed(2)}%, DT test accuracy=${(metrics.decisionTreeMetrics.testAccuracy * 100).toFixed(2)}%`
      );
    })
    .catch((err) => {
      console.error('[ML Pipeline] Startup failed:', sanitizeErrorMessage(err));
    });
}

startServer();
