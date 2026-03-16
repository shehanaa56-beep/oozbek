import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isMobile) {
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

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-bg-light)',
      overflow: 'hidden'
    }}>
      {/* Sidebar - Fixed width */}
      <Sidebar />
      
      {/* Main Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        overflow: 'hidden', 
        padding: '1rem 1rem 1rem 0',
        backgroundColor: 'var(--color-bg-light)'
      }}>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#fff', 
          borderRadius: 'var(--radius-2xl)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.02)',
          position: 'relative'
        }}>
          <Header />
          
          {/* Scrollable page content with max-width container */}
          <main style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '1280px', // Perfect width for laptop screens
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
