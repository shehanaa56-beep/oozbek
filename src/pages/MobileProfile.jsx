import { useAuth } from '../context/AuthContext';
import { LogOut, User, Lock, Eye } from 'lucide-react';

export default function MobileProfile() {
  const { logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
      <button 
        onClick={logout}
        style={{ 
          alignSelf: 'flex-end', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '4px',
          color: 'var(--mobile-text-dim)',
          marginBottom: '30px'
        }}
      >
        <LogOut size={20} />
        <span style={{ fontSize: '10px' }}>Logout</span>
      </button>

      {/* Avatar Section */}
      <div style={{ 
        width: '120px', 
        height: '120px', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.05)'
      }}>
         <img src="/ooz.PNG" alt="Profile" style={{ width: '80%', height: 'auto' }} />
      </div>

      <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '40px' }}>Profile</h1>

      {/* Form Section */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Change Username & Password</h2>
        
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--mobile-text-dim)'
          }}>
            <User size={18} />
          </div>
          <input 
            defaultValue="Faez@gmail.com" 
            style={profileInputStyle}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--mobile-text-dim)'
          }}>
            <Lock size={18} />
          </div>
          <input 
            type="password"
            defaultValue="password" 
            style={profileInputStyle}
          />
          <div style={{ 
            position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--mobile-text-dim)'
          }}>
            <Eye size={18} />
          </div>
        </div>

        <button style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '15px',
          marginTop: '10px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          Update
        </button>
      </div>
    </div>
  );
}

const profileInputStyle = {
  width: '100%',
  backgroundColor: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '18px 18px 18px 45px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none'
};
