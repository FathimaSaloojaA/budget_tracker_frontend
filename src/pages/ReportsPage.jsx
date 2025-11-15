import React, { useEffect, useState } from 'react';
import api from '../api/api';
import dayjs from 'dayjs';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import './ReportsPage.css';

export default function ReportsPage() {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const r = await api.monthlyReport(month);
      const data = (r.data?.data || []).map(item => {
        const category = item.category || { _id: `cat-${Math.random()}`, name: 'Unknown' };
        const spent = Number(item.spent ?? 0);
        const limit = item.limit != null ? Number(item.limit) : null;
        const remaining = limit != null ? limit - spent : null;
        return { ...item, category, spent, limit, remaining };
      });
      setReport(data);
    } catch (err) {
      console.error(err);
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("expense-added", handler);
    return () => window.removeEventListener("expense-added", handler);
  }, [month]);

  const totals = report.reduce((acc, r) => {
    acc.spent += r.spent;
    acc.budget += r.limit != null ? r.limit : 0;
    acc.remaining += r.remaining != null ? r.remaining : 0;
    return acc;
  }, { spent: 0, budget: 0, remaining: 0 });

  const downloadCSV = () => {
    const rows = [
      ['Category', 'Spent', 'Budget', 'Remaining'],
      ...report.map(r => [r.category.name, r.spent, r.limit ?? '-', r.remaining ?? '-'])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip-card">
          <strong>{data.category.name}</strong>
          <div>Spent: ₹{data.spent}</div>
          <div>Budget: ₹{data.limit ?? '-'}</div>
          <div className={data.remaining != null && data.remaining < 0 ? 'over-budget' : 'within-budget'}>
            Remaining: {data.remaining != null ? data.remaining : '-'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="reports-page">
      <h2>Monthly Reports</h2>

      <div className="reports-controls">
        <label>Month:</label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
        <button onClick={load} className="btn-primary">Load</button>
        <button onClick={downloadCSV} className="btn-secondary" disabled={report.length === 0}>Export CSV</button>
      </div>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="card spent">
          <div>Total Spent</div>
          <div>₹{totals.spent}</div>
        </div>
        <div className="card budget">
          <div>Total Budget</div>
          <div>₹{totals.budget}</div>
        </div>
        <div className={`card remaining ${totals.remaining < 0 ? 'over' : ''}`}>
          <div>Total Remaining</div>
          <div>₹{totals.remaining} {totals.remaining < 0 ? '⚠️ Over budget' : ''}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="chart-container">
        <ResponsiveContainer minHeight={300}>
          <BarChart data={report}>
            <XAxis dataKey="category.name" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="spent" name="Spent" radius={[6,6,0,0]}>
              {report.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.limit != null && entry.spent > entry.limit ? '#e74c3c' : '#1976d2'} />
              ))}
              <LabelList
                dataKey="remaining"
                position="top"
                formatter={(value) =>
                  value < 0 ? `Over ₹${Math.abs(value)}` : value ? `Remaining ₹${value}` : ''
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      {!loading && report.length > 0 && (
        <table className="report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Spent</th>
              <th>Budget</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {report.map(r => (
              <tr key={r.category._id}>
                <td>{r.category.name}</td>
                <td>₹{r.spent}</td>
                <td>₹{r.limit ?? '-'}</td>
                <td className={r.remaining != null && r.remaining < 0 ? 'over-budget' : ''}>
                  {r.remaining != null ? `₹${r.remaining}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && report.length === 0 && <p className="no-data">No data for this month.</p>}
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}
