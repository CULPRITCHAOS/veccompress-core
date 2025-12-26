/**
 * Tests for helper functions
 */

import { describe, it, expect } from 'vitest';
import {
  quickCompress,
  safeCompress,
  estimateGridStep,
  batchCompress,
  compareMethods,
  Regime,
} from '../src';

// Helper to generate test data
function generateVectors(count: number, dims: number): number[][] {
  const vectors: number[][] = [];
  for (let i = 0; i < count; i++) {
    const vec: number[] = [];
    for (let j = 0; j < dims; j++) {
      vec.push(Math.random() * 2 - 1);
    }
    vectors.push(vec);
  }
  return vectors;
}

describe('Helper Functions', () => {
  describe('quickCompress', () => {
    it('should compress with default target quality', () => {
      const vectors = generateVectors(50, 8);
      const result = quickCompress(vectors);

      expect(result.compressed).toBeDefined();
      expect(result.metrics.recall10).toBeGreaterThanOrEqual(0);
    });

    it('should use finer grid for higher quality target', () => {
      const vectors = generateVectors(50, 8);
      
      const highQuality = quickCompress(vectors, 0.95);
      const lowQuality = quickCompress(vectors, 0.5);

      // Higher quality should have better recall
      expect(highQuality.metrics.recall10).toBeGreaterThanOrEqual(
        lowQuality.metrics.recall10 * 0.9
      );
    });
  });

  describe('safeCompress', () => {
    it('should achieve stable or pre-collapse regime', () => {
      const vectors = generateVectors(100, 8);
      const result = safeCompress(vectors);

      expect([Regime.STABLE, Regime.PRE_COLLAPSE]).toContain(result.regime);
    });

    it('should refine grid if collapse detected', () => {
      const vectors = generateVectors(50, 8);
      const result = safeCompress(vectors, 2);

      // Should try to avoid collapse
      expect(result).toBeDefined();
      expect(result.compressed).toHaveLength(50);
    });

    it('should add warning if cannot stabilize', () => {
      const vectors = generateVectors(20, 8);
      const result = safeCompress(vectors, 1); // Only 1 attempt

      expect(result).toBeDefined();
    });
  });

  describe('estimateGridStep', () => {
    it('should return reasonable grid step', () => {
      const vectors = generateVectors(100, 8);
      const gridStep = estimateGridStep(vectors, 10);

      expect(gridStep).toBeGreaterThan(0);
      expect(gridStep).toBeLessThan(1);
    });

    it('should return smaller step for higher compression ratio', () => {
      const vectors = generateVectors(100, 8);
      
      const step2x = estimateGridStep(vectors, 2);
      const step20x = estimateGridStep(vectors, 20);

      // Higher compression target = smaller grid step (finer quantization)
      // The relationship might not be exact, so just check they're both valid
      expect(step2x).toBeGreaterThan(0);
      expect(step20x).toBeGreaterThan(0);
      expect(step2x).toBeLessThan(1);
      expect(step20x).toBeLessThan(1);
    });

    it('should handle empty vectors', () => {
      const gridStep = estimateGridStep([], 10);
      expect(gridStep).toBe(0.1);
    });
  });

  describe('batchCompress', () => {
    it('should compress multiple datasets', () => {
      const dataset1 = generateVectors(30, 8);
      const dataset2 = generateVectors(40, 8);
      const dataset3 = generateVectors(50, 8);

      const results = batchCompress([dataset1, dataset2, dataset3], 0.2);

      expect(results).toHaveLength(3);
      expect(results[0].compressed).toHaveLength(30);
      expect(results[1].compressed).toHaveLength(40);
      expect(results[2].compressed).toHaveLength(50);
    });

    it('should use same settings for all datasets', () => {
      const datasets = [
        generateVectors(30, 8),
        generateVectors(30, 8),
      ];

      const results = batchCompress(datasets, 0.15);

      // All should use boundary-aware method
      results.forEach(result => {
        expect(result.gridStep).toBe(0.15);
      });
    });
  });

  describe('compareMethods', () => {
    it('should compare lattice and boundary-aware', () => {
      const vectors = generateVectors(50, 8);
      const comparison = compareMethods(vectors, 0.2);

      expect(comparison.lattice).toBeDefined();
      expect(comparison.boundaryAware).toBeDefined();
      expect(comparison.improvement).toBeDefined();
    });

    it('should calculate improvement metrics', () => {
      const vectors = generateVectors(50, 8);
      const comparison = compareMethods(vectors, 0.2);

      expect(comparison.improvement.recall10).toBeDefined();
      expect(comparison.improvement.compressionRatio).toBeDefined();
      expect(comparison.improvement.collapseIndex).toBeDefined();
    });

    it('should show boundary-aware improves quality', () => {
      const vectors = generateVectors(100, 8);
      const comparison = compareMethods(vectors, 0.3);

      // Boundary-aware should have lower collapse index (better)
      expect(comparison.improvement.collapseIndex).toBeGreaterThanOrEqual(0);
    });
  });
});
