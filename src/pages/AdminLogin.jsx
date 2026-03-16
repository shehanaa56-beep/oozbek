import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, User, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success && result.isAdmin) {
      navigate('/user-management');
    } else {
      setError(result.message || "Unauthorized access attempt.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0k',
      background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: '3.5rem',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          backgroundColor: 'rgba(130, 205, 0, 0.1)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          color: 'var(--color-primary-green)'
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Access</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontWeight: 500 }}>Super Admin Authentication Required</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#fb7185', fontSize: '0.85rem', fontWeight: 600 }}>{error}</p>}

          <button
            type="submit"
            style={{
              backgroundColor: 'var(--color-primary-green)',
              color: '#000',
              padding: '1.125rem',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 800,
              marginTop: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s'
            }}
          >
            Authenticate <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '1.125rem 1.125rem 1.125rem 3.5rem',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};
