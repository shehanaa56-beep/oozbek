import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
      {/* Sidebar - Fixed width */}
      <Sidebar />
      
      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', padding: '1rem 1rem 1rem 0' }}>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#fff', 
          borderRadius: 'var(--radius-2xl)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}>
          <Header />
          
          {/* Scrollable page content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2.5rem' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
