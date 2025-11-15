import React, { useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import dayjs from 'dayjs';
import { FiCreditCard } from 'react-icons/fi'; // professional icon
import './AppLayout.css';

export default function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const [openExpense, setOpenExpense] = useState(false);
  const [month] = useState(dayjs().format('YYYY-MM'));

  return (
    <div className="app-layout">
      
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-greeting">
          Hi, {user?.name || "User"} 👋
        </div>

        <div className="sidebar-top">
          <button
            onClick={() => setOpenExpense(true)}
            className="add-expense-btn"
          >
            + Add Expense
          </button>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className="nav-link">Dashboard</NavLink>
          <NavLink to="/reports" className="nav-link">Reports</NavLink>
          <NavLink to="/settings/categories" className="nav-link">Settings</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button onClick={logout} className="nav-button logout-button">Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* App Branding/Header */}
        <div className="app-header">
          <FiCreditCard className="app-logo" />
          <span className="app-name">Expensio</span>
        </div>

        {/* Page content */}
        <Outlet />
      </main>

      {/* Mobile navbar */}
      <nav className="mobile-nav">
        <span className="mobile-greeting">Hi, {user?.name || "User"} 👋</span>
        <NavLink to="/" end>Dashboard</NavLink>
        <button onClick={() => setOpenExpense(true)}>+ Expense</button>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/settings/categories">Settings</NavLink>
        <button onClick={logout}>Logout</button>
      </nav>

      {/* Expense Modal */}
      {openExpense && (
        <ExpenseForm
          onClose={() => setOpenExpense(false)}
          month={month}
          onSuccess={() => {
            window.dispatchEvent(new CustomEvent("expense-added"));
          }}
        />
      )}

      <style>{`
        .app-layout { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }

        /* Sidebar */
       .sidebar { display: flex; flex-direction: column; width: 220px; background: #f5f5f5; padding: 20px; border-right: 1px solid #ddd; } .sidebar-greeting { font-weight: 600; font-size: 16px; color: #1f3c59; margin-bottom: 16px; } .sidebar-top { margin-bottom: 20px; } .add-expense-btn { background: #1976d2; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 20px; } .nav-links { display: flex; flex-direction: column; gap: 12px; } .nav-link { text-decoration: none; color: #333; font-weight: 500; } .sidebar-bottom { margin-top: auto; } .nav-button.logout-button { background: #e53935; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%; }
        /* Main content */
        .main-content { flex: 1; padding: 20px; }

        /* App Branding/Header */
        .app-header { display: flex; align-items: center; gap: 10px; font-size: 28px; font-weight: 700; color: #1f3c59; margin-bottom: 20px; }
        .app-logo { font-size: 32px; color: #5dade2; }
        .app-name { font-weight: 700; }

        /* Mobile navbar */
        .mobile-nav { display: none; justify-content: space-around; align-items: center; padding: 12px 0; border-top: 1px solid #ccc; position: fixed; bottom: 0; width: 100%; background: #fff; z-index: 1000; gap: 6px; flex-wrap: wrap; }
        .mobile-greeting { width: 100%; text-align: center; font-weight: 600; color: #1f3c59; }

        @media(min-width: 768px) { .sidebar { display: flex; } .mobile-nav { display: none; } }
        @media(max-width: 767px) { .sidebar { display: none; } .main-content { margin-bottom: 80px; } .mobile-nav { display: flex; } }
      `}</style>
    </div>
  );
}
