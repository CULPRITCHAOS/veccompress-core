# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-26

### Added
- Initial release of @veccompress/core
- **Compression algorithms**:
  - Lattice quantization (uniform grid-based)
  - Boundary-aware adaptive quantization
  - Vector normalization support
- **Quality metrics**:
  - Recall@5 and Recall@10 (neighbor preservation)
  - Precision@10 (false neighbor detection)
  - k-variance (topology sensitivity / early warning)
  - Per-dimension MSE (dimension-specific analysis)
  - Collapse index (composite quality score 0-1)
  - Kendall's Tau, MRR, trustworthiness
  - Centroid survival ratio
- **Regime detection**:
  - STABLE: Safe for production
  - PRE_COLLAPSE: Early warning
  - COLLAPSE: Quality degraded
  - POST_COLLAPSE: Severe loss
- **Helper functions**:
  - `quickCompress()` - One-liner with quality target
  - `safeCompress()` - Auto-retry with finer grid
  - `estimateGridStep()` - Calculate optimal grid
  - `batchCompress()` - Process multiple datasets
  - `compareMethods()` - Benchmark methods
- **Comprehensive documentation**:
  - 12KB README with examples
  - API reference
  - 5 runnable usage examples
  - Metrics explanation guide
- **Testing**:
  - 36 comprehensive tests (all passing)
  - Manual validation suite
  - Edge case coverage
  - High-dimensional support (128D, 768D tested)

### Technical Details
- Built with TypeScript 5.8
- Dual builds: CommonJS + ESM
- Tree-shakeable
- Zero dependencies (runtime)
- Browser + Node.js compatible
- Package size: 20.2 KB

### Performance
- Compression: 4-20× typical ratios
- Quality: 50-95% recall @10 (depending on settings)
- Speed: ~1-2ms per 100 vectors (100D)
- Handles: Up to millions of vectors

---

## Future Plans

### v0.2.0 (Planned)
- K-means vector quantization
- Random projection dimensionality reduction
- Auto-tuning based on target compression ratio
- Streaming compression for large datasets

### v0.3.0 (Planned)
- Product Quantization (PQ)
- Optimized Product Quantization (OPQ)
- GPU acceleration (WebGPU)
- Compression progress callbacks

### v1.0.0 (Planned)
- Stable API
- Performance optimizations
- Additional metrics (persistent homology, Wasserstein distance)
- Python bindings

---

[0.1.0]: https://github.com/CULPRITCHAOS/veccompress-core/releases/tag/v0.1.0
