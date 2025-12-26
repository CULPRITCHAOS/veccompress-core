/**
 * Example 1: Basic Usage
 * 
 * The simplest way to compress vectors with quality analysis.
 */

import { VectorCompressor } from '../src';

// Generate sample embeddings (simulating BERT embeddings: 768 dimensions)
function generateSampleEmbeddings(count: number, dims: number): number[][] {
  const embeddings: number[][] = [];
  
  for (let i = 0; i < count; i++) {
    const embedding: number[] = [];
    for (let d = 0; d < dims; d++) {
      // Random normalized values
      embedding.push(Math.random() * 2 - 1);
    }
    embeddings.push(embedding);
  }
  
  return embeddings;
}

console.log('='.repeat(60));
console.log('Example 1: Basic Vector Compression');
console.log('='.repeat(60));
console.log('');

// Generate 1000 embeddings with 768 dimensions (like BERT)
console.log('📊 Generating embeddings...');
const embeddings = generateSampleEmbeddings(1000, 768);
console.log(`   Created ${embeddings.length} vectors × ${embeddings[0].length} dimensions`);
console.log('');

// Compress with default settings
console.log('🗜️  Compressing vectors...');
const compressor = new VectorCompressor();
const result = compressor.compressWithAnalysis(embeddings);
console.log('');

// Display results
console.log('✅ Results:');
console.log(`   Compression Ratio: ${result.compressionRatio.toFixed(2)}×`);
console.log(`   Recall@10: ${(result.metrics.recall10 * 100).toFixed(1)}%`);
console.log(`   Precision@10: ${(result.metrics.precision10! * 100).toFixed(1)}%`);
console.log(`   k-variance: ${result.metrics.kVariance?.toFixed(4)}`);
console.log(`   Collapse Index: ${result.metrics.collapseIndex?.toFixed(3)}`);
console.log(`   Regime: ${result.regime}`);
console.log('');

// Interpret results
console.log('💡 Interpretation:');
if (result.regime === 'STABLE') {
  console.log('   ✅ Compression is SAFE! Quality preserved.');
} else if (result.regime === 'PRE_COLLAPSE') {
  console.log('   ⚠️  Early warning: Monitor quality closely.');
} else {
  console.log('   🔴 Quality degraded: Reduce gridStep or use finer settings.');
}
console.log('');

// Show warnings if any
if (result.warnings && result.warnings.length > 0) {
  console.log('⚠️  Warnings:');
  result.warnings.forEach(warning => {
    console.log(`   - ${warning}`);
  });
  console.log('');
}

// Size comparison
const originalSize = embeddings.length * embeddings[0].length * 4; // 4 bytes per float32
const compressedSize = originalSize / result.compressionRatio;

console.log('💾 Storage Savings:');
console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Saved: ${((1 - 1/result.compressionRatio) * 100).toFixed(1)}%`);
console.log('');

console.log('🎯 Next Steps:');
console.log('   - Try quickCompress() for one-liner compression');
console.log('   - Use safeCompress() for auto-tuning');
console.log('   - Check other examples for advanced usage');
console.log('');
