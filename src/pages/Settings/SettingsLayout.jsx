import { NavLink, Outlet } from "react-router-dom";
import './SettingsLayout.css';

export default function SettingsLayout() {
  return (
    <div className="settings-layout">
      <h2>Settings</h2>

      {/* Tab / Menu for child pages */}
      <div className="settings-tabs">
        <NavLink to="categories" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Categories</NavLink>
        <NavLink to="budgets" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Budgets</NavLink>
      </div>

      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
}
