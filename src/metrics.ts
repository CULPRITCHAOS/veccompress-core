/**
 * Quality metrics calculation for compressed vectors
 */

import { Vector, CompressionMetrics, Regime } from './types';
import {
  euclideanDistance,
  findKNN,
  calculateKendallTau,
  countUniqueVectors,
} from './utils';

/**
 * Calculate comprehensive quality metrics
 * @param original - Original uncompressed vectors
 * @param compressed - Compressed vectors
 * @param k - Neighbor count for metrics (default: 10)
 * @returns Quality metrics including collapse detection signals
 */
export function calculateMetrics(
  original: Vector[],
  compressed: Vector[],
  k: number = 10
): CompressionMetrics {
  if (!original || !compressed || original.length === 0) {
    return {
      recall5: 0,
      recall10: 0,
      mrr: 0,
      mse: 0,
      localDistortion: 0,
      trustworthiness: 0,
      kendallTau: 0,
      compressionRatio: 0,
      precision10: 0,
      kVariance: 0,
      centroidSurvivalRatio: 0,
      perDimensionMSE: [],
      dimensionCollapseRatio: 1,
    };
  }

  // Sample for performance (max 200 points)
  const SAMPLE_LIMIT = 200;
  const step = Math.max(1, Math.floor(original.length / SAMPLE_LIMIT));
  let count = 0;

  let recall5Sum = 0;
  let recall10Sum = 0;
  let mrrSum = 0;
  let mseSum = 0;
  let localDistortionSum = 0;
  let trustworthinessSum = 0;
  let precision10Sum = 0;

  // For k-variance: track recall at different k values
  const kValues = [3, 7, 15, 30];
  const recallAtK: number[][] = kValues.map(() => []);

  // For per-dimension MSE
  const dim = original[0].length;
  const perDimMSE = Array(dim).fill(0);

  for (let i = 0; i < original.length; i += step) {
    const query = original[i];
    const compVec = compressed[i];

    if (!compVec || !query) continue;

    // Ground Truth: NN in Original Space
    const trueNN = findKNN(query, original, 30);

    // Experiment: NN in Compressed Space
    const compNN = findKNN(query, compressed, 30);

    // Recall@5
    const true5 = new Set(trueNN.slice(0, 5));
    const comp5 = new Set(compNN.slice(0, 5));
    let intersection5 = 0;
    comp5.forEach(id => {
      if (true5.has(id)) intersection5++;
    });
    recall5Sum += intersection5 / 5;

    // Recall@10
    const true10 = new Set(trueNN.slice(0, 10));
    const comp10 = new Set(compNN.slice(0, 10));
    let intersection10 = 0;
    comp10.forEach(id => {
      if (true10.has(id)) intersection10++;
    });
    recall10Sum += intersection10 / 10;

    // Precision@10: How many compressed neighbors are true neighbors?
    precision10Sum += intersection10 / 10;

    // Trustworthiness @ K=10
    trustworthinessSum += intersection10 / 10;

    // MRR (Mean Reciprocal Rank)
    const target = trueNN[1]; // 0 is self
    if (target !== undefined) {
      const rank = compNN.indexOf(target);
      if (rank !== -1) {
        mrrSum += 1 / (rank + 1);
      }
    } else {
      mrrSum += 1;
    }

    // Global Distortion (MSE)
    const sqDist = euclideanDistance(query, compVec) ** 2;
    mseSum += sqDist;

    // Per-dimension MSE
    for (let d = 0; d < dim; d++) {
      perDimMSE[d] += (query[d] - compVec[d]) ** 2;
    }

    // Local Distortion
    const nearestInCompressed = compressed[compNN[0]];
    const distToNN = euclideanDistance(query, nearestInCompressed);
    localDistortionSum += distToNN;

    // Calculate recall at different k for k-variance
    for (let ki = 0; ki < kValues.length; ki++) {
      const kVal = kValues[ki];
      const trueK = new Set(trueNN.slice(0, kVal));
      const compK = new Set(compNN.slice(0, kVal));
      let intersectionK = 0;
      compK.forEach(id => {
        if (trueK.has(id)) intersectionK++;
      });
      recallAtK[ki].push(intersectionK / kVal);
    }

    count++;
  }

  // Calculate Structure Preservation (Kendall Tau)
  const kt = calculateKendallTau(original, compressed, 40);

  // Safety checks for NaNs
  const safeDiv = (n: number, d: number) => (d === 0 || isNaN(n)) ? 0 : n / d;

  // Calculate k-variance
  const kMeans = recallAtK.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length);
  const kVariances = recallAtK.map((arr, i) => {
    const mean = kMeans[i];
    const variance = arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length;
    return variance;
  });
  const kVariance = kVariances.reduce((a, b) => a + b, 0) / kVariances.length;

  // Calculate per-dimension MSE
  const perDimensionMSE = perDimMSE.map(v => v / count);

  // Calculate dimension collapse ratio
  const maxDimMSE = Math.max(...perDimensionMSE);
  const meanDimMSE = perDimensionMSE.reduce((a, b) => a + b, 0) / perDimensionMSE.length;
  const dimensionCollapseRatio = meanDimMSE > 0 ? maxDimMSE / meanDimMSE : 1;

  // Centroid survival ratio
  const uniqueCentroids = countUniqueVectors(compressed);
  const centroidSurvivalRatio = uniqueCentroids / original.length;

  // Estimate compression ratio (rough estimate based on unique centroids)
  const compressionRatio = original.length / uniqueCentroids;

  // Calculate collapse index (composite score)
  const recall5 = safeDiv(recall5Sum, count);
  const precision10 = safeDiv(precision10Sum, count);
  
  const collapseIndex = 
    0.35 * (1 - recall5) +
    0.25 * (1 - precision10) +
    0.20 * Math.min(1, kVariance * 20) + // Normalize k-variance
    0.20 * (1 - centroidSurvivalRatio);

  return {
    recall5,
    recall10: safeDiv(recall10Sum, count),
    mrr: safeDiv(mrrSum, count),
    mse: safeDiv(mseSum, count),
    localDistortion: safeDiv(localDistortionSum, count),
    trustworthiness: safeDiv(trustworthinessSum, count),
    kendallTau: kt,
    compressionRatio,
    precision10,
    kVariance,
    perDimensionMSE,
    dimensionCollapseRatio,
    centroidSurvivalRatio,
    collapseIndex,
  };
}

/**
 * Detect regime based on metrics
 * @param metrics - Calculated quality metrics
 * @returns Regime classification
 */
export function detectRegime(metrics: CompressionMetrics): Regime {
  const collapseIndex = metrics.collapseIndex ?? 0;

  // Use collapse index (primary signal)
  if (collapseIndex < 0.15) return Regime.STABLE;
  if (collapseIndex < 0.35) return Regime.PRE_COLLAPSE;
  if (collapseIndex < 0.60) return Regime.COLLAPSE;
  return Regime.POST_COLLAPSE;
}
