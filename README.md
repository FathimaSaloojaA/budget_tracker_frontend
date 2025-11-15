# Budget Tracker - Frontend

This is the **frontend** of the Budget Tracker app built using **React (Vite)**.  
It communicates with a backend API to manage expenses, budgets, and reports.

---

## 🌐 Live Demo

You can access the live app here:  
**Frontend (Website):** [budget-tracker-frontend-rosy.vercel.app](https://your-frontend-live-url.com)  
**Backend (API):** [https://budget-tracker-backend-rroy.onrender.com/api](https://your-backend-live-url.com/api)

---

## 🛠 Technologies Used

- React (Vite)
- JavaScript (ES6+)
- Axios for API requests
- dayjs for date management
- Recharts for dashboard and reports
- CSS / inline styles for layout
- Responsive design

---

## 📦 Getting Started Locally

Follow these steps to run the frontend locally:

### 1. Clone the repository
```bash
git clone https://github.com/FathimaSaloojaA/budget_tracker_frontend
cd frontend-repo

### 2. Install dependencies
npm install

### 3. Create environment variables

Create a .env file in the root of the frontend project:




Replace with your backend URL if using a deployed backend.

4. Start the development server
npm run dev


The app will run at http://localhost:5173 by default.

⚡ Features

Add, edit, and delete expenses

Set budgets per category and month

Dashboard with summary and category cards

Monthly reports with interactive charts

Search, filter, and sort categories

Export reports as CSV


mobile responsiveness and UI

 authentication (login/signup)

Notifications for over-budget categories



Optimize API requests and caching

📂 Project Structure
frontend/
├─ src/
│  ├─ api/        # Axios API calls
│  ├─ components/ # React components (ExpenseForm, CategoryCard, etc.)
│  ├─ pages/      # Pages (Dashboard, Reports, Budgets)
│  ├─ App.jsx
│  └─ main.jsx
├─ public/        # Static assets (favicon, images)
├─ .env           # Environment variables
├─ index.html
└─ package.json

📌 Notes

Make sure the backend API is running before using the frontend locally.

Update VITE_API_BASE in .env if using a live backend.