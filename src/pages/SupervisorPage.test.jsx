import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupervisorPage from '../pages/SupervisorPage';
import * as requestHooks from '../hooks/useRequest';

const mockRequests = [
  {
    id: '1',
    employeeName: 'Alice',
    estimatedBudget: 200,
    expectedDate: '2025-06-25',
    status: 'submitted',
    description: 'Training A',
  },
  {
    id: '2',
    employeeName: 'Bob',
    estimatedBudget: 500,
    expectedDate: '2025-06-20',
    status: 'approved',
    description: 'Training B',
  },
];

describe('SupervisorPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(requestHooks, 'useRequests').mockReturnValue({
      data: mockRequests,
      isLoading: false,
    });

    vi.spyOn(requestHooks, 'useUpdateRequest').mockReturnValue({
      mutate: vi.fn(),
      isSuccess: true,
      reset: vi.fn(),
      isIdle: false,
    });
  });

  it('filters by employee name', async () => {
    render(<SupervisorPage />);
    fireEvent.change(screen.getByPlaceholderText(/filter by employee name/i), {
      target: { value: 'Alice' },
    });

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });
  });

  it('filters by status tab', async () => {
    render(<SupervisorPage />);
    fireEvent.click(screen.getByLabelText('Status tab approved'));

    await waitFor(() => {
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });

  it('updates status from modal', async () => {
    const mutate = vi.fn();
    const reset = vi.fn();

    vi.spyOn(requestHooks, 'useUpdateRequest').mockReturnValue({
      mutate,
      isSuccess: true,
      reset,
      isIdle: false,
    });

    render(<SupervisorPage />);
    fireEvent.click(screen.getByText('Alice'));

    const select = screen.getByLabelText('Update Status:');
    fireEvent.change(select, { target: { value: 'approved' } });

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        id: '1',
        data: { status: 'approved' },
      });
      expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
    });
  });
});
