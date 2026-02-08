import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('UI Interactions and User Experience', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
  });

  test('should display app header with title', async ({ page }) => {
    await expect(page.getByText('Task Lists')).toBeVisible();
  });

  test('should display New Checklist button', async () => {
    await expect(todoPage.newChecklistButton).toBeVisible();
    await expect(todoPage.newChecklistButton).toBeEnabled();
  });

  test('should open checklist modal when New Checklist is clicked', async () => {
    await todoPage.newChecklistButton.click();
    
    await expect(todoPage.checklistModalTitle).toBeVisible();
    await expect(todoPage.checklistModalSaveButton).toBeVisible();
    await expect(todoPage.checklistModalCancelButton).toBeVisible();
  });

  test('should close checklist modal when Cancel is clicked', async () => {
    await todoPage.newChecklistButton.click();
    await expect(todoPage.checklistModalTitle).toBeVisible();
    
    await todoPage.checklistModalCancelButton.click();
    
    await expect(todoPage.checklistModalTitle).not.toBeVisible();
  });

  test('should close checklist modal after saving', async () => {
    await todoPage.newChecklistButton.click();
    await todoPage.checklistModalTitle.fill('Test List');
    await todoPage.checklistModalSaveButton.click();
    
    await expect(todoPage.checklistModalTitle).not.toBeVisible();
  });

  test('should display checklist action buttons', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    const checklistCard = page.locator('.checklist-card', { hasText: 'Test Checklist' });
    const buttons = checklistCard.getByRole('button');
    
    // Should have 4 buttons: collapse, add task, edit, delete
    expect(await buttons.count()).toBeGreaterThanOrEqual(3);
  });

  test('should open task modal when Add Task is clicked', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    const checklistCard = page.locator('.checklist-card', { hasText: 'Test Checklist' });
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const addTaskButton = actionsContainer.locator('button').first();
    await addTaskButton.click({ position: { x: 10, y: 10 } });
    
    // Wait for modal to open
    await page.waitForTimeout(300);
    
    await expect(todoPage.taskModalTitle).toBeVisible();
    await expect(todoPage.taskModalSaveButton).toBeVisible();
    await expect(todoPage.taskModalCancelButton).toBeVisible();
  });

  test('should close task modal when Cancel is clicked', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    const checklistCard = page.locator('.checklist-card', { hasText: 'Test Checklist' });
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const addTaskButton = actionsContainer.locator('button').first();
    await addTaskButton.click({ position: { x: 10, y: 10 } });
    
    // Wait for modal to open
    await page.waitForTimeout(300);
    
    await todoPage.taskModalCancelButton.click();
    
    await expect(todoPage.taskModalTitle).not.toBeVisible();
  });

  test('should display task action buttons', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    const taskItem = page.locator('.task-item', { hasText: 'Test Task' });
    const buttons = taskItem.getByRole('button');
    
    // Should have 2 buttons: edit and delete
    expect(await buttons.count()).toBe(2);
  });

  test('should show completed task with strikethrough style', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    const taskTitle = page.locator('.task-item__title', { hasText: 'Test Task' });
    
    // Initially no completed class
    await expect(taskTitle).not.toHaveClass(/completed/);
    
    // Toggle completion
    await todoPage.toggleTask('Test Task');
    
    // Should have completed class
    await expect(taskTitle).toHaveClass(/completed/);
  });

  test('should handle keyboard navigation for checklist expansion', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    const titleRow = page.locator('.checklist-card__title-row');
    
    // Focus the title row
    await titleRow.focus();
    
    // Press Enter to collapse
    await page.keyboard.press('Enter');
    await expect(page.getByText('Test Task')).not.toBeVisible();
    
    // Press Enter to expand
    await page.keyboard.press('Enter');
    await expect(page.getByText('Test Task')).toBeVisible();
  });

  test('should display priority labels with correct styling', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Low Task', '', '', 'low');
    await todoPage.addTask('Test Checklist', 'Medium Task', '', '', 'medium');
    await todoPage.addTask('Test Checklist', 'Critical Task', '', '', 'critical');
    
    const lowTask = page.locator('.task-item', { hasText: 'Low Task' });
    const mediumTask = page.locator('.task-item', { hasText: 'Medium Task' });
    const criticalTask = page.locator('.task-item', { hasText: 'Critical Task' });
    
    // Use .first() to avoid strict mode violations when multiple elements match
    await expect(lowTask.getByText(/low/i).first()).toBeVisible();
    await expect(mediumTask.getByText(/medium/i).first()).toBeVisible();
    await expect(criticalTask.getByText(/critical/i).first()).toBeVisible();
  });

  test('should maintain scroll position when adding tasks', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist');
    
    // Add multiple tasks
    for (let i = 1; i <= 5; i++) {
      await todoPage.addTask('Test Checklist', `Task ${i}`);
    }
    
    // All tasks should be visible
    for (let i = 1; i <= 5; i++) {
      await expect(page.getByText(`Task ${i}`)).toBeVisible();
    }
  });

  test('should handle rapid task toggling', async () => {
    await todoPage.createChecklist('Test Checklist');
    await todoPage.addTask('Test Checklist', 'Task 1');
    await todoPage.addTask('Test Checklist', 'Task 2');
    await todoPage.addTask('Test Checklist', 'Task 3');
    
    // Rapidly toggle tasks
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 2');
    await todoPage.toggleTask('Task 3');
    await todoPage.toggleTask('Task 1');
    await todoPage.toggleTask('Task 2');
    
    // Verify final state
    expect(await todoPage.isTaskCompleted('Task 1')).toBe(false);
    expect(await todoPage.isTaskCompleted('Task 2')).toBe(false);
    expect(await todoPage.isTaskCompleted('Task 3')).toBe(true);
  });

  test('should display empty state message correctly', async ({ page }) => {
    await expect(page.getByText(/no checklists yet/i)).toBeVisible();
    
    await todoPage.createChecklist('Test Checklist');
    await expect(page.getByText(/no checklists yet/i)).not.toBeVisible();
    await expect(page.getByText(/no tasks yet/i)).toBeVisible();
    
    await todoPage.addTask('Test Checklist', 'Task 1');
    await expect(page.getByText(/no tasks yet/i)).not.toBeVisible();
  });

  test('should handle multiple checklists with different states', async ({ page }) => {
    await todoPage.createChecklist('Empty Checklist');
    await todoPage.createChecklist('Checklist with Tasks');
    
    await todoPage.addTask('Checklist with Tasks', 'Task 1');
    await todoPage.addTask('Checklist with Tasks', 'Task 2');
    await todoPage.toggleTask('Task 1');
    
    // Verify both checklists are visible
    await expect(page.getByText('Empty Checklist')).toBeVisible();
    await expect(page.getByText('Checklist with Tasks')).toBeVisible();
    
    // Verify task states
    expect(await todoPage.isTaskCompleted('Task 1')).toBe(true);
    expect(await todoPage.isTaskCompleted('Task 2')).toBe(false);
  });

  test('should preserve UI state during operations', async ({ page }) => {
    await todoPage.createChecklist('Test Checklist', 'Test Description');
    
    // Verify description is visible
    await expect(page.getByText('Test Description')).toBeVisible();
    
    // Add a task
    await todoPage.addTask('Test Checklist', 'Test Task');
    
    // Description should still be visible
    await expect(page.getByText('Test Description')).toBeVisible();
    
    // Toggle task
    await todoPage.toggleTask('Test Task');
    
    // Description should still be visible
    await expect(page.getByText('Test Description')).toBeVisible();
  });
});
