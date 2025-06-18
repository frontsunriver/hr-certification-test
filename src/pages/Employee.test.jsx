import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import EmployeePage from '../pages/EmployeePage';
import { AuthProvider } from '../contexts/authProvider';

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('RequestForm Validation', () => {
  beforeEach(() => {
    renderWithProviders(<EmployeePage />);
  });

  it('shows errors on empty submission', async () => {
    const user = userEvent.setup();

    const description = screen.getByLabelText(/description/i);
    const budget = screen.getByLabelText(/estimated budget/i);
    const date = screen.getByLabelText(/expected date/i);

    await user.click(description);
    await user.tab();
    await user.click(budget);
    await user.tab();
    await user.click(date);
    await user.tab();

    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/budget is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/date is required/i)).toBeInTheDocument();
  });

  it('shows error for negative budget', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    const budgetInput = screen.getByLabelText(/estimated budget/i);
    await user.type(budgetInput, '-50');

    // Blur the field to trigger validation
    await user.tab();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/must be a positive number/i)).toBeInTheDocument();
  });

  it('shows error for past date', async () => {
    const user = userEvent.setup();

    // Fill other required fields
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.type(screen.getByLabelText(/estimated budget/i), '100');
    await user.tab();

    // Select a past date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const formatted = pastDate.toISOString().split('T')[0];

    const dateInput = screen.getByLabelText(/expected date/i);
    await user.clear(dateInput);
    await user.type(dateInput, formatted);
    await user.tab();

    // Click submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/date must be today or in the future./i)).toBeInTheDocument();
  });
});
