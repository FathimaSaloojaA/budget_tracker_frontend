import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const instance = axios.create({ baseURL: API_BASE });

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  // auth
  register: (data) => instance.post('/auth/register', data),
  login: (data) => instance.post('/auth/login', data),
  // categories
  getCategories: () => instance.get('/categories'),
  createCategory: (data) => instance.post('/categories', data),
  updateCategory: (id, data) => instance.put(`/categories/${id}`, data),
  deleteCategory: (id) => instance.delete(`/categories/${id}`),
  // budgets
  getBudgets: (month) => instance.get(`/budgets?month=${month}`),
  upsertBudget: (data) => instance.post('/budgets', data),
  deleteBudget: (id) => instance.delete(`/budgets/${id}`),
  // expenses
  getExpenses: (params) => instance.get('/expenses', { params }),
  listExpenses: () => instance.get('/expenses'),
  createExpense: (data) => instance.post('/expenses', data),
  // reports
 monthlyReport: (month) => instance.get(`/report/monthly?month=${month}`)

}
