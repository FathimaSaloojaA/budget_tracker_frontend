import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ExpenseForm from '../components/ExpenseForm';
import CategoryCard from '../components/CategoryCard';
import dayjs from 'dayjs';

export default function Dashboard({ openExpense, setOpenExpense }) {
  const [month, setMonth] = useState(() => dayjs().format('YYYY-MM'));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [refresh, setRefresh] = useState(0);   // <--- NEW

  const load = async () => {
    const cats = await api.getCategories();
    setCategories(cats.data);

    const b = await api.getBudgets(month);
    setBudgets(b.data);
  };

  useEffect(() => { load(); }, [month]);

  const getBudgetFor = (catId) =>
    budgets.find(b => b.category._id === catId) || null;

  return (
    <div style={{ padding: 20 }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Dashboard - {dayjs(month + '-01').format('MMMM YYYY')}</h2>

        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
        gap: 12,
        marginTop: 16
      }}>
        {categories.map(cat => {
          const b = getBudgetFor(cat._id);
          return (
            <CategoryCard
              key={cat._id}
              category={cat}
              budget={b}
              month={month}
              refresh={refresh}   // <--- NEW
            />
          );
        })}
      </div>

      {openExpense && (
        <ExpenseForm
          month={month}
          onClose={() => {
            setOpenExpense(false);
            load();
            setRefresh(r => r + 1);  // <--- TRIGGERS RELOAD IN CARDS
          }}
        />
      )}
    </div>
  );
}
