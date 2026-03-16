import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';

// Mock components for pages
function MockPage({ title }) {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{title}</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>Page content placeholder.</p>
    </div>
  );
}

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncomeEntry from './pages/IncomeEntry';
import ExpenseEntry from './pages/ExpenseEntry';
import LeaveEntry from './pages/LeaveEntry';
import Reports from './pages/Reports';
import Profile from './pages/Profile';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="income" element={<IncomeEntry />} />
            <Route path="expense" element={<ExpenseEntry />} />
            <Route path="leave" element={<LeaveEntry />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
