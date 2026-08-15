import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage from './pages/NotFoundPage';
import api from './services/api';

// Lazy load admin dashboard page to ensure lightweight student bundle
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Verify active admin session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await api.get('/admin/me');
        if (response.success) {
          setAdmin(response.admin);
        }
      } catch (err) {
        setAdmin(null);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    setAdmin(null);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-xs font-semibold text-slate-400">
        Initializing DSDL Recruitment Portal...
      </div>
    );
  }

  return (
    <Routes>
      {/* Student Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/success" element={<SuccessPage />} />

      {/* Admin Authentication Routes */}
      <Route
        path="/admin/login"
        element={
          admin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          admin ? (
            <Suspense fallback={
              <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
                Loading Admin Dashboard...
              </div>
            }>
              <AdminDashboardPage admin={admin} onLogout={handleLogout} />
            </Suspense>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
