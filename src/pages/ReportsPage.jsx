import React, { useEffect, useState } from 'react';
import api from '../api/api';
import dayjs from 'dayjs';

export default function ReportsPage(){
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [report, setReport] = useState(null);

  const load = async () => {
    const r = await api.monthlyReport(month);
    setReport(r.data);
  }

  useEffect(()=>{ load(); }, [month]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Reports</h2>
      <div>
        <label>Month</label>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
        <button onClick={load}>Load</button>
      </div>

      {report && (
        <table style={{ width: '100%', marginTop: 12 }}>
          <thead>
            <tr><th>Category</th><th>Spent</th><th>Budget</th><th>Remaining</th></tr>
          </thead>
          <tbody>
            {report.data.map(row => (
              <tr key={row.category._id}>
                <td>{row.category.name}</td>
                <td>{row.spent}</td>
                <td>{row.limit ?? '-'}</td>
                <td style={{ color: (row.remaining != null && row.remaining < 0) ? 'red' : 'inherit' }}>{row.remaining ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
