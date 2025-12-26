# Contributing to @veccompress/core

Thank you for your interest in contributing! This project is research-grade code turned production-ready, and we welcome contributions.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/veccompress-core.git
   cd veccompress-core
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run tests**:
   ```bash
   npm test
   ```
5. **Build**:
   ```bash
   npm run build
   ```

## 🔧 Development Workflow

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the `src/` directory

3. **Write tests** in the `tests/` directory

4. **Ensure all tests pass**:
   ```bash
   npm test
   ```

5. **Build successfully**:
   ```bash
   npm run build
   ```

6. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new compression method"
   git commit -m "fix: resolve edge case in metrics calculation"
   git commit -m "docs: update README examples"
   ```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Build/tooling changes

## 🧪 Testing

### Writing Tests

- Place tests in `tests/` directory
- Use descriptive test names
- Test edge cases
- Ensure tests are deterministic (use seeded RNG)

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { VectorCompressor } from '../src';

describe('New Feature', () => {
  it('should handle edge case', () => {
    const compressor = new VectorCompressor();
    const result = compressor.compress([]);
    expect(result.compressed).toHaveLength(0);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Include usage examples
- Document parameters and return types

Example:
```typescript
/**
 * Compress vectors with quality analysis
 * @param vectors - Input vectors to compress
 * @returns Compression result with metrics
 * @example
 * ```typescript
 * const result = compressor.compressWithAnalysis(vectors);
 * console.log(result.compressionRatio);
 * ```
 */
```

### README Updates

If adding new features:
- Update the main README.md
- Add usage examples
- Update API reference section

## 🎯 Areas for Contribution

We're particularly interested in:

### High Priority
- [ ] K-means vector quantization implementation
- [ ] Random projection dimensionality reduction
- [ ] Performance optimizations (SIMD, WebAssembly)
- [ ] Additional compression methods (PQ, OPQ)

### Medium Priority
- [ ] GPU acceleration (WebGPU)
- [ ] Streaming compression for large datasets
- [ ] Python bindings (via WASM or native)
- [ ] Additional metrics (persistent homology, Wasserstein)

### Documentation
- [ ] More usage examples
- [ ] Video tutorials
- [ ] Comparison with other libraries
- [ ] Case studies

### Testing
- [ ] Browser compatibility tests
- [ ] Performance benchmarks
- [ ] Stress testing with large datasets
- [ ] Integration tests

## 📏 Code Style

We use TypeScript with strict mode:

- Use meaningful variable names
- Keep functions small and focused
- Avoid magic numbers (use named constants)
- Write self-documenting code
- Add comments for complex logic

## 🔍 Review Process

1. **Open a Pull Request** to `main` branch
2. **CI checks** must pass (tests, build, type check)
3. **Code review** by maintainers
4. **Address feedback** if any
5. **Merge** once approved

## ⚡ Performance Considerations

When contributing:
- Profile your changes if adding new algorithms
- Consider memory usage for large datasets
- Optimize hot paths (compression loops)
- Document time complexity in comments

## 🐛 Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Minimal reproduction code
- Expected vs actual behavior
- Environment details
- Data characteristics

## 💡 Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- Use case description
- Proposed API (if applicable)
- Alternatives considered
- Willingness to implement

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make vector compression accessible to everyone. Whether it's:
- Bug reports
- Feature requests
- Documentation improvements
- Code contributions
- Spreading the word

**Every contribution matters!** 🎉

## 📞 Questions?

- Open a [GitHub Discussion](https://github.com/CULPRITCHAOS/veccompress-core/discussions)
- Check existing [Issues](https://github.com/CULPRITCHAOS/veccompress-core/issues)
- Read the [README](README.md)

---

**Happy coding!** 🚀
