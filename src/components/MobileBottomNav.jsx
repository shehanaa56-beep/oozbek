import { NavLink } from 'react-router-dom';
import { Home, Database, FileText, User } from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { name: 'Home', path: '/m/dashboard', icon: Home },
    { name: 'Data Entry', path: '/m/data-entry', icon: Database },
    { name: 'Report', path: '/m/reports', icon: FileText },
    { name: 'Profile', path: '/m/profile', icon: User },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '75px',
      backgroundColor: 'var(--mobile-nav-bg)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      zIndex: 1000,
      padding: '0 10px'
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-primary-green)' : 'var(--mobile-text-dim)',
            transition: 'all 0.2s ease',
            flex: 1
          })}
        >
          {({ isActive }) => (
            <>
              <div style={{
                padding: '6px',
                borderRadius: '12px',
                backgroundColor: isActive ? 'rgba(130, 205, 0, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500 }}>{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
