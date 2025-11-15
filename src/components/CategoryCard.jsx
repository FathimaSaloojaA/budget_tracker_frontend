// import React, { useEffect, useState } from 'react';
// import api from '../api/api';
// import './CategoryCard.css';

// export default function CategoryCard({ category, budget, month, refresh }) {
//   const [stats, setStats] = useState({
//     spent: 0,
//     limit: budget ? budget.limit : null
//   });

//   useEffect(() => {
//     async function load() {
//       try {
//         const rep = await api.monthlyReport(month);
//         const row = rep.data.data.find(r => r.category._id === category._id);

//         if (row) {
//           setStats({
//             spent: row.spent,
//             limit: row.limit
//           });
//         } else {
//           setStats({
//             spent: 0,
//             limit: budget ? budget.limit : null
//           });
//         }
//       } catch (err) {
//         setStats({
//           spent: 0,
//           limit: budget ? budget.limit : null
//         });
//       }
//     }

//     load();
//   }, [category, budget, month, refresh]);

//   const percent = stats.limit
//     ? Math.min(100, Math.round((stats.spent / stats.limit) * 100))
//     : 0;

//   const remaining =
//     stats.limit == null ? null : stats.limit - stats.spent;

//   return (
//     <div className="category-card">
//       <div className="category-header">
//         <strong>{category.name}</strong>
//         <div className="category-color" style={{ background: category.color || '#5dade2' }} />
//       </div>

//       <div className="progress-bar">
//         <div
//           className={`progress-fill ${percent > 100 ? 'over-budget' : ''}`}
//           style={{ width: `${percent}%` }}
//         />
//       </div>

//       <div className="category-stats">
//         {stats.limit == null ? (
//           <small>Spent: ₹{stats.spent}</small>
//         ) : (
//           <div>
//             Spent: ₹{stats.spent} / ₹{stats.limit} | 
//             Remaining: {remaining < 0 ? (
//               <span className="over-budget">OVER ₹{Math.abs(remaining)}</span>
//             ) : `₹${remaining}`}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './CategoryCard.css';

export default function CategoryCard({ category, budget, month, refresh }) {
  const [stats, setStats] = useState({
    spent: 0,
    limit: budget ? budget.limit : null
  });

  useEffect(() => {
    async function load() {
      try {
        const rep = await api.monthlyReport(month);
        const row = rep.data.data.find(r => r.category._id === category._id);

        if (row) {
          setStats({
            spent: row.spent,
            limit: row.limit
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
    ? Math.round((stats.spent / stats.limit) * 100)
    : 0;

  const remaining = stats.limit == null ? null : stats.limit - stats.spent;

  return (
    <div className="category-card">
      {/* Header */}
      <div className="category-header">
        <strong>{category.name}</strong>
        <div
          className="category-color"
          style={{ background: category.color || '#5dade2' }}
        />
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className={`progress-fill ${percent > 100 ? 'over-budget' : ''}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
        {percent > 100 && (
          <div
            className="overflow-indicator"
            style={{ width: `${percent - 100}%` }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="category-stats">
        {stats.limit == null ? (
          <small>Spent: ₹{stats.spent}</small>
        ) : (
          <div>
            Spent: ₹{stats.spent} / ₹{stats.limit} |{' '}
            Remaining:{' '}
            {remaining < 0 ? (
              <span className="over-budget">
                OVER ₹{Math.abs(remaining)}
              </span>
            ) : `₹${remaining}`}
          </div>
        )}
      </div>
    </div>
  );
}
