import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import MainLayout from './components/MainLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncomeEntry from './pages/IncomeEntry';
import ExpenseEntry from './pages/ExpenseEntry';
import LeaveEntry from './pages/LeaveEntry';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import UserManagement from './pages/UserManagement';
import AdminReports from './pages/AdminReports';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  if (!isAuthenticated || !isSuperAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function App() {
  return (
    <SearchProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="income" element={<IncomeEntry />} />
              <Route path="expense" element={<ExpenseEntry />} />
              <Route path="leave" element={<LeaveEntry />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route 
                path="user-management" 
                element={
                  <ProtectedAdminRoute>
                    <UserManagement />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="reports-archive" 
                element={
                  <ProtectedAdminRoute>
                    <AdminReports />
                  </ProtectedAdminRoute>
                } 
              />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SearchProvider>
  );
}

export default App;
