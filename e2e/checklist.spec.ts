import { test, expect } from '@playwright/test';
import { TodoListPage } from './fixtures/test-helpers';

test.describe('Checklist Operations', () => {
  let todoPage: TodoListPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoListPage(page);
    await todoPage.goto();
    await todoPage.clearLocalStorage();
    await page.reload();
  });

  test('should display empty state when no checklists exist', async ({ page }) => {
    await expect(page.getByText(/no checklists yet/i)).toBeVisible();
  });

  test('should create a new checklist with title only', async ({ page }) => {
    await todoPage.createChecklist('My First Checklist');
    
    await expect(page.getByText('My First Checklist')).toBeVisible();
    expect(await todoPage.getChecklistCount()).toBe(1);
  });

  test('should create a new checklist with title and description', async ({ page }) => {
    await todoPage.createChecklist('Shopping List', 'Weekly grocery shopping');
    
    await expect(page.getByText('Shopping List')).toBeVisible();
    await expect(page.getByText('Weekly grocery shopping')).toBeVisible();
  });

  test('should create multiple checklists', async ({ page }) => {
    await todoPage.createChecklist('Work Tasks');
    await todoPage.createChecklist('Personal Goals');
    await todoPage.createChecklist('Shopping List');
    
    expect(await todoPage.getChecklistCount()).toBe(3);
    await expect(page.getByText('Work Tasks')).toBeVisible();
    await expect(page.getByText('Personal Goals')).toBeVisible();
    await expect(page.getByText('Shopping List')).toBeVisible();
  });

  test('should edit checklist title', async ({ page }) => {
    await todoPage.createChecklist('Old Title');
    await todoPage.editChecklist('Old Title', 'New Title');
    
    await expect(page.getByText('New Title')).toBeVisible();
    await expect(page.getByText('Old Title')).not.toBeVisible();
  });

  test('should edit checklist description', async ({ page }) => {
    await todoPage.createChecklist('My List', 'Old description');
    await todoPage.editChecklist('My List', 'My List', 'New description');
    
    await expect(page.getByText('New description')).toBeVisible();
    await expect(page.getByText('Old description')).not.toBeVisible();
  });

  test('should delete a checklist', async ({ page }) => {
    await todoPage.createChecklist('To Delete');
    await expect(page.getByText('To Delete')).toBeVisible();
    
    await todoPage.deleteChecklist('To Delete');
    
    await expect(page.getByText('To Delete')).not.toBeVisible();
    expect(await todoPage.getChecklistCount()).toBe(0);
  });

  test('should delete one checklist while keeping others', async ({ page }) => {
    await todoPage.createChecklist('Keep This');
    await todoPage.createChecklist('Delete This');
    await todoPage.createChecklist('Keep This Too');
    
    await todoPage.deleteChecklist('Delete This');
    
    expect(await todoPage.getChecklistCount()).toBe(2);
    await expect(page.getByText('Keep This', { exact: true })).toBeVisible();
    await expect(page.getByText('Keep This Too', { exact: true })).toBeVisible();
    await expect(page.getByText('Delete This', { exact: true })).not.toBeVisible();
  });

  test('should cancel checklist creation', async ({ page }) => {
    await todoPage.newChecklistButton.click();
    await todoPage.checklistModalTitle.fill('Cancelled Checklist');
    await todoPage.checklistModalCancelButton.click();
    
    await expect(page.getByText('Cancelled Checklist')).not.toBeVisible();
    expect(await todoPage.getChecklistCount()).toBe(0);
  });

  test('should persist checklists after page reload', async ({ page }) => {
    await todoPage.createChecklist('Persistent List', 'This should survive reload');
    
    await page.reload();
    
    await expect(page.getByText('Persistent List')).toBeVisible();
    await expect(page.getByText('This should survive reload')).toBeVisible();
  });

  test('should expand and collapse checklist', async ({ page }) => {
    await todoPage.createChecklist('Collapsible List');
    await todoPage.addTask('Collapsible List', 'Test Task');
    
    // Initially expanded, task should be visible
    await expect(page.getByText('Test Task')).toBeVisible();
    
    // Collapse
    await todoPage.toggleChecklistExpansion('Collapsible List');
    await expect(page.getByText('Test Task')).not.toBeVisible();
    
    // Expand again
    await todoPage.toggleChecklistExpansion('Collapsible List');
    await expect(page.getByText('Test Task')).toBeVisible();
  });

  test('should show empty task message in new checklist', async ({ page }) => {
    await todoPage.createChecklist('Empty Checklist');
    
    await expect(page.getByText(/no tasks yet/i)).toBeVisible();
  });
});
