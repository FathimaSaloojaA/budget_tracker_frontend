import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import dayjs from 'dayjs';

export default function BudgetsPage(){
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const load = async () => {
    try {
      const r1 = await api.getCategories(); 
      setCategories(r1.data || []);
      const r2 = await api.getBudgets(month); 
      setBudgets(r2.data || []);
    } catch (err) {
      console.error("Error loading budgets page:", err);
      setCategories([]);
      setBudgets([]);
    }
  }

  useEffect(()=>{ load(); }, [month]);

  // SAFE budgetFor
  const budgetFor = (catId) => budgets.find(b => b?.category?._id === catId) || null;

  const setLimit = async (catId, value) => {
    const payload = { category: catId, month, limit: Number(value || 0) };
    await api.upsertBudget(payload);
    load();
  }

  const remove = async (id) => { 
    await api.deleteBudget(id); 
    load(); 
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Budgets</h2>
      <div>
        <label>Month</label>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        {categories.map(c => {
          const b = budgetFor(c._id);
          return (
            <div key={c._id} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
              <div style={{ width:12, height:12, background: c.color }} />
              <div style={{ flex:1 }}>{c.name}</div>
              <input 
                type="number" 
                value={b ? b.limit : ''} 
                onChange={e=>setLimit(c._id, e.target.value)} 
              />
              {b && <button onClick={()=>remove(b._id)}>Delete</button>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
