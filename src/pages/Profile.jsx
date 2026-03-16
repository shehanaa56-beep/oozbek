import { User, Lock, Eye } from 'lucide-react';

export default function Profile() {
  return (
    <div>
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Profile Update</h1>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '480px', margin: '0 auto' }}>
        
        {/* Avatar Area */}
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          backgroundColor: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '3.5rem',
          position: 'relative',
          border: '4px solid #fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
        }}>
           <User size={80} color="#D1D5DB" />
           <div style={{
             position: 'absolute',
             bottom: '5px',
             right: '5px',
             backgroundColor: 'var(--color-primary-green)',
             width: '32px',
             height: '32px',
             borderRadius: '50%',
             border: '3px solid #fff',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <div style={{ width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
           </div>
        </div>

        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Email/Username Input */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: '1.25rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--color-primary-green)'
            }}>
              <User size={20} />
            </div>
            <input
              type="text"
              defaultValue="Faez@gmail.com"
              style={{
                width: '100%',
                padding: '1.125rem 1rem 1.125rem 3.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid #E5E7EB',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                outline: 'none',
                fontWeight: 700,
                color: 'var(--color-primary-dark)'
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: '1.25rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--color-primary-green)'
            }}>
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder="Password"
              style={{
                width: '100%',
                padding: '1.125rem 3.5rem 1.125rem 3.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid #E5E7EB',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                outline: 'none',
                fontWeight: 700,
                color: 'var(--color-primary-dark)'
              }}
            />
            <div style={{ 
              position: 'absolute', 
              right: '1.25rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}>
              <Eye size={20} />
            </div>
          </div>

          {/* Update Button */}
          <button
            type="button"
            style={{
              backgroundColor: 'var(--color-primary-dark)',
              color: '#fff',
              padding: '1.125rem',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1.1rem',
              fontWeight: 800,
              marginTop: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(10, 38, 44, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Update
          </button>
        </form>

      </div>
    </div>
  );
}
