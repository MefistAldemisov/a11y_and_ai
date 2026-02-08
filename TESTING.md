# Testing Guide

## Overview

This project includes comprehensive E2E (End-to-End) testing using Playwright. The test suite covers all major functionality, accessibility features, and user workflows.

## Test Statistics

- **Total Tests**: 73 unique test cases
- **Total Test Runs**: 219 (73 tests × 3 browsers)
- **Browsers**: Chromium, Firefox, WebKit (Safari)
- **Test Files**: 6 spec files
- **Coverage Areas**: 6 major categories

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests with interactive UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

## Test Categories

### 1. Checklist Operations (12 tests)
**File**: [`e2e/checklist.spec.ts`](e2e/checklist.spec.ts)

Tests for checklist CRUD operations:
- Creating checklists (with/without description)
- Editing checklist details
- Deleting checklists
- Multiple checklist management
- Persistence across reloads
- Expand/collapse functionality
- Empty state handling

### 2. Task Operations (15 tests)
**File**: [`e2e/task.spec.ts`](e2e/task.spec.ts)

Tests for task management:
- Adding tasks with various fields
- Editing task properties
- Toggling task completion
- Deleting tasks
- Priority levels (low, medium, critical)
- Deadline handling
- Multiline descriptions
- Task persistence

### 3. Progress Tracking (8 tests)
**File**: [`e2e/progress.spec.ts`](e2e/progress.spec.ts)

Tests for progress calculation and display:
- Progress calculation (completed/total)
- Progress updates on task changes
- Visual progress bar display
- 0%, partial, and 100% completion
- Progress persistence

### 4. UI Interactions (15 tests)
**File**: [`e2e/ui-interactions.spec.ts`](e2e/ui-interactions.spec.ts)

Tests for user interface and experience:
- Modal interactions (open/close)
- Button states and visibility
- Empty state messages
- Keyboard navigation
- Task completion styling
- Priority label display
- Rapid interaction handling
- Multiple checklist states

### 5. Accessibility (12 tests)
**File**: [`e2e/accessibility.spec.ts`](e2e/accessibility.spec.ts)

Tests for accessibility compliance:
- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- Form label associations
- Screen reader compatibility
- Semantic HTML structure
- Keyboard-only navigation
- Color contrast verification

### 6. Integration Workflows (8 tests)
**File**: [`e2e/integration.spec.ts`](e2e/integration.spec.ts)

Tests for complete user workflows:
- Full workflow: create → add tasks → complete
- Multiple checklists with different states
- Complete state persistence
- Editing with progress maintenance
- Deleting completed/incomplete tasks
- Collapse/expand with state preservation
- Complete lifecycle testing
- Rapid operations without data loss

## Test Helper

The [`TodoListPage`](e2e/fixtures/test-helpers.ts) class provides a Page Object Model with helper methods:

```typescript
// Example usage
const todoPage = new TodoListPage(page);
await todoPage.goto();
await todoPage.createChecklist('My List', 'Description');
await todoPage.addTask('My List', 'Task 1', 'Details', '2026-12-31', 'critical');
await todoPage.toggleTask('Task 1');
```

### Available Helper Methods

- `goto()` - Navigate to the application
- `createChecklist(title, description?)` - Create a new checklist
- `editChecklist(oldTitle, newTitle, newDescription?)` - Edit checklist
- `deleteChecklist(title)` - Delete a checklist
- `addTask(checklistTitle, taskTitle, description?, deadline?, priority?)` - Add a task
- `editTask(taskTitle, newTitle, newDescription?, newDeadline?, newPriority?)` - Edit a task
- `toggleTask(taskTitle)` - Toggle task completion
- `deleteTask(taskTitle)` - Delete a task
- `getChecklistCount()` - Get number of checklists
- `getTaskCount(checklistTitle)` - Get number of tasks in a checklist
- `isTaskCompleted(taskTitle)` - Check if task is completed
- `getProgressText(checklistTitle)` - Get progress text
- `toggleChecklistExpansion(checklistTitle)` - Expand/collapse checklist
- `clearLocalStorage()` - Clear browser storage

## Running Tests

### All Tests

```bash
# Headless mode (default)
npm test

# With UI mode (recommended for development)
npm run test:ui

# Headed mode (see browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug
```

### Specific Browsers

```bash
npm run test:chromium   # Chrome/Edge
npm run test:firefox    # Firefox
npm run test:webkit     # Safari
```

### Specific Test Files

```bash
npx playwright test checklist      # Checklist tests only
npx playwright test task           # Task tests only
npx playwright test progress       # Progress tests only
npx playwright test ui-interactions # UI tests only
npx playwright test accessibility  # Accessibility tests only
npx playwright test integration    # Integration tests only
```

### Specific Test Cases

```bash
# Run tests matching a pattern
npx playwright test -g "should create"

# Run a specific test
npx playwright test -g "should create a new checklist with title only"
```

## Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

The report includes:
- Test results for each browser
- Screenshots of failures
- Traces for debugging
- Execution time statistics

## Debugging Tests

### Using Playwright Inspector

```bash
npm run test:debug
```

Features:
- Step through tests line by line
- Inspect locators in real-time
- View console logs
- Take screenshots at any point

### Using UI Mode

```bash
npm run test:ui
```

Features:
- Interactive test runner
- Watch mode for development
- Time travel debugging
- Visual test picker
- Trace viewer

### View Traces

Traces are automatically captured on first retry. View them:

```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

The tests are configured for CI environments:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### CI Configuration

In CI environments, Playwright automatically:
- Retries failed tests (2 retries)
- Uses single worker for stability
- Generates HTML reports
- Captures screenshots on failure
- Records traces on retry

## Best Practices

### Writing Tests

1. **Use Page Object Model**: Utilize `TodoListPage` helper class
2. **Clear State**: Always clear localStorage in `beforeEach`
3. **Wait Properly**: Use Playwright's auto-waiting
4. **Descriptive Names**: Clear test names that explain intent
5. **Test Isolation**: Each test should be independent
6. **AAA Pattern**: Arrange, Act, Assert

### Example Test

```typescript
test('should complete a task', async ({ page }) => {
  // Arrange
  await todoPage.createChecklist('Test List');
  await todoPage.addTask('Test List', 'Test Task');
  
  // Act
  await todoPage.toggleTask('Test Task');
  
  // Assert
  expect(await todoPage.isTaskCompleted('Test Task')).toBe(true);
});
```

### Avoiding Flaky Tests

1. Use Playwright's built-in waiting mechanisms
2. Avoid hard-coded timeouts when possible
3. Use `waitForTimeout` sparingly (only after actions that trigger animations)
4. Check for element visibility before interaction
5. Use stable locators (role, label, text)

## Troubleshooting

### Tests Fail Locally

1. Ensure dev server is not running on port 5173
2. Clear browser cache: `await todoPage.clearLocalStorage()`
3. Update browsers: `npx playwright install`
4. Check Node.js version (18+ required)

### Timeout Issues

If tests timeout:
1. Increase timeout in `playwright.config.ts`
2. Check network conditions
3. Verify dev server starts correctly
4. Use `test.setTimeout(60000)` for specific tests

### Browser-Specific Failures

Test in specific browser to isolate:
```bash
npm run test:chromium  # or firefox, webkit
```

Common issues:
- WebKit may have different timing
- Firefox may handle focus differently
- Check browser console logs

## Performance

### Test Execution Time

- Average test: ~2-5 seconds
- Full suite (all browsers): ~5-10 minutes
- Single browser: ~2-3 minutes

### Optimization Tips

1. Run tests in parallel (default)
2. Use `fullyParallel: true` in config
3. Run specific browsers during development
4. Use `test.only()` for focused testing
5. Skip slow tests during development with `test.skip()`

## Coverage Goals

Current coverage:
- ✅ All CRUD operations
- ✅ All user interactions
- ✅ Persistence and state management
- ✅ Accessibility features
- ✅ Edge cases and error scenarios
- ✅ Complete user workflows

## Maintenance

### Adding New Tests

1. Identify the feature to test
2. Choose appropriate test file (or create new)
3. Use `TodoListPage` helper methods
4. Follow AAA pattern
5. Ensure test isolation
6. Run tests to verify

### Updating Tests

When updating application code:
1. Run full test suite
2. Update failing tests if behavior changed intentionally
3. Add new tests for new features
4. Ensure all tests pass before committing

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Support

For issues or questions:
1. Check test output and error messages
2. Review test traces and screenshots
3. Use Playwright Inspector for debugging
4. Consult Playwright documentation
