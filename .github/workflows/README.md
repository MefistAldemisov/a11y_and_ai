# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### CI Workflow (ci.yml)

Runs on every push to `main` or `develop` branches and on pull requests.

#### Jobs

1. **Install Dependencies**
   - Checks out code
   - Sets up Node.js 18
   - Installs dependencies with `npm ci`
   - Caches `node_modules` and Playwright browsers for faster subsequent runs

2. **Lint** (runs in parallel after install)
   - Restores cached dependencies
   - Runs ESLint to check code quality
   - Fails if linting errors are found

3. **Playwright Tests** (runs in parallel after install)
   - Restores cached dependencies
   - Installs Playwright browsers (Chromium, Firefox, WebKit)
   - Runs all E2E tests across 3 browsers
   - Uploads test reports and results as artifacts (available for 30 days)

4. **CI Status**
   - Runs after lint and test jobs complete
   - Checks if all jobs passed
   - Provides final CI status

#### Artifacts

When tests run (pass or fail), the following artifacts are uploaded:

- **playwright-report** - HTML report with test results, screenshots, and traces
- **test-results** - Raw test results including screenshots and videos

#### Accessing Test Reports

1. Go to the Actions tab in your GitHub repository
2. Click on the workflow run
3. Scroll down to the "Artifacts" section
4. Download "playwright-report"
5. Extract and open `index.html` in a browser

#### Parallel Execution

The workflow is optimized for speed:
- Dependencies are installed once and cached
- Lint and test jobs run in parallel
- Playwright browsers are cached between runs

#### Workflow Diagram

```
┌─────────────────────┐
│  Install Dependencies│
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼────┐ ┌───▼────┐
│  Lint   │ │  Test  │
└────┬────┘ └───┬────┘
     │          │
     └────┬─────┘
          │
     ┌────▼────┐
     │ Status  │
     └─────────┘
```

## Local Testing

To test the workflow locally before pushing:

```bash
# Install dependencies
npm ci

# Run lint
npm run lint

# Run tests
npm test
```

## Configuration

### Node.js Version

The workflow uses Node.js 18. To change:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change to desired version
```

### Browsers

By default, all three browsers are installed:

```yaml
npx playwright install --with-deps chromium firefox webkit
```

To install only specific browsers:

```yaml
npx playwright install --with-deps chromium  # Only Chrome
```

### Artifact Retention

Test reports are kept for 30 days. To change:

```yaml
- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  with:
    retention-days: 7  # Keep for 7 days
```

## Troubleshooting

### Cache Issues

If you encounter cache-related issues, you can clear the cache:
1. Go to Actions → Caches
2. Delete the relevant cache
3. Re-run the workflow

### Browser Installation Failures

If Playwright browser installation fails:
1. Check the Node.js version (18+ required)
2. Ensure `--with-deps` flag is used for system dependencies
3. Check GitHub Actions runner OS compatibility

### Test Failures

When tests fail:
1. Download the playwright-report artifact
2. Open `index.html` to see detailed results
3. Check screenshots and traces for failed tests
4. Review the test logs in the Actions tab

## Best Practices

1. **Always run tests locally** before pushing
2. **Keep dependencies updated** to avoid security issues
3. **Review test reports** for flaky tests
4. **Use caching** to speed up CI runs
5. **Set appropriate retention days** for artifacts

## Status Badge

Add this badge to your README.md to show CI status:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.
