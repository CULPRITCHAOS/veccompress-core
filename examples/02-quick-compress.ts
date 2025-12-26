/**
 * Example 2: Quick Compress
 * 
 * One-liner compression with quality target.
 * Perfect for when you want simplicity.
 */

import { quickCompress } from '../src';

function generateVectors(count: number, dims: number): number[][] {
  return Array.from({ length: count }, () =>
    Array.from({ length: dims }, () => Math.random() * 2 - 1)
  );
}

console.log('='.repeat(60));
console.log('Example 2: Quick Compress (One-Liner)');
console.log('='.repeat(60));
console.log('');

const vectors = generateVectors(500, 128);
console.log(`📊 Input: ${vectors.length} vectors × ${vectors[0].length} dimensions`);
console.log('');

// Test different quality targets
const qualityTargets = [0.95, 0.90, 0.80, 0.70];

console.log('🔬 Testing different quality targets:');
console.log('');

qualityTargets.forEach(targetQuality => {
  const result = quickCompress(vectors, targetQuality);
  
  console.log(`Target Quality: ${(targetQuality * 100).toFixed(0)}%`);
  console.log(`  ├─ Compression: ${result.compressionRatio.toFixed(2)}×`);
  console.log(`  ├─ Actual Quality: ${(result.metrics.recall10 * 100).toFixed(1)}%`);
  console.log(`  └─ Regime: ${result.regime}`);
  console.log('');
});

console.log('💡 Key Insights:');
console.log('   - Higher quality target = finer grid = less compression');
console.log('   - Lower quality target = coarser grid = more compression');
console.log('   - quickCompress() automatically adjusts gridStep');
console.log('');

console.log('🎯 When to use:');
console.log('   ✅ Quick prototyping');
console.log('   ✅ When you know your quality target');
console.log('   ✅ Don\'t want to tune gridStep manually');
console.log('');
