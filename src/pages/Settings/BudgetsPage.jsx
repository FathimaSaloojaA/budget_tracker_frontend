import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import './BudgetPage.css';

export default function BudgetsPage() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [inputs, setInputs] = useState({});

  const load = async () => {
    try {
      const r1 = await api.getCategories();
      const r2 = await api.getBudgets(month);

      const cats = r1.data || [];
      const buds = r2.data || [];

      setCategories(cats);
      setBudgets(buds);

      const initInputs = {};
      cats.forEach(c => {
        const b = buds.find(budget => budget.category?._id === c._id);
        initInputs[c._id] = b ? b.limit : '';
      });
      setInputs(initInputs);

    } catch (err) {
      console.error("Error loading budgets page:", err);
      Swal.fire('Error', 'Failed to load budgets', 'error');
      setCategories([]);
      setBudgets([]);
      setInputs({});
    }
  };

  useEffect(() => { load(); }, [month]);

  const saveBudget = async (catId) => {
    const value = Number(inputs[catId]);
    if (isNaN(value) || value < 0) {
      Swal.fire('Validation', 'Budget must be a non-negative number', 'warning');
      return;
    }

    try {
      const payload = { category: catId, month, limit: value };
      await api.upsertBudget(payload);
      Swal.fire('Saved', 'Budget saved successfully ✅', 'success');
      load();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save budget ❌', 'error');
    }
  };

  const remove = async (id, catId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the budget for this category',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.deleteBudget(id);
        Swal.fire('Deleted', 'Budget removed ❌', 'success');
        load();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to remove budget ❌', 'error');
      }
    }
  };

  const budgetFor = (catId) => budgets.find(b => b?.category?._id === catId) || null;

  return (
    <div className="budgets-page">
      <h2>Budgets</h2>

      <div className="month-selector">
        <label>Month</label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      </div>

      <div className="budget-list">
        {categories.map(c => {
          const b = budgetFor(c._id);
          return (
            <div key={c._id} className="budget-row">
              <div className="budget-color" style={{ background: c.color }} />
              <div className="budget-name">{c.name}</div>

              <input 
                type="number" 
                className="budget-input"
                value={inputs[c._id] || ''} 
                onChange={e => setInputs(prev => ({ ...prev, [c._id]: e.target.value }))} 
              />

              <div className="budget-actions">
                <button onClick={() => saveBudget(c._id)}>Save</button>
                {b && <button onClick={() => remove(b._id, c._id)}>Delete</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
