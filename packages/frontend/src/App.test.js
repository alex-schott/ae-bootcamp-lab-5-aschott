import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Mock fetch globally
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Delete Functionality', () => {
    test('should delete a todo when delete button is clicked', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
        { id: 2, title: 'Another Todo', completed: true },
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTodos,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockTodos[1]],
        });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      await userEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/todos/1'),
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });
  });

  describe('Stats Calculation', () => {
    test('should display correct incomplete count', async () => {
      const mockTodos = [
        { id: 1, title: 'Incomplete 1', completed: false },
        { id: 2, title: 'Completed 1', completed: true },
        { id: 3, title: 'Incomplete 2', completed: false },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('2 items left')).toBeInTheDocument();
      });
    });

    test('should display correct completed count', async () => {
      const mockTodos = [
        { id: 1, title: 'Incomplete 1', completed: false },
        { id: 2, title: 'Completed 1', completed: true },
        { id: 3, title: 'Completed 2', completed: true },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('2 completed')).toBeInTheDocument();
      });
    });

    test('should update stats after toggling todo', async () => {
      const initialTodos = [
        { id: 1, title: 'Test Todo', completed: false },
      ];
      const updatedTodos = [
        { id: 1, title: 'Test Todo', completed: true },
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => initialTodos,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updatedTodos,
        });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('1 items left')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText('0 items left')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('1 completed')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    test('should display empty state message when no todos exist', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText(/no todos yet/i)
        ).toBeInTheDocument();
      });
    });

    test('should not display empty state when todos exist', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });

      expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should display error message when fetch fails', async () => {
      fetch.mockRejectedValue(new Error('Failed to fetch'));

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText(/error loading todos/i)
        ).toBeInTheDocument();
      });
    });

    test('should display error message when API returns error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText(/error loading todos/i)
        ).toBeInTheDocument();
      });
    });

    test('should allow retry after error', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
      ];

      fetch
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTodos,
        });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Functionality', () => {
    test('should enter edit mode when edit button is clicked', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });

      const editButton = screen.getByLabelText(/edit/i);
      await userEvent.click(editButton);

      expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    });

    test('should save edited todo when save button is clicked', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
      ];
      const updatedTodos = [
        { id: 1, title: 'Updated Todo', completed: false },
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTodos,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updatedTodos,
        });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });

      const editButton = screen.getByLabelText(/edit/i);
      await userEvent.click(editButton);

      const input = screen.getByDisplayValue('Test Todo');
      await userEvent.clear(input);
      await userEvent.type(input, 'Updated Todo');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/todos/1'),
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ title: 'Updated Todo' }),
          })
        );
      });
    });

    test('should cancel edit when cancel button is clicked', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });

      const editButton = screen.getByLabelText(/edit/i);
      await userEvent.click(editButton);

      const input = screen.getByDisplayValue('Test Todo');
      await userEvent.clear(input);
      await userEvent.type(input, 'Changed');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Changed')).not.toBeInTheDocument();
    });
  });

  describe('API URL Configuration', () => {
    test('should use relative URL for API calls', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      render(<App />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringMatching(/^\/api\/todos$/)
        );
      });
    });
  });
});
