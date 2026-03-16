import { useNavigate } from 'react-router-dom';
import { Search, User, Contact } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header style={{
      height: '70px',
      padding: '0 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '300px' }}>
        <input 
          type="text" 
          placeholder="Search here" 
          style={{
            width: '100%',
            padding: '0.65rem 1rem 0.65rem 2.75rem',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            backgroundColor: 'var(--color-bg-light)',
            fontSize: '0.875rem',
            outline: 'none',
            color: 'var(--color-text-main)'
          }}
        />
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)' 
          }} 
        />
      </div>

      {/* User Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div 
          onClick={() => navigate('/admin-login')}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-bg-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-light)'}
        >
          <Contact size={20} />
        </div>

        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-main)',
          cursor: 'pointer',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
