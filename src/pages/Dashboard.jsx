import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ExpenseForm from '../components/ExpenseForm';
import CategoryCard from '../components/CategoryCard';
import dayjs from 'dayjs';
import './Dashboard.css'; 

export default function Dashboard({ openExpense, setOpenExpense }) {

  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState([]);
  const [refresh, setRefresh] = useState(0);

  
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const load = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats.data || []);

      const b = await api.getBudgets(month);
      setBudgets(b.data || []);

      const from = `${month}-01`;
      const to = dayjs(from).endOf("month").format("YYYY-MM-DD");
      const exps = await api.getExpenses({ from, to });
      setExpenses(exps.data || []);

      const r = await api.monthlyReport(month);
      const data = (r.data?.data || []).map(item => {
        const category = item.category || { name: "Unknown" };
        const spent = Number(item.spent ?? 0);
        const limit = item.limit != null ? Number(item.limit) : null;
        const remaining = limit != null ? limit - spent : null;
        return { ...item, category, spent, limit, remaining };
      });
      setReport(data);

    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  useEffect(() => { load(); }, [month, refresh]);

  const getBudgetFor = (catId) =>
    budgets.find(b => b?.category?._id === catId) || null;

  
  const totals = report.reduce((acc, r) => {
    acc.spent += r.spent;
    acc.budget += r.limit != null ? r.limit : 0;
    acc.remaining += r.remaining != null ? r.remaining : 0;
    return acc;
  }, { spent: 0, budget: 0, remaining: 0 });

  
  let filtered = [...categories];

  if (search)
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

  if (filterCat !== "all")
    filtered = filtered.filter(c => c._id === filterCat);

  filtered = filtered.map(c => {
    const rep = report.find(r => r.category._id === c._id);
    return {
      ...c,
      spent: rep?.spent || 0,
      limit: rep?.limit || 0,
      remaining: rep?.remaining || 0
    };
  });

  if (sortBy === "highSpent")
    filtered.sort((a, b) => b.spent - a.spent);

  if (sortBy === "lowSpent")
    filtered.sort((a, b) => a.spent - b.spent);

  if (sortBy === "remaining")
    filtered.sort((a, b) => b.remaining - a.remaining);

  if (sortBy === "az")
    filtered.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const handler = () => setRefresh(r => r + 1);
    window.addEventListener("expense-added", handler);
    return () => window.removeEventListener("expense-added", handler);
  }, []);

  return (
    <div className="dashboard-container">
         <div className="dashboard-header">
    <h1>Dashboard</h1>
  </div>

      
      <div className="summary-cards">
        <div className="dash-card blue">
          <h3>Total Spent</h3>
          <h2>₹{totals.spent}</h2>
        </div>

        <div className="dash-card orange">
          <h3>Total Budget</h3>
          <h2>₹{totals.budget}</h2>
        </div>

        <div
          className="dash-card"
          style={{ background: totals.remaining < 0 ? "#ffebee" : "#e8f5e9" }}
        >
          <h3>Total Remaining</h3>
          <h2>
            ₹{totals.remaining} {totals.remaining < 0 ? "⚠️ Over Budget" : ""}
          </h2>
        </div>
      </div>

      
      <div className="quick-stats">
        <div className="chip">Total Categories: {categories.length}</div>
        <div className="chip">Expenses This Month: {expenses.length}</div>
      </div>

      
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Sort By</option>
          <option value="highSpent">Highest Spent</option>
          <option value="lowSpent">Lowest Spent</option>
          <option value="remaining">Highest Remaining</option>
          <option value="az">A - Z</option>
        </select>

        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
      </div>

      
      <div className="category-grid">
        {filtered.map(cat => (
          <CategoryCard
            key={cat._id}
            category={cat}
            budget={getBudgetFor(cat._id)}
            month={month}
            refresh={refresh}
          />
        ))}
      </div>

      {openExpense && (
        <ExpenseForm
          month={month}
          onClose={() => setOpenExpense(false)}
          onSuccess={() => setRefresh(r => r + 1)}
        />
      )}
    </div>
  );
}
