import React, { useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import dayjs from 'dayjs';
import './AppLayout.css';


export default function AppLayout() {
  const { logout } = useContext(AuthContext);
  const [openExpense, setOpenExpense] = useState(false);
  const [month] = useState(dayjs().format('YYYY-MM'));

  return (
    <div className="app-layout">
      
      {/* Desktop Sidebar */}
      <aside className="sidebar">
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
        <Outlet />
      </main>

      {/* Mobile navbar */}
      <nav className="mobile-nav">
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
      // 🔥 REFRESH the dashboard by reloading the route
      window.dispatchEvent(new CustomEvent("expense-added"));
    }}
  />
)}


      {/* Styles */}
      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          display: flex;
          flex-direction: column;
          width: 220px;
          background: #f5f5f5;
          padding: 20px;
          border-right: 1px solid #ddd;
        }

        .sidebar-top {
          margin-bottom: 20px;
        }

        .add-expense-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .nav-button.logout-button {
          background: #e53935;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }

        /* Main content */
        .main-content {
          flex: 1;
          padding: 20px;
        }

        /* Mobile navbar */
        .mobile-nav {
          display: none;
          justify-content: space-around;
          padding: 12px 0;
          border-top: 1px solid #ccc;
          position: fixed;
          bottom: 0;
          width: 100%;
          background: #fff;
          z-index: 1000;
        }

        /* Desktop view */
        @media(min-width: 768px) {
          .sidebar { display: flex; }
          .mobile-nav { display: none; }
        }

        /* Mobile view */
        @media(max-width: 767px) {
          .sidebar { display: none; }
          .main-content { margin-bottom: 60px; }
          .mobile-nav { display: flex; }
        }
      `}</style>
    </div>
  );
}
