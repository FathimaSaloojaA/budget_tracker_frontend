import { NavLink, Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Settings</h2>

      {/* Tab / Menu for child pages */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <NavLink to="categories" style={({isActive}) => ({ fontWeight: isActive ? 'bold' : 'normal'})}>Categories</NavLink>
        <NavLink to="budgets" style={({isActive}) => ({ fontWeight: isActive ? 'bold' : 'normal'})}>Budgets</NavLink>
        {/* Optional: Expenses */}
      </div>

      <Outlet />
    </div>
  );
}
