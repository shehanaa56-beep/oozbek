import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ShieldCheck } from 'lucide-react';

export default function MobileLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate('/m/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--mobile-bg)', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '40px 30px'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button 
          onClick={() => navigate('/admin/login')}
          style={{ 
            position: 'absolute', 
            top: '0px', 
            right: '0px',
            color: 'rgba(255, 255, 255, 0.4)',
            padding: '10px'
          }}
          title="Admin Login"
        >
          <ShieldCheck size={20} />
        </button>
        <img src="/ooz.PNG" alt="Oozbek Logo" style={{ width: '220px', marginBottom: '60px' }} />
        
        <div style={{ width: '100%', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>LOGIN</h1>
          <p style={{ fontSize: '13px', color: 'var(--mobile-text-dim)' }}>Let's Get Started</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-green)' }}>
              <User size={18} />
            </div>
            <input 
              placeholder="Enter Username" 
              style={loginInputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-green)' }}>
              <Lock size={18} />
            </div>
            <input 
              type="password"
              placeholder="Enter Password" 
              style={loginInputStyle}
            />
          </div>

          <button type="submit" style={{
            background: 'linear-gradient(to right, #82CD00, #A5E400)',
            color: '#fff',
            padding: '18px',
            borderRadius: '15px',
            fontWeight: 800,
            fontSize: '15px',
            marginTop: '20px',
            border: 'none',
            boxShadow: '0 10px 20px rgba(130, 205, 0, 0.2)'
          }}>
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
}

const loginInputStyle = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '15px',
  padding: '18px 18px 18px 45px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none'
};
