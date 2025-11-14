

import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ReportsPage from './pages/ReportsPage';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Settings pages
import SettingsLayout from './pages/Settings/SettingsLayout';
import CategoriesPage from './pages/Settings/CategoriesPage';
import BudgetsPage from './pages/Settings/BudgetsPage';

// Layout wrapper
import AppLayout from './layout/AppLayout';

export default function App() {
  const { user } = useContext(AuthContext);
  const [openExpense, setOpenExpense] = useState(false); // Lifted modal state

  return (
    <Routes>
      {/* Public auth page */}
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />

      {/* Protected pages wrapped in AppLayout */}
      <Route element={<ProtectedRoute><AppLayout onAddExpense={() => setOpenExpense(true)} /></ProtectedRoute>}>

        {/* Dashboard */}
        <Route path="/" element={<Dashboard openExpense={openExpense} setOpenExpense={setOpenExpense} />} />

        {/* Reports */}
        <Route path="/reports" element={<ReportsPage />} />

        {/* Settings with tabs */}
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="categories" />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
    </Routes>
  );
}
