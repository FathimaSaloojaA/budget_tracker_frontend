import React, { useEffect, useState } from 'react';
import api from '../api/api';
import dayjs from 'dayjs';

export default function ExpenseForm({ onClose, month }) {
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
      // Save the expense
      await api.createExpense({
        category: form.category,
        amount: Number(form.amount),
        date: form.date
      });

      // Fetch latest monthly report for selected month
      const report = await api.monthlyReport(form.date.slice(0, 7)); // YYYY-MM
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

      // Close modal after 1.5 seconds
      setTimeout(() => onClose(), 1500);

    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 16, width: 420, borderRadius: 8 }}>
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
            <div style={{ color: msg.type === 'error' ? 'red' : 'green', marginTop: 8 }}>
              {msg.text}
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
