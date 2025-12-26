/**
 * @veccompress/core
 * 
 * Production-ready vector compression with collapse detection
 */

export { VectorCompressor } from './compressor';
export * from './types';
export { calculateMetrics, detectRegime } from './metrics';
export { normalizeVectors, euclideanDistance, findKNN } from './utils';

// Version
export const VERSION = '0.1.0';
