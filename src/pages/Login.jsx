import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-primary-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1100px',
        minHeight: '650px',
        backgroundColor: 'transparent',
        alignItems: 'center',
        gap: '4rem'
      }}>
        {/* Left Side - Logo Area */}
        <div style={{
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <img src="/ooz.PNG" alt="Oozbek Logo" style={{ width: '100%', maxWidth: '480px', height: 'auto', filter: 'brightness(1.2)' }} />
        </div>

        {/* Right Side - Form Card */}
        <div style={{
          flex: 0.8,
          backgroundColor: '#E5E7EB', // matching the gray card in screenshot
          borderRadius: '30px',
          padding: '4rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 800, letterSpacing: '2px', marginBottom: '4rem' }}>WELCOME</h1>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 700, marginBottom: '0.25rem' }}>LOGIN</h2>
              <p style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>Let's Get Started</p>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
               <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-green)' }} />
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1rem 1.25rem 3rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: 'transparent',
                      fontSize: '1rem',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                  />
            </div>
            
            <div style={{ position: 'relative' }}>
               <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-green)' }} />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1rem 1.25rem 3rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: 'transparent',
                      fontSize: '1rem',
                      fontWeight: 500,
                      outline: 'none'
                    }}
                  />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1.125rem',
                backgroundColor: 'var(--color-primary-green)',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                fontWeight: 700,
                marginTop: '1.5rem',
                transition: 'all 0.2s',
                border: 'none',
                boxShadow: '0 4px 14px rgba(130, 205, 0, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Proceed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
