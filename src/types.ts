/**
 * Core types for @veccompress/core
 */

export type Vector = number[];

/**
 * Compression methods supported by the library
 */
export enum CompressionMethod {
  /** Uniform Scalar Quantization - Simple grid-based quantization */
  LATTICE = 'LATTICE',
  
  /** Adaptive lattice with boundary-aware quantization */
  BOUNDARY_AWARE = 'BOUNDARY_AWARE',
  
  /** Centroid-based Vector Quantization (K-means) */
  K_MEANS = 'K_MEANS',
  
  /** Dimensionality reduction baseline */
  RANDOM_PROJECTION = 'RANDOM_PROJECTION',
}

/**
 * Configuration options for compression
 */
export interface CompressionOptions {
  /** Compression method to use */
  method?: CompressionMethod;
  
  /** Grid step size for lattice-based methods (default: 0.1) */
  gridStep?: number;
  
  /** Boundary detection threshold for boundary-aware method (default: 0.1) */
  boundaryMargin?: number;
  
  /** Number of clusters for K-means (default: 256) */
  clusterCount?: number;
  
  /** Target dimensionality for random projection (default: original / 2) */
  targetDim?: number;
  
  /** Neighbor count for quality metrics (default: 10) */
  k?: number;
  
  /** Whether to normalize vectors before compression (default: true) */
  normalize?: boolean;
  
  /** Random seed for reproducibility (default: 42) */
  seed?: number;
  
  /** Target recall for auto-tuning (0-1, default: 0.95) */
  targetRecall?: number;
  
  /** Enable automatic grid step adjustment (default: false) */
  autoAdjustGridStep?: boolean;
}

/**
 * Quality metrics for compressed vectors
 */
export interface CompressionMetrics {
  /** Recall@5 - Early collapse detection */
  recall5: number;
  
  /** Recall@10 - Main quality metric */
  recall10: number;
  
  /** Mean Reciprocal Rank */
  mrr: number;
  
  /** Mean Squared Error - Global distortion */
  mse: number;
  
  /** Local distortion - Avg distance to nearest neighbor */
  localDistortion: number;
  
  /** Trustworthiness - 1 - (false neighbors / k) */
  trustworthiness: number;
  
  /** Kendall's Tau - Rank correlation */
  kendallTau: number;
  
  /** Estimated compression ratio */
  compressionRatio: number;
  
  /** Precision@10 - False neighbor detection */
  precision10?: number;
  
  /** k-variance - Topology sensitivity across scales */
  kVariance?: number;
  
  /** Per-dimension MSE for dimension-specific analysis */
  perDimensionMSE?: number[];
  
  /** Dimension collapse ratio - max(MSE_i) / mean(MSE_i) */
  dimensionCollapseRatio?: number;
  
  /** Centroid survival ratio - unique_centroids / N */
  centroidSurvivalRatio?: number;
  
  /** Collapse index - Combined collapse score (0-1) */
  collapseIndex?: number;
}

/**
 * Regime classification for compression quality
 */
export enum Regime {
  /** Stable - High quality, no degradation detected */
  STABLE = 'STABLE',
  
  /** Pre-collapse - Early warning signals detected */
  PRE_COLLAPSE = 'PRE_COLLAPSE',
  
  /** Collapse - Significant quality degradation */
  COLLAPSE = 'COLLAPSE',
  
  /** Post-collapse - Severe quality loss */
  POST_COLLAPSE = 'POST_COLLAPSE'
}

/**
 * Result of compression with full analysis
 */
export interface CompressionAnalysisResult {
  /** Compressed vectors */
  compressed: Vector[];
  
  /** Original vectors (if needed for comparison) */
  original?: Vector[];
  
  /** Quality metrics */
  metrics: CompressionMetrics;
  
  /** Regime classification */
  regime: Regime;
  
  /** Compression ratio achieved */
  compressionRatio: number;
  
  /** Centroids (for K-means method) */
  centroids?: Vector[];
  
  /** Grid step used (for lattice methods) */
  gridStep?: number;
  
  /** Warnings or recommendations */
  warnings?: string[];
}

/**
 * Simple compression result without analysis
 */
export interface CompressionResult {
  /** Compressed vectors */
  compressed: Vector[];
  
  /** Estimated compression ratio */
  compressionRatio: number;
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}
