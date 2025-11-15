import React, { useEffect, useState } from 'react';
import api from '../api/api';
import dayjs from 'dayjs';
import './ExpenseForm.css';

export default function ExpenseForm({ onClose, month,onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    date: dayjs().format('YYYY-MM-DD')
  });
  const [msg, setMsg] = useState(null);

  // Load categories on mount
  useEffect(() => {
    api.getCategories().then(r => setCategories(r.data || []));
  }, []);


const submit = async (e) => {
  e.preventDefault();
  setMsg(null);

  try {
    // Create expense in DB
    await api.createExpense({
      category: form.category,
      amount: Number(form.amount),
      date: form.date
    });

    // Ensure backend has updated report before refreshing dashboard
    const report = await api.monthlyReport(form.date.slice(0, 7));
    const row = report.data.data.find(r => r.category._id === form.category);

    const spent = row?.spent || 0;
    const limit = row?.limit ?? null;
    const remaining = limit !== null ? limit - spent : null;

    setMsg({
      type: remaining !== null && remaining < 0 ? 'error' : 'success',
      text: remaining !== null && remaining < 0
        ? `Over budget by ${Math.abs(remaining)}`
        : 'Within budget'
    });

    // Refresh dashboard (if provided)
    if (onSuccess) onSuccess();

    // Close after delay
    setTimeout(() => onClose(), 1500);

  } catch (err) {
    setMsg({ type: 'error', text: err.response?.data?.message || 'Error' });
  }
};


  return (
    <div className="expense-overlay">
  <div className="expense-modal">
    <h3>Add Expense</h3>
    <form onSubmit={submit}>
      <div>
        <label>Category</label>
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          required
        >
          <option value="">Select</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          required
        />
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          required
        />
      </div>

      {msg && (
        <div className={`expense-msg ${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  </div>
</div>

  );
}
