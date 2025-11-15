import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import dayjs from 'dayjs';
import './BudgetPage.css';

export default function BudgetsPage() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [inputs, setInputs] = useState({});
  const [msg, setMsg] = useState({});

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
      setCategories([]);
      setBudgets([]);
      setInputs({});
    }
  };

  useEffect(() => { load(); }, [month]);

  const saveBudget = async (catId) => {
    try {
      const value = Number(inputs[catId] || 0);
      const payload = { category: catId, month, limit: value };
      await api.upsertBudget(payload);
      setMsg(prev => ({ ...prev, [catId]: 'Budget saved ✅' }));
      load();
    } catch (err) {
      console.error(err);
      setMsg(prev => ({ ...prev, [catId]: 'Error saving budget ❌' }));
    }
  };

  const remove = async (id, catId) => { 
    try {
      await api.deleteBudget(id); 
      setMsg(prev => ({ ...prev, [catId]: 'Budget removed ❌' }));
      load(); 
    } catch (err) {
      console.error(err);
      setMsg(prev => ({ ...prev, [catId]: 'Error removing budget ❌' }));
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

      <div>
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

              {msg[c._id] && (
                <span className={`budget-msg ${msg[c._id].includes('❌') ? 'error' : 'success'}`}>
                  {msg[c._id]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
