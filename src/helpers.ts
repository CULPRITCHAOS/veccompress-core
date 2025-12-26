/**
 * Helper functions for common use cases
 */

import { Vector, CompressionMethod } from './types';
import { VectorCompressor } from './compressor';

/**
 * Quick compress - compress with sensible defaults
 * @param vectors - Input vectors
 * @param targetQuality - Target recall (0-1, default: 0.9)
 * @returns Compressed vectors and analysis
 */
export function quickCompress(vectors: Vector[], targetQuality: number = 0.9) {
  // Auto-select grid step based on target quality
  // Higher quality = finer grid
  const gridStep = 0.5 - (targetQuality * 0.4); // 0.1 for 90% quality, 0.5 for 0% quality

  const compressor = new VectorCompressor({
    method: CompressionMethod.BOUNDARY_AWARE,
    gridStep,
    boundaryMargin: gridStep,
  });

  return compressor.compressWithAnalysis(vectors);
}

/**
 * Safe compress - automatically back off if collapse detected
 * @param vectors - Input vectors
 * @param maxAttempts - Maximum grid refinement attempts (default: 3)
 * @returns Compressed vectors with stable regime
 */
export function safeCompress(vectors: Vector[], maxAttempts: number = 3) {
  let gridStep = 0.2;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const compressor = new VectorCompressor({
      method: CompressionMethod.BOUNDARY_AWARE,
      gridStep,
      boundaryMargin: gridStep / 2,
    });

    const result = compressor.compressWithAnalysis(vectors);

    // If stable or pre-collapse, we're good
    if (result.regime === 'STABLE' || result.regime === 'PRE_COLLAPSE') {
      return result;
    }

    // Otherwise, refine grid
    gridStep = gridStep / 2;
  }

  // If all attempts failed, return last result with warning
  const compressor = new VectorCompressor({
    method: CompressionMethod.BOUNDARY_AWARE,
    gridStep,
  });

  const result = compressor.compressWithAnalysis(vectors);
  result.warnings = [
    ...(result.warnings || []),
    `Could not achieve stable compression after ${maxAttempts} attempts`,
  ];

  return result;
}

/**
 * Estimate optimal grid step for target compression ratio
 * @param vectors - Sample vectors
 * @param targetRatio - Desired compression ratio (e.g., 10 for 10×)
 * @returns Estimated grid step
 */
export function estimateGridStep(vectors: Vector[], targetRatio: number): number {
  if (vectors.length === 0) return 0.1;

  // Take sample of vectors
  const sample = vectors.slice(0, Math.min(100, vectors.length));

  // Calculate variance
  let sumVar = 0;
  const dim = sample[0].length;

  for (let d = 0; d < dim; d++) {
    const vals = sample.map(v => v[d]);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((sum, val) => sum + (val - mean) ** 2, 0) / vals.length;
    sumVar += variance;
  }

  const avgStd = Math.sqrt(sumVar / dim);

  // Heuristic: grid step proportional to std dev and inversely proportional to target ratio
  // Higher ratio = coarser grid
  const gridStep = (avgStd * 0.5) / Math.sqrt(targetRatio);

  return Math.max(0.01, Math.min(1.0, gridStep));
}

/**
 * Batch compress - compress multiple datasets with same settings
 * @param datasets - Array of vector arrays
 * @param gridStep - Grid step to use
 * @returns Array of compression results
 */
export function batchCompress(datasets: Vector[][], gridStep: number = 0.1) {
  const compressor = new VectorCompressor({
    gridStep,
    method: CompressionMethod.BOUNDARY_AWARE,
  });

  return datasets.map(vectors => compressor.compressWithAnalysis(vectors));
}

/**
 * Compare compression methods
 * @param vectors - Input vectors
 * @param gridStep - Grid step to use
 * @returns Comparison of lattice vs boundary-aware
 */
export function compareMethods(vectors: Vector[], gridStep: number = 0.2) {
  const lattice = new VectorCompressor({
    method: CompressionMethod.LATTICE,
    gridStep,
  });

  const boundaryAware = new VectorCompressor({
    method: CompressionMethod.BOUNDARY_AWARE,
    gridStep,
    boundaryMargin: gridStep / 2,
  });

  const latticeResult = lattice.compressWithAnalysis(vectors);
  const boundaryResult = boundaryAware.compressWithAnalysis(vectors);

  return {
    lattice: latticeResult,
    boundaryAware: boundaryResult,
    improvement: {
      recall10: boundaryResult.metrics.recall10 - latticeResult.metrics.recall10,
      compressionRatio:
        boundaryResult.compressionRatio - latticeResult.compressionRatio,
      collapseIndex:
        (latticeResult.metrics.collapseIndex ?? 0) -
        (boundaryResult.metrics.collapseIndex ?? 0),
    },
  };
}
