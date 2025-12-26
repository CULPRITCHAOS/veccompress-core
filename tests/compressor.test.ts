/**
 * Tests for VectorCompressor
 */

import { describe, it, expect } from 'vitest';
import { VectorCompressor, CompressionMethod, Regime } from '../src';

describe('VectorCompressor', () => {
  it('should create compressor with default options', () => {
    const compressor = new VectorCompressor();
    const options = compressor.getOptions();
    
    expect(options.method).toBe(CompressionMethod.BOUNDARY_AWARE);
    expect(options.gridStep).toBe(0.1);
    expect(options.k).toBe(10);
  });

  it('should create compressor with custom options', () => {
    const compressor = new VectorCompressor({
      method: CompressionMethod.LATTICE,
      gridStep: 0.05,
      k: 5,
    });
    const options = compressor.getOptions();
    
    expect(options.method).toBe(CompressionMethod.LATTICE);
    expect(options.gridStep).toBe(0.05);
    expect(options.k).toBe(5);
  });

  it('should compress vectors (placeholder)', () => {
    const compressor = new VectorCompressor();
    const vectors = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const result = compressor.compress(vectors);
    
    expect(result.compressed).toBeDefined();
    expect(result.compressionRatio).toBeGreaterThan(0);
  });

  it('should compress with analysis (placeholder)', () => {
    const compressor = new VectorCompressor();
    const vectors = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const result = compressor.compressWithAnalysis(vectors);
    
    expect(result.compressed).toBeDefined();
    expect(result.metrics).toBeDefined();
    // Regime can be any valid regime
    expect([Regime.STABLE, Regime.PRE_COLLAPSE, Regime.COLLAPSE, Regime.POST_COLLAPSE]).toContain(result.regime);
    expect(result.metrics.recall10).toBeGreaterThanOrEqual(0);
    expect(result.metrics.recall10).toBeLessThanOrEqual(1);
  });

  it('should update options', () => {
    const compressor = new VectorCompressor();
    compressor.setOptions({ gridStep: 0.2 });
    
    const options = compressor.getOptions();
    expect(options.gridStep).toBe(0.2);
  });

  it('should handle empty vector array', () => {
    const compressor = new VectorCompressor();
    const vectors: number[][] = [];

    const result = compressor.compress(vectors);
    expect(result.compressed).toBeDefined();
  });
});
