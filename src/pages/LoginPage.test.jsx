import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../contexts/authProvider';
import ProtectedRoute from '../components/ProtectedRoute';

import { http } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = await request.json();

    const { username, password } = body;

    if (username === 'carol' && password === 'adminpass') {
      return new Response(JSON.stringify({ username: 'carol', role: 'supervisor' }), {
        status: 200,
      });
    }

    if (username === 'alice' && password === 'password123') {
      return new Response(JSON.stringify({ username: 'alice', role: 'employee' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

const renderWithAuth = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/employee"
            element={
              <ProtectedRoute roles={['employee', 'supervisor']}>
                <LocationDisplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute roles={['supervisor']}>
                <LocationDisplay />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

describe('LoginPage Integration Test', () => {
  it('redirects to /supervisor when carol logs in', async () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'carol' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'adminpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/supervisor');
    });
  });

  it('redirects to /supervisor when carol logs in', async () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'carol' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'adminpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/supervisor');
    });
  });

  it('redirects to /employee when alice logs in', async () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/employee');
    });
  });

  it('redirects employee to /employee and prevents access to /supervisor', async () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'alice' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('/employee')).toBeInTheDocument();
    });

    window.history.pushState({}, '', '/supervisor');
    renderWithAuth();

    // Assert access is denied (should still show /employee or deny)
    await waitFor(() => {
      expect(screen.queryByText('/supervisor')).not.toBeInTheDocument();
    });

    expect(screen.getByText('/employee')).toBeInTheDocument();
  });

  it('shows error for wrong credentials', async () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'badpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
