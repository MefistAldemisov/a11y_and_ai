# E2E Tests for Todo List Application

This directory contains comprehensive end-to-end tests for the Todo List application using Playwright.

## Test Structure

### Test Files

- **`checklist.spec.ts`** - Tests for checklist CRUD operations
  - Creating checklists with title and description
  - Editing checklist details
  - Deleting checklists
  - Persistence across page reloads
  - Expand/collapse functionality

- **`task.spec.ts`** - Tests for task management
  - Adding tasks with various fields (title, description, deadline, priority)
  - Editing task details
  - Toggling task completion
  - Deleting tasks
  - Task persistence

- **`progress.spec.ts`** - Tests for progress tracking
  - Progress calculation (completed/total tasks)
  - Progress updates on task completion/deletion
  - Visual progress bar display
  - Progress persistence

- **`ui-interactions.spec.ts`** - Tests for UI/UX
  - Modal interactions
  - Button states and visibility
  - Empty states
  - Keyboard navigation
  - Multiple checklist handling
  - Rapid interactions

- **`accessibility.spec.ts`** - Tests for accessibility features
  - ARIA labels and roles
  - Keyboard navigation
  - Focus management
  - Form labels
  - Screen reader support
  - Semantic HTML

### Test Helpers

- **`fixtures/test-helpers.ts`** - TodoListPage class with helper methods
  - Page object model for the application
  - Reusable methods for common operations
  - Locator definitions for UI elements

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (if not already installed)
npx playwright install
```

### Run All Tests

```bash
# Run all tests in headless mode
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Run Specific Browser Tests

```bash
# Run tests only in Chromium
npm run test:chromium

# Run tests only in Firefox
npm run test:firefox

# Run tests only in WebKit (Safari)
npm run test:webkit
```

### Run Specific Test Files

```bash
# Run only checklist tests
npx playwright test checklist

# Run only task tests
npx playwright test task

# Run only accessibility tests
npx playwright test accessibility
```

### View Test Reports

```bash
# Show the last test report
npm run test:report
```

## Test Coverage

### Checklist Operations (12 tests)
- ✅ Empty state display
- ✅ Create checklist with title only
- ✅ Create checklist with title and description
- ✅ Create multiple checklists
- ✅ Edit checklist title
- ✅ Edit checklist description
- ✅ Delete checklist
- ✅ Delete one checklist while keeping others
- ✅ Cancel checklist creation
- ✅ Persist checklists after reload
- ✅ Expand/collapse checklist
- ✅ Empty task message display

### Task Operations (15 tests)
- ✅ Add task with title only
- ✅ Add task with all fields
- ✅ Add multiple tasks
- ✅ Toggle task completion
- ✅ Edit task title
- ✅ Edit task description
- ✅ Edit task priority
- ✅ Delete task
- ✅ Delete one task while keeping others
- ✅ Cancel task creation
- ✅ Persist tasks after reload
- ✅ Maintain completion state after reload
- ✅ Display different priority levels
- ✅ Display formatted deadline
- ✅ Handle multiline descriptions

### Progress Tracking (8 tests)
- ✅ No progress bar for empty checklist
- ✅ Show 0/1 progress for incomplete task
- ✅ Show 1/1 progress for completed task
- ✅ Show correct progress with mixed completion
- ✅ Update progress on task toggle
- ✅ Update progress on task deletion
- ✅ Display progress bar correctly
- ✅ Maintain progress after reload

### UI Interactions (15 tests)
- ✅ Display app header
- ✅ Display New Checklist button
- ✅ Open/close checklist modal
- ✅ Open/close task modal
- ✅ Display action buttons
- ✅ Show completed task styling
- ✅ Keyboard navigation for expansion
- ✅ Display priority labels with styling
- ✅ Maintain scroll position
- ✅ Handle rapid task toggling
- ✅ Display empty states correctly
- ✅ Handle multiple checklists
- ✅ Preserve UI state during operations

### Accessibility (12 tests)
- ✅ ARIA labels for collapse button
- ✅ Keyboard navigation for checklist expansion
- ✅ Accessible form labels in checklist modal
- ✅ Accessible form labels in task modal
- ✅ Accessible buttons with proper roles
- ✅ Accessible checkboxes
- ✅ Focus management in modals
- ✅ Semantic HTML structure
- ✅ Screen reader text for task status
- ✅ Visible focus indicators
- ✅ Sufficient color contrast
- ✅ Keyboard-only navigation

**Total: 62 comprehensive E2E tests**

## Writing New Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('Feature Name', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await todoPage.createChecklist('Test Checklist');
    
    // Act
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    // Assert
    await expect(page.getByText('Test Task')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Page Object Model**: Utilize the `TodoListPage` helper class for interactions
2. **Clear State**: Always clear localStorage in `beforeEach` to ensure test isolation
3. **Wait for Actions**: Use built-in Playwright waiting mechanisms
4. **Descriptive Names**: Use clear, descriptive test names that explain what is being tested
5. **Arrange-Act-Assert**: Follow the AAA pattern for test structure
6. **Test Isolation**: Each test should be independent and not rely on other tests

## CI/CD Integration

The tests are configured to run in CI environments with:
- Automatic retries (2 retries on CI)
- Single worker on CI for stability
- HTML reporter for test results
- Screenshots on failure
- Trace on first retry

## Debugging Tests

### Using Playwright Inspector

```bash
npm run test:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- See locators
- View console logs
- Take screenshots

### Using UI Mode

```bash
npm run test:ui
```

This opens an interactive UI where you can:
- Run tests individually
- See test results in real-time
- View traces and screenshots
- Filter and search tests

### View Traces

After a test failure, traces are automatically captured. View them with:

```bash
npx playwright show-trace trace.zip
```

## Configuration

Test configuration is in [`playwright.config.ts`](../playwright.config.ts):
- Base URL: `http://localhost:5173`
- Browsers: Chromium, Firefox, WebKit
- Dev server: Automatically started before tests
- Timeout: 120 seconds for dev server startup

## Troubleshooting

### Tests Failing Locally

1. Ensure dev server is not already running on port 5173
2. Clear browser cache and localStorage
3. Update Playwright browsers: `npx playwright install`

### Flaky Tests

If tests are flaky:
1. Check for race conditions
2. Ensure proper waiting mechanisms
3. Increase timeout if needed
4. Check network conditions

### Browser-Specific Issues

Run tests in specific browsers to isolate issues:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```
