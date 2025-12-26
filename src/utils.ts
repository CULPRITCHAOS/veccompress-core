/**
 * Utility functions for vector operations
 */

import { Vector } from './types';

/**
 * Seeded Random Number Generator for reproducible results
 * Uses Mulberry32 algorithm
 */
export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /** Generate next random number in [0, 1) */
  next(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Generate random number in range [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

/**
 * Normalize vectors to unit length
 */
export function normalizeVectors(vectors: Vector[]): Vector[] {
  return vectors.map(v => {
    let magSq = 0;
    for (let i = 0; i < v.length; i++) magSq += v[i] * v[i];
    const mag = Math.sqrt(magSq);
    if (mag === 0) return v.map(() => 0); // Handle zero vector
    return v.map(val => val / mag);
  });
}

/**
 * Calculate Euclidean distance between two vectors
 */
export function euclideanDistance(a: Vector, b: Vector): number {
  if (!a || !b) return 0;
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Find K nearest neighbors
 * @param query - Query vector
 * @param haystack - Array of vectors to search
 * @param k - Number of neighbors to find
 * @returns Indices of k nearest neighbors
 */
export function findKNN(query: Vector, haystack: Vector[], k: number): number[] {
  if (!query || !haystack) return [];
  
  const distances = new Array(haystack.length);
  for (let i = 0; i < haystack.length; i++) {
    distances[i] = { idx: i, dist: euclideanDistance(query, haystack[i]) };
  }
  distances.sort((a, b) => a.dist - b.dist);
  
  const res = new Array(Math.min(k, distances.length));
  for (let i = 0; i < res.length; i++) res[i] = distances[i].idx;
  return res;
}

/**
 * Kendall's Tau rank correlation (sampled for performance)
 */
export function calculateKendallTau(orig: Vector[], comp: Vector[], sampleSize = 50): number {
  const n = Math.min(orig.length, sampleSize);
  let concordant = 0;
  let discordant = 0;

  const pairs: {orig: number, comp: number}[] = [];
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({
        orig: euclideanDistance(orig[i], orig[j]),
        comp: euclideanDistance(comp[i], comp[j])
      });
    }
  }

  const len = pairs.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const p1 = pairs[i];
      const p2 = pairs[j];
      
      const oDiff = p1.orig - p2.orig;
      const cDiff = p1.comp - p2.comp;

      if (oDiff * cDiff > 0) {
        concordant++;
      } else if (oDiff * cDiff < 0) {
        discordant++;
      }
    }
  }
  
  if (concordant + discordant === 0) return 0;
  return (concordant - discordant) / (concordant + discordant);
}

/**
 * Count unique vectors (for centroid survival ratio)
 * Rounds to prevent floating point precision issues
 */
export function countUniqueVectors(vectors: Vector[]): number {
  const seen = new Set<string>();
  for (const v of vectors) {
    // Round to 6 decimal places to avoid floating point issues
    const rounded = v.map(val => Math.round(val * 1000000) / 1000000);
    seen.add(rounded.join(','));
  }
  return Math.max(1, seen.size); // At least 1
}
