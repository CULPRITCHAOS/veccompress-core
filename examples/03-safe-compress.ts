/**
 * Example 3: Safe Compress
 * 
 * Automatically retries with finer grid if collapse detected.
 * Perfect for production where you MUST avoid quality loss.
 */

import { safeCompress } from '../src';

function generateClusteredData(clusters: number, perCluster: number, dims: number): number[][] {
  const vectors: number[][] = [];
  
  for (let c = 0; c < clusters; c++) {
    // Random cluster center
    const center = Array.from({ length: dims }, () => Math.random() * 10 - 5);
    
    // Points around center
    for (let p = 0; p < perCluster; p++) {
      const point = center.map(val => val + (Math.random() - 0.5) * 0.5);
      vectors.push(point);
    }
  }
  
  return vectors;
}

console.log('='.repeat(60));
console.log('Example 3: Safe Compress (Auto-Retry)');
console.log('='.repeat(60));
console.log('');

// Generate challenging dataset (tightly clustered)
const vectors = generateClusteredData(10, 50, 64);
console.log(`📊 Input: ${vectors.length} vectors × ${vectors[0].length} dimensions`);
console.log(`   Structure: 10 tight clusters`);
console.log('');

// Safe compress with max 3 attempts
console.log('🛡️  Running safe compress (max 3 attempts)...');
const result = safeCompress(vectors, 3);
console.log('');

console.log('✅ Results:');
console.log(`   Compression: ${result.compressionRatio.toFixed(2)}×`);
console.log(`   Quality: ${(result.metrics.recall10 * 100).toFixed(1)}%`);
console.log(`   Regime: ${result.regime}`);
console.log(`   Grid Step Used: ${result.gridStep}`);
console.log('');

// Show the safety guarantee
console.log('🛡️  Safety Guarantee:');
if (result.regime === 'STABLE' || result.regime === 'PRE_COLLAPSE') {
  console.log('   ✅ GUARANTEED safe regime achieved!');
  console.log('   ✅ No collapse detected');
  console.log('   ✅ Safe for production deployment');
} else {
  console.log('   ⚠️  Could not achieve stable regime');
  console.log('   ⚠️  Consider using even finer grid or different method');
}
console.log('');

console.log('💡 How it works:');
console.log('   1. Tries compression with initial grid (0.2)');
console.log('   2. If COLLAPSE detected → refine grid (0.1)');
console.log('   3. If still COLLAPSE → refine again (0.05)');
console.log('   4. Returns best result (STABLE or PRE_COLLAPSE)');
console.log('');

console.log('🎯 When to use:');
console.log('   ✅ Production deployments');
console.log('   ✅ When quality is critical');
console.log('   ✅ Don\'t know optimal gridStep');
console.log('   ✅ Want automatic fallback');
console.log('');
