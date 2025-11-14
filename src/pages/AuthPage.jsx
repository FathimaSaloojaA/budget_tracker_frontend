import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage(){
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', name:'' });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try{
      if (tab === 'login'){
        const res = await api.login({ email: form.email, password: form.password });
        login(res.data);
      } else {
        const res = await api.register({ email: form.email, password: form.password, name: form.name });
        login(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || (err.response?.data?.errors && err.response.data.errors[0].msg) || 'Error');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20, border: '1px solid #ddd' }}>
      <h2>{tab === 'login' ? 'Log In' : 'Sign Up'}</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setTab('login')} disabled={tab === 'login'}>Login</button>
        <button onClick={() => setTab('register')} disabled={tab === 'register'} style={{ marginLeft: 8 }}>Register</button>
      </div>
      <form onSubmit={submit}>
        {tab === 'register' && (
          <div style={{ marginBottom: 8 }}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
        )}
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" minLength={6} required />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">{tab === 'login' ? 'Log In' : 'Create Account'}</button>
      </form>
    </div>
  )
}
