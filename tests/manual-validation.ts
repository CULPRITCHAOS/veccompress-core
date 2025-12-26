/**
 * Manual validation - test with realistic data
 */

import { VectorCompressor, CompressionMethod } from '../src';

// Generate clustered data (realistic scenario)
function generateClusteredData(numClusters: number, pointsPerCluster: number, dims: number): number[][] {
  const vectors: number[][] = [];
  
  for (let c = 0; c < numClusters; c++) {
    // Random cluster center
    const center = Array.from({ length: dims }, () => Math.random() * 10 - 5);
    
    // Points around center
    for (let p = 0; p < pointsPerCluster; p++) {
      const point = center.map(val => val + (Math.random() - 0.5) * 0.5);
      vectors.push(point);
    }
  }
  
  return vectors;
}

console.log('🔬 Manual Validation Test\n');

// Test 1: Basic compression
console.log('Test 1: Basic Lattice Compression');
console.log('=====================================');
const vectors1 = generateClusteredData(5, 20, 8);
const compressor1 = new VectorCompressor({
  method: CompressionMethod.LATTICE,
  gridStep: 0.2,
});

const result1 = compressor1.compressWithAnalysis(vectors1);
console.log(`📊 Vectors: ${vectors1.length}`);
console.log(`📦 Compression Ratio: ${result1.compressionRatio.toFixed(2)}×`);
console.log(`✅ Recall@10: ${(result1.metrics.recall10 * 100).toFixed(1)}%`);
console.log(`✅ Precision@10: ${(result1.metrics.precision10! * 100).toFixed(1)}%`);
console.log(`📈 k-variance: ${result1.metrics.kVariance?.toFixed(4)}`);
console.log(`🎯 Collapse Index: ${result1.metrics.collapseIndex?.toFixed(3)}`);
console.log(`🚦 Regime: ${result1.regime}`);
console.log('');

// Test 2: Boundary-aware (should be better)
console.log('Test 2: Boundary-Aware Compression');
console.log('=====================================');
const compressor2 = new VectorCompressor({
  method: CompressionMethod.BOUNDARY_AWARE,
  gridStep: 0.2,
  boundaryMargin: 0.1,
});

const result2 = compressor2.compressWithAnalysis(vectors1);
console.log(`📊 Vectors: ${vectors1.length}`);
console.log(`📦 Compression Ratio: ${result2.compressionRatio.toFixed(2)}×`);
console.log(`✅ Recall@10: ${(result2.metrics.recall10 * 100).toFixed(1)}%`);
console.log(`✅ Precision@10: ${(result2.metrics.precision10! * 100).toFixed(1)}%`);
console.log(`📈 k-variance: ${result2.metrics.kVariance?.toFixed(4)}`);
console.log(`🎯 Collapse Index: ${result2.metrics.collapseIndex?.toFixed(3)}`);
console.log(`🚦 Regime: ${result2.regime}`);
console.log('');

// Test 3: Collapse detection (coarse grid)
console.log('Test 3: Intentional Collapse (Coarse Grid)');
console.log('=====================================');
const compressor3 = new VectorCompressor({
  method: CompressionMethod.LATTICE,
  gridStep: 0.8, // Very coarse!
});

const result3 = compressor3.compressWithAnalysis(vectors1);
console.log(`📊 Vectors: ${vectors1.length}`);
console.log(`📦 Compression Ratio: ${result3.compressionRatio.toFixed(2)}×`);
console.log(`✅ Recall@10: ${(result3.metrics.recall10 * 100).toFixed(1)}%`);
console.log(`✅ Precision@10: ${(result3.metrics.precision10! * 100).toFixed(1)}%`);
console.log(`📈 k-variance: ${result3.metrics.kVariance?.toFixed(4)}`);
console.log(`🎯 Collapse Index: ${result3.metrics.collapseIndex?.toFixed(3)}`);
console.log(`🚦 Regime: ${result3.regime}`);
if (result3.warnings) {
  console.log(`⚠️  Warnings:`);
  result3.warnings.forEach(w => console.log(`   - ${w}`));
}
console.log('');

// Test 4: High-dimensional data
console.log('Test 4: High-Dimensional Vectors (128D)');
console.log('=====================================');
const vectors4 = generateClusteredData(3, 30, 128);
const compressor4 = new VectorCompressor({
  gridStep: 0.15,
});

const result4 = compressor4.compressWithAnalysis(vectors4);
console.log(`📊 Vectors: ${vectors4.length}, Dims: 128`);
console.log(`📦 Compression Ratio: ${result4.compressionRatio.toFixed(2)}×`);
console.log(`✅ Recall@10: ${(result4.metrics.recall10 * 100).toFixed(1)}%`);
console.log(`🎯 Collapse Index: ${result4.metrics.collapseIndex?.toFixed(3)}`);
console.log(`🚦 Regime: ${result4.regime}`);
console.log(`📊 Dimension Collapse Ratio: ${result4.metrics.dimensionCollapseRatio?.toFixed(2)}`);
console.log('');

console.log('✅ All manual validation tests complete!');
console.log('');
console.log('💡 Key Observations:');
console.log('   - Boundary-aware should preserve quality better than lattice');
console.log('   - Coarse grid should trigger collapse warnings');
console.log('   - High-dimensional data should work without issues');
console.log('   - Regime detection should match quality metrics');
