/**
 * Example 4: Batch Processing
 * 
 * Compress multiple datasets with same settings.
 * Perfect for processing user/product/content embeddings together.
 */

import { batchCompress } from '../src';

function generateDataset(name: string, count: number, dims: number): number[][] {
  console.log(`   Generating ${name}: ${count} vectors × ${dims} dims`);
  return Array.from({ length: count }, () =>
    Array.from({ length: dims }, () => Math.random() * 2 - 1)
  );
}

console.log('='.repeat(60));
console.log('Example 4: Batch Processing');
console.log('='.repeat(60));
console.log('');

// Generate multiple datasets
console.log('📊 Creating datasets...');
const datasets = [
  generateDataset('User Embeddings', 10000, 256),
  generateDataset('Product Embeddings', 50000, 256),
  generateDataset('Content Embeddings', 5000, 512),
  generateDataset('Search Queries', 20000, 128),
];
console.log('');

// Batch compress all at once
console.log('🗜️  Batch compressing (gridStep = 0.15)...');
const startTime = Date.now();
const results = batchCompress(datasets, 0.15);
const endTime = Date.now();
console.log(`   Completed in ${endTime - startTime}ms`);
console.log('');

// Display results
console.log('✅ Results:');
console.log('');

const datasetNames = ['Users', 'Products', 'Content', 'Queries'];
results.forEach((result, i) => {
  const originalSize = datasets[i].length * datasets[i][0].length * 4 / 1024 / 1024;
  const compressedSize = originalSize / result.compressionRatio;
  const saved = originalSize - compressedSize;
  
  console.log(`${datasetNames[i]}:`);
  console.log(`  ├─ Vectors: ${datasets[i].length.toLocaleString()}`);
  console.log(`  ├─ Compression: ${result.compressionRatio.toFixed(2)}×`);
  console.log(`  ├─ Quality: ${(result.metrics.recall10 * 100).toFixed(1)}%`);
  console.log(`  ├─ Regime: ${result.regime}`);
  console.log(`  ├─ Original: ${originalSize.toFixed(2)} MB`);
  console.log(`  ├─ Compressed: ${compressedSize.toFixed(2)} MB`);
  console.log(`  └─ Saved: ${saved.toFixed(2)} MB`);
  console.log('');
});

// Total savings
const totalOriginal = datasets.reduce((sum, ds, i) => 
  sum + ds.length * ds[0].length * 4, 0
) / 1024 / 1024;

const totalCompressed = results.reduce((sum, result, i) => 
  sum + datasets[i].length * datasets[i][0].length * 4 / result.compressionRatio, 0
) / 1024 / 1024;

console.log('💾 Total Storage Savings:');
console.log(`   Original: ${totalOriginal.toFixed(2)} MB`);
console.log(`   Compressed: ${totalCompressed.toFixed(2)} MB`);
console.log(`   Saved: ${(totalOriginal - totalCompressed).toFixed(2)} MB (${((1 - totalCompressed/totalOriginal) * 100).toFixed(1)}%)`);
console.log('');

console.log('💡 Benefits:');
console.log('   ✅ Single compression call for multiple datasets');
console.log('   ✅ Consistent settings across all data');
console.log('   ✅ Efficient processing');
console.log('   ✅ Easy to compare results');
console.log('');

console.log('🎯 When to use:');
console.log('   ✅ Multiple related datasets');
console.log('   ✅ User + Product + Content embeddings');
console.log('   ✅ Multi-tenant applications');
console.log('   ✅ Bulk preprocessing');
console.log('');
