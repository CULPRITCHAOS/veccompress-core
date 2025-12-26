/**
 * @veccompress/core
 * 
 * Production-ready vector compression with collapse detection
 */

export { VectorCompressor } from './compressor';
export * from './types';
export { calculateMetrics, detectRegime } from './metrics';
export { normalizeVectors, euclideanDistance, findKNN } from './utils';
export {
  quickCompress,
  safeCompress,
  estimateGridStep,
  batchCompress,
  compareMethods,
} from './helpers';

// Version
export const VERSION = '0.1.0';
