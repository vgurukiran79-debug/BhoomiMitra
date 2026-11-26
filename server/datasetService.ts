import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const ALLOWED_DATASET_URL =
  'https://raw.githubusercontent.com/the-amazing-atharva/Crop-Recommendation/main/Crop_recommendation.csv';

export const EXPECTED_FEATURES = [
  'N',
  'P',
  'K',
  'temperature',
  'humidity',
  'ph',
  'rainfall',
] as const;

export const EXPECTED_HEADERS = [...EXPECTED_FEATURES, 'label'] as const;

const DOWNLOAD_TIMEOUT_MS = 15_000;
const MAX_DOWNLOAD_BYTES = 2 * 1024 * 1024; // 2 MB hard cap

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CACHED_CSV_PATH = path.resolve(DATA_DIR, 'crop_recommendation.csv');
const CACHED_REPORT_PATH = path.resolve(DATA_DIR, 'dataset_report.json');

export interface CropRecord {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  label: string;
}

export interface DatasetValidationReport {
  sourceHost: string;
  httpStatus: number;
  contentType: string;
  byteSize: number;
  sha256: string;
  fetchedAt: string;
  cached: boolean;
  headers: string[];
  totalRows: number;
  validRecords: number;
  invalidRows: number;
  missingValuesTotal: number;
  missingValuesByColumn: Record<string, number>;
  duplicateRows: number;
  classCount: number;
  classDistribution: Record<string, number>;
  validationErrors: string[];
}

export interface ValidatedDataset {
  records: CropRecord[];
  report: DatasetValidationReport;
}

let inMemoryDataset: ValidatedDataset | null = null;

function assertSafeTargetUrl(rawUrl: string): URL {
  const parsed = new URL(rawUrl);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'raw.githubusercontent.com') {
    throw new Error('Blocked untrusted dataset source URL.');
  }
  return parsed;
}

function assertConfinedDataPath(targetPath: string): string {
  const resolved = path.resolve(targetPath);
  if (!resolved.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid server storage path.');
  }
  return resolved;
}

function isMissingCell(value: string | undefined): boolean {
  if (value === undefined) return true;
  const trimmed = value.trim().toLowerCase();
  return trimmed === '' || trimmed === 'na' || trimmed === 'null' || trimmed === 'nan' || trimmed === 'undefined';
}

export function parseAndValidateCsv(
  csvText: string,
  meta: {
    sourceHost: string;
    httpStatus: number;
    contentType: string;
    byteSize: number;
    sha256: string;
    fetchedAt: string;
    cached: boolean;
  }
): ValidatedDataset {
  const normalized = csvText.replace(/^\uFEFF/, '');
  const rawLines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (rawLines.length < 2) {
    throw new Error('CSV validation failed: dataset contains no data rows.');
  }

  const headers = rawLines[0].split(',').map((h) => h.trim());
  const headerMatches =
    headers.length === EXPECTED_HEADERS.length &&
    EXPECTED_HEADERS.every((expected, idx) => headers[idx] === expected);

  if (!headerMatches) {
    throw new Error(
      `CSV header validation failed. Expected [${EXPECTED_HEADERS.join(', ')}], got [${headers.join(', ')}].`
    );
  }

  const missingValuesByColumn: Record<string, number> = {};
  for (const col of EXPECTED_HEADERS) {
    missingValuesByColumn[col] = 0;
  }

  const records: CropRecord[] = [];
  const seenRowKeys = new Set<string>();
  const classDistribution: Record<string, number> = {};
  const validationErrors: string[] = [];

  let missingValuesTotal = 0;
  let invalidRows = 0;
  let duplicateRows = 0;

  const dataLines = rawLines.slice(1);

  for (let i = 0; i < dataLines.length; i++) {
    const lineNum = i + 2;
    const cells = dataLines[i].split(',').map((c) => c.trim());

    if (cells.length !== EXPECTED_HEADERS.length) {
      invalidRows++;
      if (validationErrors.length < 10) {
        validationErrors.push(`Row ${lineNum}: expected ${EXPECTED_HEADERS.length} columns, found ${cells.length}.`);
      }
      continue;
    }

    let rowHasMissing = false;
    for (let c = 0; c < EXPECTED_HEADERS.length; c++) {
      if (isMissingCell(cells[c])) {
        missingValuesByColumn[EXPECTED_HEADERS[c]]++;
        missingValuesTotal++;
        rowHasMissing = true;
      }
    }

    if (rowHasMissing) {
      invalidRows++;
      if (validationErrors.length < 10) {
        validationErrors.push(`Row ${lineNum}: contains missing value(s).`);
      }
      continue;
    }

    const numericValues = EXPECTED_FEATURES.map((_, idx) => Number(cells[idx]));
    if (numericValues.some((val) => !Number.isFinite(val))) {
      invalidRows++;
      if (validationErrors.length < 10) {
        validationErrors.push(`Row ${lineNum}: contains non-numeric feature value.`);
      }
      continue;
    }

    const [N, P, K, temperature, humidity, ph, rainfall] = numericValues;
    const label = cells[7];

    if (N < 0 || P < 0 || K < 0 || humidity < 0 || humidity > 100 || ph < 0 || ph > 14 || rainfall < 0) {
      invalidRows++;
      if (validationErrors.length < 10) {
        validationErrors.push(`Row ${lineNum}: feature value out of agronomic bounds.`);
      }
      continue;
    }

    if (!/^[a-zA-Z0-9 _-]+$/.test(label)) {
      invalidRows++;
      if (validationErrors.length < 10) {
        validationErrors.push(`Row ${lineNum}: invalid target label format.`);
      }
      continue;
    }

    const dedupeKey = `${N}|${P}|${K}|${temperature}|${humidity}|${ph}|${rainfall}|${label.toLowerCase()}`;
    if (seenRowKeys.has(dedupeKey)) {
      duplicateRows++;
    } else {
      seenRowKeys.add(dedupeKey);
    }

    const record: CropRecord = { N, P, K, temperature, humidity, ph, rainfall, label };
    records.push(record);
    classDistribution[label] = (classDistribution[label] ?? 0) + 1;
  }

  const classCount = Object.keys(classDistribution).length;

  if (records.length === 0 || invalidRows > 0 || missingValuesTotal > 0 || classCount < 2) {
    throw new Error(
      `Dataset validation failed: validRecords=${records.length}, invalidRows=${invalidRows}, missingValues=${missingValuesTotal}, classes=${classCount}.`
    );
  }

  const sortedDistribution: Record<string, number> = {};
  for (const key of Object.keys(classDistribution).sort()) {
    sortedDistribution[key] = classDistribution[key];
  }

  return {
    records,
    report: {
      ...meta,
      headers,
      totalRows: dataLines.length,
      validRecords: records.length,
      invalidRows,
      missingValuesTotal,
      missingValuesByColumn,
      duplicateRows,
      classCount,
      classDistribution: sortedDistribution,
      validationErrors,
    },
  };
}

async function fetchDatasetWithLimits(): Promise<{
  csvText: string;
  httpStatus: number;
  contentType: string;
  byteSize: number;
  sha256: string;
  sourceHost: string;
}> {
  const safeUrl = assertSafeTargetUrl(ALLOWED_DATASET_URL);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(safeUrl.toString(), {
      method: 'GET',
      signal: controller.signal,
      redirect: 'error',
      headers: {
        Accept: 'text/csv, text/plain;q=0.9',
        'User-Agent': 'BhoomiMitra-DatasetFetcher/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Dataset download failed with HTTP status ${response.status}.`);
    }

    const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
    const isAllowedType =
      contentType.includes('text/plain') ||
      contentType.includes('text/csv') ||
      contentType.includes('application/csv');

    if (!isAllowedType) {
      throw new Error(`Unexpected dataset content-type: ${contentType || 'unknown'}.`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader) {
      const declaredBytes = Number(contentLengthHeader);
      if (Number.isFinite(declaredBytes) && declaredBytes > MAX_DOWNLOAD_BYTES) {
        throw new Error(`Dataset exceeds maximum allowed file size (${MAX_DOWNLOAD_BYTES} bytes).`);
      }
    }

    if (!response.body) {
      throw new Error('Dataset response body is empty.');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_DOWNLOAD_BYTES) {
        await reader.cancel();
        throw new Error(`Dataset stream exceeded ${MAX_DOWNLOAD_BYTES} byte limit.`);
      }
      chunks.push(value);
    }

    const combined = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    const sha256 = crypto.createHash('sha256').update(combined).digest('hex');
    const csvText = combined.toString('utf8');

    return {
      csvText,
      httpStatus: response.status,
      contentType,
      byteSize: totalBytes,
      sha256,
      sourceHost: safeUrl.hostname,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Dataset download timed out after ${DOWNLOAD_TIMEOUT_MS}ms.`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function ensureValidatedDataset(options?: {
  forceRefresh?: boolean;
}): Promise<ValidatedDataset> {
  const forceRefresh = options?.forceRefresh === true;

  if (!forceRefresh && inMemoryDataset) {
    return inMemoryDataset;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const csvPath = assertConfinedDataPath(CACHED_CSV_PATH);
  const reportPath = assertConfinedDataPath(CACHED_REPORT_PATH);

  if (!forceRefresh) {
    try {
      const [cachedCsv, cachedReportRaw] = await Promise.all([
        fs.readFile(csvPath, 'utf8'),
        fs.readFile(reportPath, 'utf8'),
      ]);
      const cachedMeta = JSON.parse(cachedReportRaw) as DatasetValidationReport;
      const validated = parseAndValidateCsv(cachedCsv, {
        sourceHost: cachedMeta.sourceHost || 'raw.githubusercontent.com',
        httpStatus: cachedMeta.httpStatus || 200,
        contentType: cachedMeta.contentType || 'text/plain; charset=utf-8',
        byteSize: Buffer.byteLength(cachedCsv, 'utf8'),
        sha256: crypto.createHash('sha256').update(cachedCsv, 'utf8').digest('hex'),
        fetchedAt: cachedMeta.fetchedAt || new Date().toISOString(),
        cached: true,
      });
      inMemoryDataset = validated;
      return validated;
    } catch {
      // Cache absent or invalid; proceed to fresh server-side fetch
    }
  }

  const downloaded = await fetchDatasetWithLimits();
  const validated = parseAndValidateCsv(downloaded.csvText, {
    sourceHost: downloaded.sourceHost,
    httpStatus: downloaded.httpStatus,
    contentType: downloaded.contentType,
    byteSize: downloaded.byteSize,
    sha256: downloaded.sha256,
    fetchedAt: new Date().toISOString(),
    cached: false,
  });

  await Promise.all([
    fs.writeFile(csvPath, downloaded.csvText, 'utf8'),
    fs.writeFile(reportPath, JSON.stringify(validated.report, null, 2), 'utf8'),
  ]);

  inMemoryDataset = validated;
  return validated;
}

export function getCachedDatasetReport(): DatasetValidationReport | null {
  return inMemoryDataset?.report ?? null;
}
