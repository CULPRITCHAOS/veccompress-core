/**
 * Example 5: Method Comparison
 * 
 * Compare Lattice vs Boundary-Aware quantization.
 * Shows which method works better for your data.
 */

import { compareMethods } from '../src';

function generateComplexData(count: number, dims: number): number[][] {
  const vectors: number[][] = [];
  
  // Mix of dense clusters and sparse regions
  for (let i = 0; i < count; i++) {
    const vec: number[] = [];
    const clusterType = Math.random();
    
    for (let d = 0; d < dims; d++) {
      if (clusterType < 0.7) {
        // Dense cluster (70% of data)
        vec.push((Math.random() - 0.5) * 0.5);
      } else {
        // Sparse region (30% of data)
        vec.push((Math.random() - 0.5) * 5);
      }
    }
    
    vectors.push(vec);
  }
  
  return vectors;
}

console.log('='.repeat(60));
console.log('Example 5: Method Comparison');
console.log('='.repeat(60));
console.log('');

// Generate complex dataset
const vectors = generateComplexData(1000, 64);
console.log(`📊 Input: ${vectors.length} vectors × ${vectors[0].length} dimensions`);
console.log(`   Structure: Mixed dense/sparse regions`);
console.log('');

// Compare methods at different grid steps
const gridSteps = [0.1, 0.2, 0.3];

console.log('🔬 Comparing Lattice vs Boundary-Aware:');
console.log('');

gridSteps.forEach(gridStep => {
  console.log(`Grid Step: ${gridStep}`);
  console.log('-'.repeat(40));
  
  const comparison = compareMethods(vectors, gridStep);
  
  // Lattice results
  console.log('Lattice Quantization:');
  console.log(`  ├─ Compression: ${comparison.lattice.compressionRatio.toFixed(2)}×`);
  console.log(`  ├─ Recall@10: ${(comparison.lattice.metrics.recall10 * 100).toFixed(1)}%`);
  console.log(`  ├─ Collapse Index: ${comparison.lattice.metrics.collapseIndex?.toFixed(3)}`);
  console.log(`  └─ Regime: ${comparison.lattice.regime}`);
  console.log('');
  
  // Boundary-Aware results
  console.log('Boundary-Aware:');
  console.log(`  ├─ Compression: ${comparison.boundaryAware.compressionRatio.toFixed(2)}×`);
  console.log(`  ├─ Recall@10: ${(comparison.boundaryAware.metrics.recall10 * 100).toFixed(1)}%`);
  console.log(`  ├─ Collapse Index: ${comparison.boundaryAware.metrics.collapseIndex?.toFixed(3)}`);
  console.log(`  └─ Regime: ${comparison.boundaryAware.regime}`);
  console.log('');
  
  // Show improvement
  console.log('Improvement (Boundary-Aware over Lattice):');
  console.log(`  ├─ Recall: ${(comparison.improvement.recall10 > 0 ? '+' : '')}${(comparison.improvement.recall10 * 100).toFixed(1)}%`);
  console.log(`  ├─ Compression: ${(comparison.improvement.compressionRatio > 0 ? '+' : '')}${comparison.improvement.compressionRatio.toFixed(2)}×`);
  console.log(`  └─ Collapse Index: ${(comparison.improvement.collapseIndex > 0 ? '+' : '')}${comparison.improvement.collapseIndex.toFixed(3)} (lower is better)`);
  console.log('');
});

console.log('💡 Key Insights:');
console.log('   - Lattice: Faster, simpler, good for uniform data');
console.log('   - Boundary-Aware: Better quality, adaptive, good for clustered data');
console.log('   - Trade-off: Quality vs Compression ratio');
console.log('');

console.log('🎯 Which to choose:');
console.log('   Lattice:');
console.log('     ✅ Speed is critical');
console.log('     ✅ Data is uniformly distributed');
console.log('     ✅ Maximum compression needed');
console.log('');
console.log('   Boundary-Aware:');
console.log('     ✅ Quality is critical');
console.log('     ✅ Data has clusters/structure');
console.log('     ✅ Can afford slightly less compression');
console.log('');
