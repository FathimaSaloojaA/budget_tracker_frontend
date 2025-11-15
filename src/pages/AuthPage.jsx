import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiCreditCard } from 'react-icons/fi'; // same professional logo
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const togglePassword = () => setShowPassword((prev) => !prev);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (tab === 'login') {
        const res = await api.login({ email: form.email, password: form.password });
        login(res.data);
      } else {
        const res = await api.register({
          email: form.email,
          password: form.password,
          name: form.name,
        });
        login(res.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.response?.data?.errors && err.response.data.errors[0].msg) ||
          'Error'
      );
    }
  };

  return (
    <div className="auth-container">
      
      {/* App Branding/Header */}
      <div className="auth-header">
        <FiCreditCard className="auth-logo" />
        <span className="auth-app-name">Expensio</span>
      </div>

      <h2>{tab === 'login' ? 'Log In' : 'Sign Up'}</h2>

      <div className="tab-buttons">
        <button onClick={() => setTab('login')} disabled={tab === 'login'}>
          Login
        </button>
        <button onClick={() => setTab('register')} disabled={tab === 'register'}>
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={submit}>
        {tab === 'register' && (
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
        )}

        <div>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>

        <div className="password-container">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              minLength={6}
              required
            />
            <span className="password-toggle" onClick={togglePassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit">{tab === 'login' ? 'Log In' : 'Create Account'}</button>
      </form>

      {/* Inline styles for header branding */}
      <style>{`
        .auth-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .auth-logo {
          font-size: 36px;
          color: #5dade2;
        }
        .auth-app-name {
          font-size: 28px;
          font-weight: 700;
          color: #1f3c59;
        }
      `}</style>
    </div>
  );
}
