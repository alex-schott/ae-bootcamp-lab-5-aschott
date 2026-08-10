/**
 * Page Object Model for TODO App
 * Encapsulates selectors and interactions for the TODO application
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.emptyStateMessage = page.getByText(/no todos yet/i);
    this.errorMessage = page.getByText(/error loading todos/i);
    this.retryButton = page.getByRole('button', { name: /retry/i });
  }

  /**
   * Navigate to the TODO app
   */
  async goto() {
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  }

  /**
   * Clear all todos (for test isolation)
   */
  async clearAllTodos() {
    const todoCount = await this.getTodoCount();
    if (todoCount === 0) return;
    
    // Delete all visible todos
    const deleteButtons = this.page.locator('[aria-label="delete"]');
    const count = await deleteButtons.count();
    
    for (let i = 0; i < count; i++) {
      // Always click the first delete button since the list updates
      await deleteButtons.first().click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Add a new todo
   */
  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    // Wait for the todo to appear in the list
    await this.page.waitForSelector(`text=${title}`, { timeout: 5000 });
  }

  /**
   * Get a todo item by title
   */
  getTodoItem(title) {
    return this.page.locator('li').filter({ hasText: title });
  }

  /**
   * Toggle todo completion status
   */
  async toggleTodo(title) {
    const todoItem = this.getTodoItem(title);
    const checkbox = todoItem.getByRole('checkbox');
    await checkbox.click();
  }

  /**
   * Delete a todo
   */
  async deleteTodo(title) {
    const todoItem = this.getTodoItem(title);
    const deleteButton = todoItem.getByLabel('delete');
    await deleteButton.click();
    // Wait for the todo to be removed
    await this.page.waitForTimeout(500);
  }

  /**
   * Edit a todo
   */
  async editTodo(oldTitle, newTitle) {
    const todoItem = this.getTodoItem(oldTitle);
    const editButton = todoItem.getByLabel('edit');
    await editButton.click();
    
    // Wait for Save button to appear (indicates edit mode)
    const saveButton = this.page.getByRole('button', { name: /save/i });
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    
    // Get all inputs - first is "What needs to be done?", second is edit field
    const allInputs = this.page.locator('input');
    const count = await allInputs.count();
    // Use the last input (edit field) or second if there are exactly 2
    const editInput = count > 1 ? allInputs.nth(1) : allInputs.first();
    
    await editInput.click(); // Focus the input
    await editInput.fill(newTitle);
    
    await saveButton.click();
    
    // Wait for the updated todo to appear
    await this.page.waitForTimeout(500);
  }

  /**
   * Cancel editing a todo
   */
  async cancelEdit(title) {
    const todoItem = this.getTodoItem(title);
    const editButton = todoItem.getByLabel('edit');
    await editButton.click();
    
    const cancelButton = todoItem.getByRole('button', { name: /cancel/i });
    await cancelButton.click();
  }

  /**
   * Get the incomplete count from stats
   */
  async getIncompleteCount() {
    const chip = this.page.locator('text=/\\d+ items left/');
    const text = await chip.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  /**
   * Get the completed count from stats
   */
  async getCompletedCount() {
    const chip = this.page.locator('text=/\\d+ completed/');
    const text = await chip.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  /**
   * Check if a todo is completed (has line-through)
   */
  async isTodoCompleted(title) {
    const todoItem = this.getTodoItem(title);
    const todoText = todoItem.locator('p').first();
    const textDecoration = await todoText.evaluate(el => 
      window.getComputedStyle(el).textDecoration
    );
    return textDecoration.includes('line-through');
  }

  /**
   * Get all visible todos
   */
  async getTodoCount() {
    const todos = this.page.locator('li[class*="MuiListItem"]');
    return await todos.count();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoaded() {
    await this.page.waitForLoadState('networkidle');
    // Ensure loading spinner is gone
    await this.page.waitForSelector('[data-testid="CircularProgress"]', { 
      state: 'hidden', 
      timeout: 5000 
    }).catch(() => {
      // Spinner might not appear if data loads quickly
    });
  }
}

module.exports = { TodoPage };
