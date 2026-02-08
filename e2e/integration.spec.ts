import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('Integration - Complete User Workflows', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
  });

  test('should complete a full workflow: create checklist, add tasks, complete them', async ({ page }) => {
    // Create a checklist
    await todoPage.createChecklist('Weekly Goals', 'Things to accomplish this week');
    
    // Verify checklist is created
    await expect(page.getByText('Weekly Goals')).toBeVisible();
    await expect(page.getByText('Things to accomplish this week')).toBeVisible();
    
    // Add multiple tasks with different priorities
    await todoPage.addTask('Weekly Goals', 'Exercise 3 times', 'Go to the gym', '2026-02-14', 'medium');
    await todoPage.addTask('Weekly Goals', 'Finish project report', 'Complete the Q1 report', '2026-02-12', 'critical');
    await todoPage.addTask('Weekly Goals', 'Read a book', 'Read at least 50 pages', '2026-02-15', 'low');
    
    // Verify all tasks are visible
    await expect(page.getByText('Exercise 3 times')).toBeVisible();
    await expect(page.getByText('Finish project report')).toBeVisible();
    await expect(page.getByText('Read a book')).toBeVisible();
    
    // Check progress is 0/3
    let progressText = await todoPage.getProgressText('Weekly Goals');
    expect(progressText).toContain('0');
    expect(progressText).toContain('3');
    
    // Complete first task
    await todoPage.toggleTask('Exercise 3 times');
    progressText = await todoPage.getProgressText('Weekly Goals');
    expect(progressText).toContain('1');
    expect(progressText).toContain('3');
    
    // Complete second task
    await todoPage.toggleTask('Finish project report');
    progressText = await todoPage.getProgressText('Weekly Goals');
    expect(progressText).toContain('2');
    expect(progressText).toContain('3');
    
    // Complete third task
    await todoPage.toggleTask('Read a book');
    progressText = await todoPage.getProgressText('Weekly Goals');
    expect(progressText).toContain('3');
    expect(progressText).toContain('3');
    
    // Verify all tasks are completed
    expect(await todoPage.isTaskCompleted('Exercise 3 times')).toBe(true);
    expect(await todoPage.isTaskCompleted('Finish project report')).toBe(true);
    expect(await todoPage.isTaskCompleted('Read a book')).toBe(true);
  });

  test('should handle multiple checklists with different tasks', async () => {
    // Create work checklist
    await todoPage.createChecklist('Work Tasks', 'Professional responsibilities');
    await todoPage.addTask('Work Tasks', 'Review PRs', '', '', 'critical');
    await todoPage.addTask('Work Tasks', 'Update documentation', '', '', 'medium');
    
    // Create personal checklist
    await todoPage.createChecklist('Personal Tasks', 'Home and life');
    await todoPage.addTask('Personal Tasks', 'Buy groceries', '', '', 'medium');
    await todoPage.addTask('Personal Tasks', 'Call dentist', '', '', 'low');
    
    // Verify both checklists exist
    expect(await todoPage.getChecklistCount()).toBe(2);
    
    // Complete some tasks in work checklist
    await todoPage.toggleTask('Review PRs');
    
    // Verify work progress is 1/2
    let workProgress = await todoPage.getProgressText('Work Tasks');
    expect(workProgress).toContain('1');
    expect(workProgress).toContain('2');
    
    // Complete all tasks in personal checklist
    await todoPage.toggleTask('Buy groceries');
    await todoPage.toggleTask('Call dentist');
    
    // Verify personal progress is 2/2
    const personalProgress = await todoPage.getProgressText('Personal Tasks');
    expect(personalProgress).toContain('2');
    expect(personalProgress).toContain('2');
    
    // Work progress should still be 1/2
    workProgress = await todoPage.getProgressText('Work Tasks');
    expect(workProgress).toContain('1');
    expect(workProgress).toContain('2');
  });

  test('should persist complete state across page reloads', async ({ page }) => {
    // Create checklist with tasks
    await todoPage.createChecklist('Persistent List');
    await todoPage.addTask('Persistent List', 'Task 1', 'Description 1', '2026-03-01', 'low');
    await todoPage.addTask('Persistent List', 'Task 2', 'Description 2', '2026-03-02', 'medium');
    await todoPage.addTask('Persistent List', 'Task 3', 'Description 3', '2026-03-03', 'critical');
    
    // Complete one task
    await todoPage.toggleTask('Task 2');
    
    // Reload page
    await page.reload();
    
    // Verify checklist still exists
    await expect(page.getByText('Persistent List')).toBeVisible();
    
    // Verify all tasks still exist
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    
    // Verify completion state is maintained
    expect(await todoPage.isTaskCompleted('Task 1')).toBe(false);
    expect(await todoPage.isTaskCompleted('Task 2')).toBe(true);
    expect(await todoPage.isTaskCompleted('Task 3')).toBe(false);
    
    // Verify progress is maintained
    const progressText = await todoPage.getProgressText('Persistent List');
    expect(progressText).toContain('1');
    expect(progressText).toContain('3');
  });

  test('should handle editing tasks and maintaining progress', async ({ page }) => {
    await todoPage.createChecklist('Editable Tasks');
    await todoPage.addTask('Editable Tasks', 'Original Task', 'Original description', '2026-02-20', 'low');
    
    // Complete the task
    await todoPage.toggleTask('Original Task');
    expect(await todoPage.isTaskCompleted('Original Task')).toBe(true);
    
    // Edit the task
    await todoPage.editTask('Original Task', 'Updated Task', 'Updated description', '2026-02-25', 'critical');
    
    // Verify task is updated
    await expect(page.getByText('Updated Task')).toBeVisible();
    await expect(page.getByText('Updated description')).toBeVisible();
    
    // Verify completion state is maintained after edit
    expect(await todoPage.isTaskCompleted('Updated Task')).toBe(true);
    
    // Verify progress is still 1/1
    const progressText = await todoPage.getProgressText('Editable Tasks');
    expect(progressText).toContain('1');
    expect(progressText).toContain('1');
  });

  test('should handle deleting completed and incomplete tasks', async ({ page }) => {
    await todoPage.createChecklist('Delete Test');
    await todoPage.addTask('Delete Test', 'Task 1');
    await todoPage.addTask('Delete Test', 'Task 2');
    await todoPage.addTask('Delete Test', 'Task 3');
    await todoPage.addTask('Delete Test', 'Task 4');
    
    // Complete tasks 1 and 3
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 3');
    
    // Progress should be 2/4
    let progressText = await todoPage.getProgressText('Delete Test');
    expect(progressText).toContain('2');
    expect(progressText).toContain('4');
    
    // Delete a completed task (Task 1)
    await todoPage.deleteTask('Task 1');
    
    // Progress should be 1/3
    progressText = await todoPage.getProgressText('Delete Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('3');
    
    // Delete an incomplete task (Task 2)
    await todoPage.deleteTask('Task 2');
    
    // Progress should be 1/2
    progressText = await todoPage.getProgressText('Delete Test');
    expect(progressText).toContain('1');
    expect(progressText).toContain('2');
    
    // Verify remaining tasks
    await expect(page.getByText('Task 1')).not.toBeVisible();
    await expect(page.getByText('Task 2')).not.toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    await expect(page.getByText('Task 4')).toBeVisible();
  });

  test('should handle collapsing checklists with tasks', async ({ page }) => {
    await todoPage.createChecklist('Collapsible Checklist');
    await todoPage.addTask('Collapsible Checklist', 'Task 1');
    await todoPage.addTask('Collapsible Checklist', 'Task 2');
    await todoPage.addTask('Collapsible Checklist', 'Task 3');
    
    // Complete one task
    await todoPage.toggleTask('Task 2');
    
    // Verify tasks are visible
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    
    // Collapse the checklist
    await todoPage.toggleChecklistExpansion('Collapsible Checklist');
    
    // Tasks should not be visible
    await expect(page.getByText('Task 1')).not.toBeVisible();
    await expect(page.getByText('Task 2')).not.toBeVisible();
    await expect(page.getByText('Task 3')).not.toBeVisible();
    
    // Progress should still be visible
    const progressText = await todoPage.getProgressText('Collapsible Checklist');
    expect(progressText).toContain('1');
    expect(progressText).toContain('3');
    
    // Expand again
    await todoPage.toggleChecklistExpansion('Collapsible Checklist');
    
    // Tasks should be visible again
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    
    // Completion state should be maintained
    expect(await todoPage.isTaskCompleted('Task 2')).toBe(true);
  });

  test('should handle complete checklist lifecycle', async ({ page }) => {
    // Start with empty state
    await expect(page.getByText(/no checklists yet/i)).toBeVisible();
    
    // Create checklist
    await todoPage.createChecklist('Lifecycle Test', 'Testing full lifecycle');
    await expect(page.getByText(/no checklists yet/i)).not.toBeVisible();
    
    // Add tasks
    await todoPage.addTask('Lifecycle Test', 'Task 1', '', '', 'low');
    await todoPage.addTask('Lifecycle Test', 'Task 2', '', '', 'medium');
    
    // Edit checklist
    await todoPage.editChecklist('Lifecycle Test', 'Updated Lifecycle', 'Updated description');
    await expect(page.getByText('Updated Lifecycle')).toBeVisible();
    await expect(page.getByText('Updated description')).toBeVisible();
    
    // Complete tasks
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 2');
    
    // Verify 100% completion
    const progressText = await todoPage.getProgressText('Updated Lifecycle');
    expect(progressText).toContain('2');
    expect(progressText).toContain('2');
    
    // Delete checklist
    await todoPage.deleteChecklist('Updated Lifecycle');
    
    // Should return to empty state
    await expect(page.getByText(/no checklists yet/i)).toBeVisible();
  });

  test('should handle rapid operations without data loss', async () => {
    // Rapidly create multiple checklists
    await todoPage.createChecklist('Rapid 1');
    await todoPage.createChecklist('Rapid 2');
    await todoPage.createChecklist('Rapid 3');
    
    // Rapidly add tasks to each
    await todoPage.addTask('Rapid 1', 'Task 1A');
    await todoPage.addTask('Rapid 1', 'Task 1B');
    await todoPage.addTask('Rapid 2', 'Task 2A');
    await todoPage.addTask('Rapid 2', 'Task 2B');
    await todoPage.addTask('Rapid 3', 'Task 3A');
    await todoPage.addTask('Rapid 3', 'Task 3B');
    
    // Rapidly toggle tasks
    await todoPage.toggleTask('Task 1A');
    await todoPage.toggleTask('Task 2A');
    await todoPage.toggleTask('Task 3A');
    
    // Verify all data is intact
    expect(await todoPage.getChecklistCount()).toBe(3);
    expect(await todoPage.getTaskCount('Rapid 1')).toBe(2);
    expect(await todoPage.getTaskCount('Rapid 2')).toBe(2);
    expect(await todoPage.getTaskCount('Rapid 3')).toBe(2);
    
    // Verify completion states
    expect(await todoPage.isTaskCompleted('Task 1A')).toBe(true);
    expect(await todoPage.isTaskCompleted('Task 1B')).toBe(false);
    expect(await todoPage.isTaskCompleted('Task 2A')).toBe(true);
    expect(await todoPage.isTaskCompleted('Task 2B')).toBe(false);
    expect(await todoPage.isTaskCompleted('Task 3A')).toBe(true);
    expect(await todoPage.isTaskCompleted('Task 3B')).toBe(false);
  });
});
