import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function CategoryCard({ category, budget, month, refresh }) {
  const [stats, setStats] = useState({
    spent: 0,
    limit: budget ? budget.limit : null
  });

  useEffect(() => {
    async function load() {
      try {
        // Always load monthly report
        const rep = await api.monthlyReport(month);

        const row = rep.data.data.find(r => r.category._id === category._id);

        if (row) {
          setStats({
            spent: row.spent,
            limit: row.limit // may be null if no budget
          });
        } else {
          setStats({
            spent: 0,
            limit: budget ? budget.limit : null
          });
        }

      } catch (err) {
        setStats({
          spent: 0,
          limit: budget ? budget.limit : null
        });
      }
    }

    load();
  }, [category, budget, month, refresh]);

  const percent = stats.limit
    ? Math.min(100, Math.round((stats.spent / stats.limit) * 100))
    : 0;

  const remaining =
    stats.limit == null ? null : stats.limit - stats.spent;

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><strong>{category.name}</strong></div>
        <div style={{ width: 18, height: 18, background: category.color, borderRadius: 4 }} />
      </div>

      <div style={{ height: 10, background: '#f0f0f0', marginTop: 12, borderRadius: 6 }}>
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: percent > 100 ? 'red' : '#1976d2',
            borderRadius: 6
          }}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        {stats.limit == null ? (
          <small>Spent: {stats.spent}</small>
        ) : (
          <div>
            Spent: {stats.spent} / {stats.limit} |
            Remaining:{' '}
            {remaining < 0
              ? <span style={{ color: 'red' }}>OVER {Math.abs(remaining)}</span>
              : remaining}
          </div>
        )}
      </div>
    </div>
  );
}
