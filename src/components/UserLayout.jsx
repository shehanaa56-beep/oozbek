import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MobileBottomNav from './MobileBottomNav';

export default function UserLayout() {
  const { isAuthenticated } = useAuth();

  // If not logged in, redirect to login (mobile version)
  if (!isAuthenticated) {
    return <Navigate to="/m/login" replace />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--mobile-bg)', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '75px' // Space for bottom nav
    }}>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}
