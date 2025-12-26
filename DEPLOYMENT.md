# Deployment Guide for @veccompress/core

This guide covers how to publish and deploy @veccompress/core to npm.

## Prerequisites

- [x] All tests passing (36/36)
- [x] Build succeeds
- [x] Version bumped in package.json
- [x] CHANGELOG.md updated
- [x] Git tag created
- [x] README.md comprehensive
- [x] Examples verified

## Publishing to npm

### First-Time Setup

1. **Create npm account** (if you don't have one):
   ```bash
   # Go to https://www.npmjs.com/signup
   ```

2. **Login to npm**:
   ```bash
   npm login
   # Enter your npm username, password, and email
   ```

3. **Verify authentication**:
   ```bash
   npm whoami
   # Should display your npm username
   ```

4. **Set package scope** (optional, for scoped packages):
   ```bash
   # If you want to publish as @yourname/veccompress-core
   # Update package.json name field
   ```

### Publishing Process

#### 1. Pre-Publish Checklist

```bash
# In /home/user/veccompress-core

# Run all tests
npm test

# Build the package
npm run build

# Verify package contents
npm pack --dry-run

# Check for vulnerabilities
npm audit

# Verify version
grep version package.json
```

#### 2. Publish to npm

**For Public Package (Free)**:
```bash
cd /home/user/veccompress-core

# Publish
npm publish --access public

# Verify publication
npm view @veccompress/core
```

**For Private Package** (requires paid npm account):
```bash
npm publish
```

#### 3. Post-Publication Verification

```bash
# Check package page
# Visit: https://www.npmjs.com/package/@veccompress/core

# Test installation in a new directory
mkdir /tmp/test-install
cd /tmp/test-install
npm init -y
npm install @veccompress/core

# Verify import works
node -e "const { VectorCompressor } = require('@veccompress/core'); console.log('✓ Import successful');"
```

### Version Management

#### Semantic Versioning

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

#### Bumping Versions

```bash
# For patch (0.1.0 → 0.1.1)
npm version patch

# For minor (0.1.0 → 0.2.0)
npm version minor

# For major (0.1.0 → 1.0.0)
npm version major

# This automatically:
# - Updates package.json
# - Creates a git commit
# - Creates a git tag
```

#### Full Release Workflow

```bash
# 1. Make your changes
git add .
git commit -m "feat: add new feature"

# 2. Run tests
npm test

# 3. Update CHANGELOG.md
# Add entry for new version

# 4. Bump version (creates tag)
npm version minor -m "Release v%s"

# 5. Push to GitHub
git push origin main
git push origin --tags

# 6. Publish to npm
npm publish --access public

# 7. Create GitHub Release
# Go to: https://github.com/CULPRITCHAOS/veccompress-core/releases/new
# - Select the tag you just created
# - Copy CHANGELOG entry for release notes
# - Publish release
```

## Automated Publishing (Future Enhancement)

### Option 1: GitHub Actions + npm Token

1. **Create npm access token**:
   ```bash
   npm token create --read-only
   # Or for publishing:
   npm token create
   ```

2. **Add token to GitHub Secrets**:
   - Go to: https://github.com/CULPRITCHAOS/veccompress-core/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

3. **Update `.github/workflows/release.yml`**:
   ```yaml
   - name: Publish to npm
     run: |
       echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc
       npm publish --access public
   ```

### Option 2: Manual Publishing with CI Verification

Keep CI for testing, publish manually:
- CI runs on every PR (tests, build, lint)
- Maintainer publishes manually after merging
- More control over releases
- Recommended for early versions

## Unpublishing (Emergency Only)

⚠️ **Warning**: Unpublishing is permanent and frowned upon by npm.

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish @veccompress/core@0.1.0

# Deprecate instead (recommended)
npm deprecate @veccompress/core@0.1.0 "Please use version 0.1.1"
```

## Distribution Tags

```bash
# Publish beta version
npm publish --tag beta

# Install beta
npm install @veccompress/core@beta

# Promote beta to latest
npm dist-tag add @veccompress/core@0.2.0 latest
```

## Package Stats & Analytics

After publishing, monitor:
- **npm downloads**: https://npm-stat.com/charts.html?package=@veccompress/core
- **Package page**: https://www.npmjs.com/package/@veccompress/core
- **GitHub stars**: https://github.com/CULPRITCHAOS/veccompress-core
- **Issues/PRs**: Monitor for bug reports

## Troubleshooting

### "You do not have permission to publish"
```bash
# Check you're logged in
npm whoami

# Login again
npm login

# Verify package name isn't taken
npm view @veccompress/core
```

### "Package name too similar"
```bash
# Change package name in package.json
# Try: @yourname/veccompress-core
```

### "Version already exists"
```bash
# Bump version
npm version patch
```

## Security

### Enable 2FA (Recommended)
```bash
npm profile enable-2fa auth-and-writes
```

### Audit Dependencies
```bash
npm audit
npm audit fix
```

### Keep Dependencies Updated
```bash
npm outdated
npm update
```

## Current Status

✅ **Package Ready**: v0.1.0  
✅ **Tests**: 36/36 passing  
✅ **Build**: Clean  
✅ **Size**: 20.2 KB (gzipped)  
✅ **Documentation**: Complete  
✅ **Examples**: 5 working examples  
⏳ **Published**: Not yet (awaiting npm publish)

## Next Steps

1. [ ] Run final pre-publish checks
2. [ ] `npm login` (if not already logged in)
3. [ ] `npm publish --access public`
4. [ ] Verify on npmjs.com
5. [ ] Create GitHub Release
6. [ ] Share on social media / dev.to
7. [ ] Update README with npm install badge

---

**Ready to ship? Let's go! 🚀**

```bash
cd /home/user/veccompress-core
npm publish --access public
```
