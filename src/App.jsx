import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import EmployeePage from './pages/EmployeePage';
import SupervisorPage from './pages/SupervisorPage';
import ComponentPage from './pages/ComponentPage';

import { useAuth } from './contexts/authProvider';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
export default function App() {
  const location = useLocation();
  const { user } = useAuth();

  const hideHeaderOn = ['/login'];
  const shouldShowHeader = user && !hideHeaderOn.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={['employee', 'supervisor']}>
              <EmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute roles={['supervisor']}>
              <SupervisorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/components" element={<ComponentPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}
