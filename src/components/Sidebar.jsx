import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Database, FileText, UserCircle, LogOut, Archive, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { 
    name: 'Data Entry', 
    icon: Database,
    subItems: [
      { name: 'Income Entry', path: '/income' },
      { name: 'Expense Entry', path: '/expense' },
      { name: 'Leave Entry', path: '/leave' }
    ]
  },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Reports Archive', path: '/reports-archive', icon: Archive, adminOnly: true },
  { name: 'User Management', path: '/user-management', icon: Users, adminOnly: true },
  { name: 'Profile', path: '/profile', icon: UserCircle },
];

export default function Sidebar() {
  const { logout, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [dataEntryExpanded, setDataEntryExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'var(--color-bg-light)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5rem 1.5rem',
      height: '100vh',
      transition: 'var(--transition-normal)',
      borderRight: '1px solid rgba(0,0,0,0.03)',
      position: 'sticky',
      top: 0
    }}>
      {/* Logo Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '3.5rem', paddingLeft: '0.5rem' }}>
        <div style={{ 
          width: '52px', 
          height: '52px', 
          borderRadius: '50%', 
          backgroundColor: user?.photoURL ? 'transparent' : '#0A262C', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: user?.photoURL ? '0' : '6px',
          border: '2px solid #fff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src="/ooz.PNG" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>Oozbek</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-main)' }}>{isSuperAdmin ? 'Admin' : 'Operator'}</span>
        </div>
      </div>

      {/* Navigation Links - Scrollable Area */}
      <nav style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.65rem',
        overflowY: 'auto',
        paddingRight: '0.5rem',
        marginRight: '-0.5rem',
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none'    /* Firefox */
      }}>
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {navItems.filter(item => !item.adminOnly || isSuperAdmin).map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <>
                <div 
                  onClick={() => setDataEntryExpanded(!dataEntryExpanded)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.875rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'var(--transition-normal)',
                    backgroundColor: dataEntryExpanded ? 'var(--color-primary-dark)' : 'transparent',
                    color: dataEntryExpanded ? '#fff' : 'var(--color-text-main)',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    boxShadow: dataEntryExpanded ? '0 10px 20px rgba(10, 38, 44, 0.15)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!dataEntryExpanded) {
                      e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!dataEntryExpanded) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <item.icon size={22} strokeWidth={2.5} />
                    <span style={{ fontSize: '1rem' }}>{item.name}</span>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    transform: dataEntryExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease'
                  }}>▼</span>
                </div>
                
                {dataEntryExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.5rem' }}>
                    {item.subItems.map(subItem => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1.25rem',
                          borderRadius: 'var(--radius-lg)',
                          color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                          fontWeight: isActive ? 700 : 500,
                          backgroundColor: isActive ? 'rgba(0,0,0,0.03)' : 'transparent',
                          transition: 'all 0.2s ease',
                          fontSize: '0.95rem',
                          textDecoration: 'none'
                        })}
                      >
                        {({ isActive }) => (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                               <span style={{ 
                                 width: isActive ? '4px' : '0px', 
                                 height: '18px', 
                                 backgroundColor: 'var(--color-primary-dark)', 
                                 borderRadius: '4px',
                                 transition: 'all 0.2s'
                               }}></span>
                               {subItem.name}
                            </div>
                            <span style={{ fontSize: '12px' }}>›</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.875rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  color: isActive ? '#fff' : 'var(--color-text-main)',
                  backgroundColor: isActive ? 'var(--color-primary-dark)' : 'transparent',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'var(--transition-normal)',
                  textDecoration: 'none',
                  boxShadow: isActive ? '0 10px 20px rgba(10, 38, 44, 0.15)' : 'none',
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <item.icon size={22} strokeWidth={2.5} />
                {item.name}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button - Pinned at bottom */}
      <div style={{ paddingTop: '1.5rem', marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--color-primary-dark)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700,
            fontSize: '1rem',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(10, 38, 44, 0.2)',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}
