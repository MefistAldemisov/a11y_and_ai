import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('Task Operations', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
    
    // Create a checklist for testing tasks
    await todoPage.createChecklist('Test Checklist');
  });

  test('should add a task with title only', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'My First Task');
    
    await expect(page.getByText('My First Task')).toBeVisible();
    expect(await todoPage.getTaskCount('Test Checklist')).toBe(1);
  });

  test('should add a task with all fields', async ({ page }) => {
    await todoPage.addTask(
      'Test Checklist',
      'Complete Task',
      'This is a detailed description',
      '2026-12-31',
      'critical'
    );
    
    await expect(page.getByText('Complete Task')).toBeVisible();
    await expect(page.getByText('This is a detailed description')).toBeVisible();
    await expect(page.getByText(/critical/i)).toBeVisible();
  });

  test('should add multiple tasks', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Task 1');
    await todoPage.addTask('Test Checklist', 'Task 2');
    await todoPage.addTask('Test Checklist', 'Task 3');
    
    expect(await todoPage.getTaskCount('Test Checklist')).toBe(3);
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
  });

  test('should toggle task completion', async () => {
    await todoPage.addTask('Test Checklist', 'Toggle Task');
    
    // Initially unchecked
    expect(await todoPage.isTaskCompleted('Toggle Task')).toBe(false);
    
    // Toggle to completed
    await todoPage.toggleTask('Toggle Task');
    expect(await todoPage.isTaskCompleted('Toggle Task')).toBe(true);
    
    // Toggle back to uncompleted
    await todoPage.toggleTask('Toggle Task');
    expect(await todoPage.isTaskCompleted('Toggle Task')).toBe(false);
  });

  test('should edit task title', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Old Task Title');
    await todoPage.editTask('Old Task Title', 'New Task Title');
    
    await expect(page.getByText('New Task Title')).toBeVisible();
    await expect(page.getByText('Old Task Title')).not.toBeVisible();
  });

  test('should edit task description', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Task', 'Old description');
    await todoPage.editTask('Task', 'Task', 'New description');
    
    await expect(page.getByText('New description')).toBeVisible();
    await expect(page.getByText('Old description')).not.toBeVisible();
  });

  test('should edit task priority', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Priority Task', '', '', 'low');
    
    // Verify initial priority
    const taskItem = page.locator('.task-item', { hasText: 'Priority Task' });
    await expect(taskItem.getByText(/low/i)).toBeVisible();
    
    // Change priority to critical
    await todoPage.editTask('Priority Task', 'Priority Task', undefined, undefined, 'critical');
    await expect(taskItem.getByText(/critical/i)).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Task to Delete');
    await expect(page.getByText('Task to Delete')).toBeVisible();
    
    await todoPage.deleteTask('Task to Delete');
    
    await expect(page.getByText('Task to Delete')).not.toBeVisible();
    expect(await todoPage.getTaskCount('Test Checklist')).toBe(0);
  });

  test('should delete one task while keeping others', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Keep Task 1');
    await todoPage.addTask('Test Checklist', 'Delete This');
    await todoPage.addTask('Test Checklist', 'Keep Task 2');
    
    await todoPage.deleteTask('Delete This');
    
    expect(await todoPage.getTaskCount('Test Checklist')).toBe(2);
    await expect(page.getByText('Keep Task 1')).toBeVisible();
    await expect(page.getByText('Keep Task 2')).toBeVisible();
    await expect(page.getByText('Delete This')).not.toBeVisible();
  });

  test('should cancel task creation', async ({ page }) => {
    const checklistCard = page.locator('.checklist-card', { hasText: 'Test Checklist' });
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const addTaskButton = actionsContainer.locator('button').first();
    await addTaskButton.click({ position: { x: 10, y: 10 } });
    
    // Wait for modal to open
    await page.waitForTimeout(300);
    
    await todoPage.taskModalTitle.fill('Cancelled Task');
    await todoPage.taskModalCancelButton.click();
    
    await expect(page.getByText('Cancelled Task')).not.toBeVisible();
    expect(await todoPage.getTaskCount('Test Checklist')).toBe(0);
  });

  test('should persist tasks after page reload', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Persistent Task', 'Should survive reload');
    
    await page.reload();
    
    await expect(page.getByText('Persistent Task')).toBeVisible();
    await expect(page.getByText('Should survive reload')).toBeVisible();
  });

  test('should maintain task completion state after reload', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Completed Task');
    await todoPage.toggleTask('Completed Task');
    
    expect(await todoPage.isTaskCompleted('Completed Task')).toBe(true);
    
    await page.reload();
    
    expect(await todoPage.isTaskCompleted('Completed Task')).toBe(true);
  });

  test('should display task with different priority levels', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Low Priority', '', '', 'low');
    await todoPage.addTask('Test Checklist', 'Medium Priority', '', '', 'medium');
    await todoPage.addTask('Test Checklist', 'Critical Priority', '', '', 'critical');
    
    const lowTask = page.locator('.task-item', { hasText: 'Low Priority' });
    const mediumTask = page.locator('.task-item', { hasText: 'Medium Priority' });
    const criticalTask = page.locator('.task-item', { hasText: 'Critical Priority' });
    
    // Use .first() to avoid strict mode violations when multiple elements match
    await expect(lowTask.getByText(/low/i).first()).toBeVisible();
    await expect(mediumTask.getByText(/medium/i).first()).toBeVisible();
    await expect(criticalTask.getByText(/critical/i).first()).toBeVisible();
  });

  test('should display formatted deadline', async ({ page }) => {
    await todoPage.addTask('Test Checklist', 'Task with Deadline', '', '2026-12-25');
    
    const taskItem = page.locator('.task-item', { hasText: 'Task with Deadline' });
    // Check that the deadline label and some part of the date are visible
    await expect(taskItem).toContainText('Deadline');
    await expect(taskItem).toContainText('2026');
  });

  test('should handle multiline task description', async ({ page }) => {
    const multilineDescription = 'Line 1\nLine 2\nLine 3';
    await todoPage.addTask('Test Checklist', 'Multiline Task', multilineDescription);
    
    await expect(page.getByText('Line 1')).toBeVisible();
    await expect(page.getByText('Line 2')).toBeVisible();
    await expect(page.getByText('Line 3')).toBeVisible();
  });
});
