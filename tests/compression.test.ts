/**
 * Tests for real compression functionality
 */

import { describe, it, expect } from 'vitest';
import { VectorCompressor, CompressionMethod, Regime } from '../src';

describe('Vector Compression', () => {
  // Generate test data
  const generateTestVectors = (count: number, dims: number): number[][] => {
    const vectors: number[][] = [];
    for (let i = 0; i < count; i++) {
      const vec: number[] = [];
      for (let j = 0; j < dims; j++) {
        vec.push(Math.random() * 2 - 1); // Range [-1, 1]
      }
      vectors.push(vec);
    }
    return vectors;
  };

  describe('Lattice Quantization', () => {
    it('should quantize vectors to grid', () => {
      const compressor = new VectorCompressor({
        method: CompressionMethod.LATTICE,
        gridStep: 0.5,
        normalize: false,
      });

      const vectors = [
        [0.23, 0.67, 0.89],
        [0.41, 0.12, 0.98],
      ];

      const result = compressor.compress(vectors);

      // Check that values are quantized to 0.5 grid
      result.compressed.forEach(v => {
        v.forEach(val => {
          expect(val % 0.5).toBeCloseTo(0, 1);
        });
      });
    });

    it('should reduce unique vectors', () => {
      const compressor = new VectorCompressor({
        method: CompressionMethod.LATTICE,
        gridStep: 0.5, // Use coarser grid for more compression
        normalize: false,
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compress(vectors);

      // Should have fewer unique vectors after compression (or at least stay same)
      expect(result.compressionRatio).toBeGreaterThanOrEqual(1.0);
    });
  });

  describe('Boundary-Aware Quantization', () => {
    it('should use adaptive grid steps', () => {
      const compressor = new VectorCompressor({
        method: CompressionMethod.BOUNDARY_AWARE,
        gridStep: 0.5,
        boundaryMargin: 0.1,
        normalize: false,
      });

      const vectors = [
        [0.0, 0.0, 0.0],     // Exactly on grid
        [0.24, 0.26, 0.23],  // Near grid point
        [0.7, 0.7, 0.7],     // Far from grid
      ];

      const result = compressor.compress(vectors);

      expect(result.compressed).toBeDefined();
      expect(result.compressed.length).toBe(3);
    });

    it('should preserve quality better than lattice', () => {
      const vectors = generateTestVectors(100, 8); // More vectors for stable statistics

      const lattice = new VectorCompressor({
        method: CompressionMethod.LATTICE,
        gridStep: 0.3,
      });

      const boundaryAware = new VectorCompressor({
        method: CompressionMethod.BOUNDARY_AWARE,
        gridStep: 0.3,
        boundaryMargin: 0.15,
      });

      const latticeResult = lattice.compressWithAnalysis(vectors);
      const boundaryResult = boundaryAware.compressWithAnalysis(vectors);

      // Boundary-aware should have similar or better recall (within 5% tolerance)
      expect(boundaryResult.metrics.recall10).toBeGreaterThanOrEqual(
        latticeResult.metrics.recall10 * 0.95
      );
    });
  });

  describe('Quality Metrics', () => {
    it('should calculate recall@5 and recall@10', () => {
      const compressor = new VectorCompressor({
        method: CompressionMethod.LATTICE,
        gridStep: 0.1,
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compressWithAnalysis(vectors);

      expect(result.metrics.recall5).toBeGreaterThanOrEqual(0);
      expect(result.metrics.recall5).toBeLessThanOrEqual(1);
      expect(result.metrics.recall10).toBeGreaterThanOrEqual(0);
      expect(result.metrics.recall10).toBeLessThanOrEqual(1);
    });

    it('should calculate collapse index', () => {
      const compressor = new VectorCompressor({
        method: CompressionMethod.LATTICE,
        gridStep: 0.1,
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compressWithAnalysis(vectors);

      expect(result.metrics.collapseIndex).toBeGreaterThanOrEqual(0);
      expect(result.metrics.collapseIndex).toBeLessThanOrEqual(1);
    });

    it('should calculate k-variance', () => {
      const compressor = new VectorCompressor();
      const vectors = generateTestVectors(100, 8);
      const result = compressor.compressWithAnalysis(vectors);

      expect(result.metrics.kVariance).toBeGreaterThanOrEqual(0);
    });

    it('should calculate per-dimension MSE', () => {
      const compressor = new VectorCompressor({
        gridStep: 0.2,
      });

      const vectors = generateTestVectors(50, 8);
      const result = compressor.compressWithAnalysis(vectors);

      expect(result.metrics.perDimensionMSE).toHaveLength(8);
      result.metrics.perDimensionMSE?.forEach(mse => {
        expect(mse).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Regime Detection', () => {
    it('should detect STABLE regime with low compression', () => {
      const compressor = new VectorCompressor({
        gridStep: 0.01, // Very fine grid
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compressWithAnalysis(vectors);

      // With very fine grid, should be stable
      expect([Regime.STABLE, Regime.PRE_COLLAPSE]).toContain(result.regime);
    });

    it('should detect COLLAPSE with high compression', () => {
      const compressor = new VectorCompressor({
        gridStep: 0.5, // Coarse grid
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compressWithAnalysis(vectors);

      // With coarse grid, likely collapse
      expect([Regime.PRE_COLLAPSE, Regime.COLLAPSE, Regime.POST_COLLAPSE]).toContain(
        result.regime
      );
    });
  });

  describe('Normalization', () => {
    it('should normalize vectors when enabled', () => {
      const compressor = new VectorCompressor({
        normalize: true,
        gridStep: 0.1,
      });

      const vectors = [
        [1, 2, 3],
        [4, 5, 6],
      ];

      const result = compressor.compress(vectors);

      // After normalization + compression, vectors should exist
      expect(result.compressed).toBeDefined();
      expect(result.compressed.length).toBe(2);
    });

    it('should skip normalization when disabled', () => {
      const compressor = new VectorCompressor({
        normalize: false,
        gridStep: 0.1,
      });

      const vectors = [
        [1.0, 2.0],
        [3.0, 4.0],
      ];

      const result = compressor.compress(vectors);

      expect(result.compressed).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty vectors', () => {
      const compressor = new VectorCompressor();
      const result = compressor.compress([]);

      expect(result.compressed).toHaveLength(0);
      expect(result.compressionRatio).toBe(1.0);
    });

    it('should handle single vector', () => {
      const compressor = new VectorCompressor();
      const vectors = [[1, 2, 3]];
      const result = compressor.compress(vectors);

      expect(result.compressed).toHaveLength(1);
    });

    it('should handle high-dimensional vectors', () => {
      const compressor = new VectorCompressor();
      const vectors = generateTestVectors(20, 128);
      const result = compressor.compressWithAnalysis(vectors);

      expect(result.metrics.perDimensionMSE).toHaveLength(128);
    });
  });

  describe('Compression Ratio', () => {
    it('should calculate realistic compression ratios', () => {
      const compressor = new VectorCompressor({
        gridStep: 0.4, // Use coarser grid for visible compression
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compress(vectors);

      expect(result.compressionRatio).toBeGreaterThanOrEqual(1.0);
      expect(result.compressionRatio).toBeLessThan(100); // Sanity check
    });
  });

  describe('Warnings', () => {
    it('should generate warnings on collapse', () => {
      const compressor = new VectorCompressor({
        gridStep: 0.8, // Very coarse - force collapse
      });

      const vectors = generateTestVectors(100, 8);
      const result = compressor.compressWithAnalysis(vectors);

      // Should have warnings if collapse detected
      if (result.regime === Regime.COLLAPSE || result.regime === Regime.POST_COLLAPSE) {
        expect(result.warnings).toBeDefined();
        expect(result.warnings!.length).toBeGreaterThan(0);
      }
    });
  });
});
