import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('Progress Tracking', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
    
    await todoPage.createChecklist('Progress Test');
  });

  test('should show 0/0 progress for checklist with no tasks', async ({ page }) => {
    const checklistCard = page.locator('.checklist-card', { hasText: 'Progress Test' });
    
    // No progress bar should be visible when there are no tasks
    await expect(checklistCard.locator('.checklist-card__progress')).not.toBeVisible();
  });

  test('should show 0/1 progress for checklist with one incomplete task', async () => {
    await todoPage.addTask('Progress Test', 'Task 1');
    
    const progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('0');
    expect(progressText).toContain('1');
  });

  test('should show 1/1 progress when task is completed', async () => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.toggleTask('Task 1');
    
    const progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('1');
  });

  test('should show 2/5 progress with mixed completion', async () => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.addTask('Progress Test', 'Task 2');
    await todoPage.addTask('Progress Test', 'Task 3');
    await todoPage.addTask('Progress Test', 'Task 4');
    await todoPage.addTask('Progress Test', 'Task 5');
    
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 3');
    
    const progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('2');
    expect(progressText).toContain('5');
  });

  test('should update progress when task is toggled', async () => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.addTask('Progress Test', 'Task 2');
    
    // Initially 0/2
    let progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('0');
    expect(progressText).toContain('2');
    
    // Complete one task -> 1/2
    await todoPage.toggleTask('Task 1');
    progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('2');
    
    // Complete second task -> 2/2
    await todoPage.toggleTask('Task 2');
    progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('2');
    expect(progressText).toContain('2');
    
    // Uncomplete one task -> 1/2
    await todoPage.toggleTask('Task 1');
    progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('2');
  });

  test('should update progress when task is deleted', async () => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.addTask('Progress Test', 'Task 2');
    await todoPage.addTask('Progress Test', 'Task 3');
    
    await todoPage.toggleTask('Task 1');
    
    // Should be 1/3
    let progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('3');
    
    // Delete an incomplete task -> 1/2
    await todoPage.deleteTask('Task 2');
    progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('2');
    
    // Delete the completed task -> 0/1
    await todoPage.deleteTask('Task 1');
    progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('0');
    expect(progressText).toContain('1');
  });

  test('should show progress bar with correct visual state', async ({ page }) => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.addTask('Progress Test', 'Task 2');
    
    const checklistCard = page.locator('.checklist-card', { hasText: 'Progress Test' });
    const progressBar = checklistCard.locator('.checklist-card__progress-bar');
    
    // Progress bar should be visible
    await expect(progressBar).toBeVisible();
    
    // Complete one task and verify progress bar is still visible
    await todoPage.toggleTask('Task 1');
    await expect(progressBar).toBeVisible();
  });

  test('should maintain progress after page reload', async ({ page }) => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.addTask('Progress Test', 'Task 2');
    await todoPage.addTask('Progress Test', 'Task 3');
    
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 2');
    
    // Should be 2/3
    let progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('2');
    expect(progressText).toContain('3');
    
    // Reload and verify progress is maintained
    await page.reload();
    
    progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('2');
    expect(progressText).toContain('3');
  });

  test('should handle 100% completion correctly', async () => {
    await todoPage.addTask('Progress Test', 'Task 1');
    await todoPage.addTask('Progress Test', 'Task 2');
    
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 2');
    
    const progressText = await todoPage.getProgressText('Progress Test');
    expect(progressText).toContain('2');
    expect(progressText).toContain('2');
  });
});
