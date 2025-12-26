# Usage Examples

This directory contains runnable examples demonstrating various use cases for @veccompress/core.

## Running Examples

```bash
# Run any example with tsx
npx tsx examples/01-basic-usage.ts
npx tsx examples/02-quick-compress.ts
npx tsx examples/03-safe-compress.ts
npx tsx examples/04-batch-processing.ts
npx tsx examples/05-method-comparison.ts
```

## Examples Overview

### 1. Basic Usage (`01-basic-usage.ts`)
**What it shows**: The fundamental compression workflow  
**Key concepts**: 
- Creating a compressor
- Analyzing results
- Interpreting metrics
- Understanding regimes

**Run this first** to understand the basics.

---

### 2. Quick Compress (`02-quick-compress.ts`)
**What it shows**: One-liner compression with quality targets  
**Key concepts**:
- `quickCompress()` function
- Quality target parameter
- Trade-off between quality and compression

**Use when**: You want simplicity and know your quality target.

---

### 3. Safe Compress (`03-safe-compress.ts`)
**What it shows**: Automatic retry with finer grid if collapse detected  
**Key concepts**:
- `safeCompress()` function
- Auto-tuning
- Production safety guarantees

**Use when**: Quality is critical and you want automatic fallback.

---

### 4. Batch Processing (`04-batch-processing.ts`)
**What it shows**: Compressing multiple datasets at once  
**Key concepts**:
- `batchCompress()` function
- Consistent settings across datasets
- Storage savings calculation

**Use when**: Processing multiple related datasets (users, products, content).

---

### 5. Method Comparison (`05-method-comparison.ts`)
**What it shows**: Comparing Lattice vs Boundary-Aware methods  
**Key concepts**:
- `compareMethods()` function
- Performance trade-offs
- Choosing the right method

**Use when**: Not sure which compression method to use.

---

## Example Output

All examples produce formatted output showing:
- 📊 Input data characteristics
- 🗜️ Compression process
- ✅ Results and metrics
- 💡 Insights and recommendations
- 🎯 When to use this approach

## Learn More

- [Main README](../README.md) - Complete documentation
- [API Reference](../README.md#-api-reference) - Full API docs
- [Tests](../tests) - See comprehensive test suite
