import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AppLayout({ onAddExpense }) {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>

      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        borderTop: '1px solid #ccc',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        background: '#fff'
      }}>
        <NavLink to="/" end>Dashboard</NavLink>
        <button onClick={onAddExpense}>Add Expense</button>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/settings/categories">Settings</NavLink>

        {/* Logout button */}
        <button onClick={logout}>Logout</button>
      </nav>

    </div>
  );
}
