/**
 * VectorCompressor - Main compression class with collapse detection
 */

import {
  Vector,
  CompressionMethod,
  CompressionOptions,
  CompressionResult,
  CompressionAnalysisResult,
  CompressionMetrics,
  Regime,
} from './types';
import {
  normalizeVectors,
  euclideanDistance,
  countUniqueVectors,
} from './utils';
import { calculateMetrics, detectRegime } from './metrics';

/**
 * Default compression options
 */
const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  method: CompressionMethod.BOUNDARY_AWARE,
  gridStep: 0.1,
  boundaryMargin: 0.1,
  clusterCount: 256,
  targetDim: 0,
  k: 10,
  normalize: true,
  seed: 42,
  targetRecall: 0.95,
  autoAdjustGridStep: false,
};

/**
 * VectorCompressor - Compress vectors with quality guarantees
 * 
 * @example
 * ```typescript
 * const compressor = new VectorCompressor({
 *   method: 'boundary-aware',
 *   targetRecall: 0.95
 * });
 * 
 * const result = compressor.compressWithAnalysis(vectors);
 * console.log(`Compressed ${result.compressionRatio}×`);
 * console.log(`Quality: ${result.metrics.recall10}`);
 * console.log(`Safe: ${result.regime === 'STABLE'}`);
 * ```
 */
export class VectorCompressor {
  private options: Required<CompressionOptions>;

  constructor(options: CompressionOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    // If targetDim is 0, we'll set it based on input dimensions
    if (this.options.targetDim === 0) {
      this.options.targetDim = DEFAULT_OPTIONS.targetDim;
    }
  }

  /**
   * Compress vectors (simple API - returns only compressed vectors)
   * 
   * @param vectors - Input vectors to compress
   * @returns Compressed vectors and compression ratio
   */
  compress(vectors: Vector[]): CompressionResult {
    if (!vectors || vectors.length === 0) {
      return {
        compressed: [],
        compressionRatio: 1.0,
      };
    }

    // Preprocess: normalization
    let processedVectors = vectors;
    if (this.options.normalize) {
      processedVectors = normalizeVectors(vectors);
    }

    // Compress based on method
    let compressed: Vector[];

    switch (this.options.method) {
      case CompressionMethod.LATTICE:
        compressed = this.latticeQuantization(processedVectors, this.options.gridStep);
        break;

      case CompressionMethod.BOUNDARY_AWARE:
        compressed = this.boundaryAwareQuantization(
          processedVectors,
          this.options.gridStep,
          this.options.boundaryMargin
        );
        break;

      case CompressionMethod.K_MEANS:
        // K-means not implemented in initial version
        compressed = processedVectors;
        break;

      case CompressionMethod.RANDOM_PROJECTION:
        // Random projection not implemented in initial version
        compressed = processedVectors;
        break;

      default:
        compressed = processedVectors;
    }

    // Calculate compression ratio
    const uniqueCentroids = countUniqueVectors(compressed);
    const compressionRatio = vectors.length / uniqueCentroids;

    return {
      compressed,
      compressionRatio,
    };
  }

  /**
   * Compress vectors with full quality analysis
   * 
   * @param vectors - Input vectors to compress
   * @returns Full analysis including metrics and regime
   */
  compressWithAnalysis(vectors: Vector[]): CompressionAnalysisResult {
    if (!vectors || vectors.length === 0) {
      return {
        compressed: [],
        original: vectors,
        metrics: this.emptyMetrics(),
        regime: Regime.STABLE,
        compressionRatio: 1.0,
        warnings: ['Empty input vectors'],
      };
    }

    // Compress
    const result = this.compress(vectors);

    // Calculate metrics
    const metrics = calculateMetrics(vectors, result.compressed, this.options.k);

    // Detect regime
    const regime = detectRegime(metrics);

    // Generate warnings
    const warnings: string[] = [];
    if (regime === Regime.COLLAPSE || regime === Regime.POST_COLLAPSE) {
      warnings.push(
        `Quality degradation detected (${regime}). Consider reducing gridStep or using boundary-aware method.`
      );
    }
    if (metrics.kVariance && metrics.kVariance > 0.02) {
      warnings.push('High k-variance detected - topology may be unstable.');
    }
    if (metrics.dimensionCollapseRatio && metrics.dimensionCollapseRatio > 2.0) {
      warnings.push('Dimension-specific collapse detected - some features affected more than others.');
    }

    return {
      compressed: result.compressed,
      original: vectors,
      metrics,
      regime,
      compressionRatio: result.compressionRatio,
      gridStep: this.options.gridStep,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Lattice quantization (Uniform Scalar Quantization)
   * Simple grid-based quantization
   */
  private latticeQuantization(vectors: Vector[], step: number): Vector[] {
    if (step <= 0) return vectors;

    return vectors.map(v => v.map(val => Math.round(val / step) * step));
  }

  /**
   * Boundary-aware adaptive quantization
   * Uses fine grid for points far from coarse grid (high distortion areas)
   */
  private boundaryAwareQuantization(
    vectors: Vector[],
    baseStep: number,
    threshold: number
  ): Vector[] {
    if (baseStep <= 0) return vectors;

    const fineStep = baseStep / 2;

    return vectors.map(v => {
      // Try coarse quantization
      const coarse = v.map(val => Math.round(val / baseStep) * baseStep);

      // Check if distortion is high
      const dist = euclideanDistance(v, coarse);

      // If high distortion, use finer grid
      if (dist > threshold) {
        return v.map(val => Math.round(val / fineStep) * fineStep);
      } else {
        return coarse;
      }
    });
  }

  /**
   * Get empty metrics (for error cases)
   */
  private emptyMetrics(): CompressionMetrics {
    return {
      recall5: 0,
      recall10: 0,
      mrr: 0,
      mse: 0,
      localDistortion: 0,
      trustworthiness: 0,
      kendallTau: 0,
      compressionRatio: 1.0,
      precision10: 0,
      kVariance: 0,
      centroidSurvivalRatio: 1.0,
      perDimensionMSE: [],
      dimensionCollapseRatio: 1.0,
      collapseIndex: 0,
    };
  }

  /**
   * Get current configuration options
   */
  getOptions(): Required<CompressionOptions> {
    return { ...this.options };
  }

  /**
   * Update configuration options
   */
  setOptions(options: Partial<CompressionOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}
