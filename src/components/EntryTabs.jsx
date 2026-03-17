import { NavLink } from 'react-router-dom';

export default function EntryTabs() {
  const tabs = [
    { name: 'Income Entry', path: '/income' },
    { name: 'Expense Entry', path: '/expense' },
    { name: 'Leave Entry', path: '/leave' },
  ];

  return (
    <div style={{
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: '4px',
      borderRadius: '12px',
      marginBottom: '20px',
      gap: '4px'
    }}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          style={({ isActive }) => ({
            flex: 1,
            textAlign: 'center',
            padding: '10px 0',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            color: isActive ? '#fff' : 'var(--mobile-text-dim)',
            backgroundColor: isActive ? 'var(--mobile-card-bg)' : 'transparent',
            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease'
          })}
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
}
