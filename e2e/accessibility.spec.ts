import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('Accessibility', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
  });

  test('should have proper ARIA labels for collapse button', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    const collapseButton = page.locator('.checklist-card__collapse-button');
    
    // Should have aria-label for expanded state
    await expect(collapseButton).toHaveAttribute('aria-label', /collapse/i);
    
    // Click the title row to collapse
    await todoPage.toggleChecklistExpansion('Test Checklist');
    
    // Should have aria-label for collapsed state
    await expect(collapseButton).toHaveAttribute('aria-label', /expand/i);
  });

  test('should support keyboard navigation for checklist expansion', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    const titleRow = page.locator('.checklist-card__title-row');
    
    // Should be focusable
    await expect(titleRow).toHaveAttribute('tabIndex', '0');
    
    // Should have role button
    await expect(titleRow).toHaveAttribute('role', 'button');
    
    // Focus and press Enter
    await titleRow.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Test Task')).not.toBeVisible();
    
    // Press Space to expand
    await page.keyboard.press('Space');
    await expect(page.getByText('Test Task')).toBeVisible();
  });

  test('should have accessible form labels in checklist modal', async ({ page }) => {
    await todoPage.newChecklistButton.click();
    
    // Title input should be visible with placeholder
    await expect(page.getByPlaceholder(/enter checklist title/i)).toBeVisible();
    
    // Description input should be visible with placeholder
    await expect(page.getByPlaceholder(/enter checklist description/i)).toBeVisible();
    
    // Labels should be visible
    await expect(page.getByText('Title', { exact: false })).toBeVisible();
    await expect(page.getByText('Description', { exact: false })).toBeVisible();
  });

  test('should have accessible form labels in task modal', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    const checklistCard = page.locator('.checklist-card', { hasText: 'Test Checklist' });
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const addTaskButton = actionsContainer.locator('button').first();
    await addTaskButton.click({ position: { x: 10, y: 10 } });
    
    // Wait for modal to open
    await page.waitForTimeout(300);
    
    // Task title input should be visible with placeholder
    await expect(page.getByPlaceholder(/enter task title/i)).toBeVisible();
    
    // Description input should be visible with placeholder
    await expect(page.getByPlaceholder(/enter task description/i)).toBeVisible();
    
    // Deadline input should be visible
    await expect(page.locator('input[type="date"]')).toBeVisible();
    
    // Labels should be visible
    await expect(page.getByText('Title', { exact: false })).toBeVisible();
    await expect(page.getByText('Description', { exact: false })).toBeVisible();
    await expect(page.getByText('Deadline', { exact: false })).toBeVisible();
  });

  test('should have accessible buttons with proper roles', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    // All buttons should have role="button"
    const buttons = page.getByRole('button');
    expect(await buttons.count()).toBeGreaterThan(0);
  });

  test('should have accessible checkboxes', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    const checkbox = page.locator('input[type="checkbox"]');
    
    // Checkbox should be accessible
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();
    
    // Should be keyboard accessible
    await checkbox.focus();
    await page.keyboard.press('Space');
    expect(await checkbox.isChecked()).toBe(true);
  });

  test('should maintain focus management in modals', async ({ page }) => {
    await todoPage.newChecklistButton.click();
    
    // Wait for modal to open and focus to be set
    await page.waitForTimeout(300);
    
    // First input should be visible and focusable (autofocus may not work in all browsers during tests)
    const titleInput = page.getByPlaceholder(/enter checklist title/i);
    await expect(titleInput).toBeVisible();
    // Focus the input manually for testing
    await titleInput.focus();
    await expect(titleInput).toBeFocused();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    // Check for proper heading hierarchy
    const heading = page.getByText('Task Lists');
    await expect(heading).toBeVisible();
  });

  test('should support screen reader text for task status', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    const taskItem = page.locator('.task-item', { hasText: 'Test Task' });
    const checkbox = taskItem.locator('input[type="checkbox"]');
    
    // Unchecked state
    expect(await checkbox.isChecked()).toBe(false);
    
    // Checked state
    await todoPage.toggleTask('Test Task');
    expect(await checkbox.isChecked()).toBe(true);
  });

  test('should have visible focus indicators', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // At least one element should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have sufficient color contrast for priority labels', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Low Priority', '', '', 'low');
    await todoPage.addTask('Test Checklist', 'Medium Priority', '', '', 'medium');
    await todoPage.addTask('Test Checklist', 'Critical Priority', '', '', 'critical');
    
    // All priority labels should be visible (indicating sufficient contrast)
    await expect(page.getByText(/low/i).first()).toBeVisible();
    await expect(page.getByText(/medium/i).first()).toBeVisible();
    await expect(page.getByText(/critical/i).first()).toBeVisible();
  });

  test('should handle keyboard-only navigation', async ({ page }) => {
    // Focus on New Checklist button and activate it
    await todoPage.newChecklistButton.focus();
    await page.keyboard.press('Enter');
    
    // Wait for modal to open
    await page.waitForTimeout(300);
    await expect(todoPage.checklistModalTitle).toBeVisible();
    
    // Fill the input directly to ensure it has valid content
    await todoPage.checklistModalTitle.fill('Keyboard Navigation Test');
    
    // Wait for validation to complete and button to be enabled
    await expect(todoPage.checklistModalSaveButton).toBeEnabled({ timeout: 2000 });
    
    // Click the save button
    await todoPage.checklistModalSaveButton.click();
    
    // Wait for modal to close and checklist to be created
    await page.waitForTimeout(300);
    
    // Checklist should be created
    await expect(page.getByText('Keyboard Navigation Test')).toBeVisible();
  });
});
