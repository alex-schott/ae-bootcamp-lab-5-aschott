/**
 * TODO App End-to-End Tests
 * Critical user journeys for create, edit, toggle, delete, and error handling
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('TODO App - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.waitForLoaded();
    // Clear all todos for test isolation
    await todoPage.clearAllTodos();
  });

  test('should create a new todo', async () => {
    // Verify empty state
    await expect(todoPage.emptyStateMessage).toBeVisible();
    
    // Create a todo
    await todoPage.addTodo('Buy groceries');
    
    // Verify todo appears
    const todoItem = todoPage.getTodoItem('Buy groceries');
    await expect(todoItem).toBeVisible();
    
    // Verify stats
    const incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBe(1);
    
    const completedCount = await todoPage.getCompletedCount();
    expect(completedCount).toBe(0);
  });

  test('should toggle todo completion status', async ({ page }) => {
    // Create a todo
    await todoPage.addTodo('Finish project');
    
    // Verify initial state
    let isCompleted = await todoPage.isTodoCompleted('Finish project');
    expect(isCompleted).toBe(false);
    
    let incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBe(1);
    
    // Toggle to completed
    await todoPage.toggleTodo('Finish project');
    await page.waitForTimeout(500);
    
    // Verify completed state
    isCompleted = await todoPage.isTodoCompleted('Finish project');
    expect(isCompleted).toBe(true);
    
    incompleteCount = await todoPage.getIncompleteCount();
    expect(incompleteCount).toBe(0);
    
    const completedCount = await todoPage.getCompletedCount();
    expect(completedCount).toBe(1);
    
    // Toggle back to incomplete
    await todoPage.toggleTodo('Finish project');
    await page.waitForTimeout(500);
    
    isCompleted = await todoPage.isTodoCompleted('Finish project');
    expect(isCompleted).toBe(false);
  });

  test('should edit a todo', async () => {
    // Create a todo
    await todoPage.addTodo('Original task');
    
    // Edit the todo
    await todoPage.editTodo('Original task', 'Updated task');
    
    // Verify old text is gone
    const oldTodoItem = todoPage.getTodoItem('Original task');
    await expect(oldTodoItem).not.toBeVisible();
    
    // Verify new text is present
    const newTodoItem = todoPage.getTodoItem('Updated task');
    await expect(newTodoItem).toBeVisible();
  });

  test('should delete a todo', async ({ page }) => {
    // Create multiple todos
    await todoPage.addTodo('Task to keep');
    await todoPage.addTodo('Task to delete');
    
    // Verify both exist
    let todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(2);
    
    // Delete one todo
    await todoPage.deleteTodo('Task to delete');
    await page.waitForTimeout(500);
    
    // Verify only one remains
    todoCount = await todoPage.getTodoCount();
    expect(todoCount).toBe(1);
    
    // Verify correct todo remains
    const remainingTodo = todoPage.getTodoItem('Task to keep');
    await expect(remainingTodo).toBeVisible();
    
    const deletedTodo = todoPage.getTodoItem('Task to delete');
    await expect(deletedTodo).not.toBeVisible();
  });

  test('should handle backend errors gracefully', async ({ page, context }) => {
    // Simulate backend failure by blocking API requests
    await context.route('**/api/todos**', route => {
      route.abort('failed');
    });
    
    // Reload page to trigger error
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verify error message is displayed
    await expect(todoPage.errorMessage).toBeVisible();
    await expect(todoPage.retryButton).toBeVisible();
    
    // Verify retry button is functional
    await expect(todoPage.retryButton).toBeEnabled();
  });
});