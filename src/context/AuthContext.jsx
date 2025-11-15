
// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const u = localStorage.getItem('user');
//     return u ? JSON.parse(u) : null;
//   });

//   useEffect(() => {
//     if (user) localStorage.setItem('user', JSON.stringify(user));
//     else localStorage.removeItem('user');
//   }, [user]);

//   // Multi-tab logout sync
//   useEffect(() => {
//     const handleStorage = (e) => {
//       if (e.key === 'logout') {
//         setUser(null);
//         window.location.href = '/login'; // redirect
//       }
//     };
//     window.addEventListener('storage', handleStorage);
//     return () => window.removeEventListener('storage', handleStorage);
//   }, []);

//   const login = ({ token, user }) => {
//     localStorage.setItem('token', token);
//     setUser(user);
//   };


// const logout = (navigate) => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   localStorage.setItem('logout', Date.now());
//   setUser(null);
//   if (navigate) navigate('/auth'); // SPA routing
//   else window.location.href = '/auth'; // fallback
// };


//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  // Save/remove user in localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Multi-tab logout sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'logout') {
        setUser(null);
        window.location.reload(); // fallback for other tabs
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('logout', Date.now());
    setUser(null);

    if (navigate) navigate('/auth'); // SPA routing
    else window.location.reload();    // fallback
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
