import { Page, Locator } from '@playwright/test';

/**
 * Helper class for interacting with the Todo List application
 */
export class TodoListPage {
  readonly page: Page;
  readonly newChecklistButton: Locator;
  readonly checklistModalTitle: Locator;
  readonly checklistModalDescription: Locator;
  readonly checklistModalSaveButton: Locator;
  readonly checklistModalCancelButton: Locator;
  readonly taskModalTitle: Locator;
  readonly taskModalDescription: Locator;
  readonly taskModalDeadline: Locator;
  readonly taskModalSaveButton: Locator;
  readonly taskModalCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newChecklistButton = page.getByRole('button', { name: /new checklist/i });
    this.checklistModalTitle = page.getByPlaceholder(/enter checklist title/i);
    this.checklistModalDescription = page.getByPlaceholder(/enter checklist description/i);
    this.checklistModalSaveButton = page.getByRole('button', { name: /create|update/i });
    this.checklistModalCancelButton = page.getByRole('button', { name: /cancel/i });
    this.taskModalTitle = page.getByPlaceholder(/enter task title/i);
    this.taskModalDescription = page.getByPlaceholder(/enter task description/i);
    this.taskModalDeadline = page.locator('input[type="date"]');
    this.taskModalSaveButton = page.getByRole('button', { name: /create|update/i });
    this.taskModalCancelButton = page.getByRole('button', { name: /cancel/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async createChecklist(title: string, description?: string) {
    await this.newChecklistButton.click();
    await this.checklistModalTitle.fill(title);
    if (description) {
      await this.checklistModalDescription.fill(description);
    }
    await this.checklistModalSaveButton.click();
    // Wait for modal to close
    await this.page.waitForTimeout(300);
  }

  async editChecklist(checklistTitle: string, newTitle: string, newDescription?: string) {
    const checklistCard = this.page.locator('.checklist-card', { hasText: checklistTitle });
    // Find the actions container and click the second button (Edit)
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const editButton = actionsContainer.locator('button').nth(1);
    await editButton.click({ position: { x: 10, y: 10 } });
    
    await this.checklistModalTitle.fill(newTitle);
    if (newDescription !== undefined) {
      await this.checklistModalDescription.fill(newDescription);
    }
    await this.checklistModalSaveButton.click();
    await this.page.waitForTimeout(300);
  }

  async deleteChecklist(checklistTitle: string) {
    const checklistCard = this.page.locator('.checklist-card', { hasText: checklistTitle });
    // Find the actions container and click the third button (Delete)
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const deleteButton = actionsContainer.locator('button').nth(2);
    await deleteButton.click({ position: { x: 10, y: 10 } });
    await this.page.waitForTimeout(300);
  }

  async addTask(
    checklistTitle: string,
    taskTitle: string,
    description?: string,
    deadline?: string,
    priority?: 'low' | 'medium' | 'critical'
  ) {
    const checklistCard = this.page.locator('.checklist-card', { hasText: checklistTitle });
    // Find the actions container and click the first button (Add Task)
    const actionsContainer = checklistCard.locator('.checklist-card__actions');
    const addTaskButton = actionsContainer.locator('button').first();
    
    // Click at the center of the button
    await addTaskButton.click({ position: { x: 10, y: 10 } });
    
    // Wait for modal to open
    await this.taskModalTitle.waitFor({ state: 'visible', timeout: 5000 });
    await this.taskModalTitle.fill(taskTitle);
    if (description) {
      await this.taskModalDescription.fill(description);
    }
    if (deadline) {
      await this.taskModalDeadline.fill(deadline);
    }
    if (priority) {
      // Click the select button to open dropdown
      const selectButton = this.page.locator('.g-select-control__button').last();
      await selectButton.click();
      await this.page.waitForTimeout(300);
      // Click the priority option from the dropdown - capitalize first letter to match options
      const capitalizedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
      // Try multiple selectors for the dropdown items
      const priorityOption = this.page.getByRole('option', { name: capitalizedPriority }).or(
        this.page.locator('.g-select-list__item', { hasText: capitalizedPriority })
      ).or(
        this.page.getByText(capitalizedPriority, { exact: true })
      );
      await priorityOption.first().click();
    }
    await this.taskModalSaveButton.click();
    await this.page.waitForTimeout(300);
  }

  async toggleTask(taskTitle: string) {
    const taskItem = this.page.locator('.task-item', { hasText: taskTitle });
    const checkbox = taskItem.locator('input[type="checkbox"]');
    await checkbox.click();
    await this.page.waitForTimeout(200);
  }

  async editTask(
    taskTitle: string,
    newTitle: string,
    newDescription?: string,
    newDeadline?: string,
    newPriority?: 'low' | 'medium' | 'critical'
  ) {
    const taskItem = this.page.locator('.task-item', { hasText: taskTitle });
    const editButton = taskItem.getByRole('button').first(); // First button is edit
    await editButton.click();

    await this.taskModalTitle.fill(newTitle);
    if (newDescription !== undefined) {
      await this.taskModalDescription.fill(newDescription);
    }
    if (newDeadline) {
      await this.taskModalDeadline.fill(newDeadline);
    }
    if (newPriority) {
      // Click the select button to open dropdown
      const selectButton = this.page.locator('.g-select-control__button').last();
      await selectButton.click();
      await this.page.waitForTimeout(300);
      // Click the priority option from the dropdown - capitalize first letter to match options
      const capitalizedPriority = newPriority.charAt(0).toUpperCase() + newPriority.slice(1);
      // Try multiple selectors for the dropdown items
      const priorityOption = this.page.getByRole('option', { name: capitalizedPriority }).or(
        this.page.locator('.g-select-list__item', { hasText: capitalizedPriority })
      ).or(
        this.page.getByText(capitalizedPriority, { exact: true })
      );
      await priorityOption.first().click();
    }
    await this.taskModalSaveButton.click();
    await this.page.waitForTimeout(300);
  }

  async deleteTask(taskTitle: string) {
    const taskItem = this.page.locator('.task-item', { hasText: taskTitle });
    const deleteButton = taskItem.getByRole('button').nth(1); // Second button is delete
    await deleteButton.click();
    await this.page.waitForTimeout(300);
  }

  async getChecklistCount(): Promise<number> {
    return await this.page.locator('.checklist-card').count();
  }

  async getTaskCount(checklistTitle: string): Promise<number> {
    const checklistCard = this.page.locator('.checklist-card', { hasText: checklistTitle });
    return await checklistCard.locator('.task-item').count();
  }

  async isChecklistVisible(title: string): Promise<boolean> {
    return await this.page.locator('.checklist-card', { hasText: title }).isVisible();
  }

  async isTaskVisible(title: string): Promise<boolean> {
    return await this.page.locator('.task-item', { hasText: title }).isVisible();
  }

  async isTaskCompleted(title: string): Promise<boolean> {
    const taskItem = this.page.locator('.task-item', { hasText: title });
    const checkbox = taskItem.locator('input[type="checkbox"]');
    return await checkbox.isChecked();
  }

  async getProgressText(checklistTitle: string): Promise<string> {
    const checklistCard = this.page.locator('.checklist-card', { hasText: checklistTitle });
    const progressText = checklistCard.locator('.checklist-card__progress-info').last();
    return await progressText.textContent() || '';
  }

  async toggleChecklistExpansion(checklistTitle: string) {
    const checklistCard = this.page.locator('.checklist-card', { hasText: checklistTitle });
    // Click on the title row to toggle expansion
    const titleRow = checklistCard.locator('.checklist-card__title-row');
    await titleRow.click();
    await this.page.waitForTimeout(200);
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}
