import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const isDesktop = windowWidth > 1024;
  const isMobile = windowWidth <= 768;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isMobile ? 'var(--mobile-bg)' : 'var(--color-primary-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isDesktop ? '0' : '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(130, 205, 0, 0.1) 0%, transparent 70%)',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(130, 205, 0, 0.05) 0%, transparent 70%)',
            zIndex: 0
          }}></div>
        </>
      )}

      <div style={{
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        width: '100%',
        maxWidth: isDesktop ? '1100px' : '480px',
        minHeight: isDesktop ? '650px' : 'auto',
        backgroundColor: isDesktop ? 'rgba(255, 255, 255, 0.03)' : (isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.03)'),
        borderRadius: '40px',
        border: (isDesktop || !isMobile) ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        backdropFilter: (isDesktop || !isMobile) ? 'blur(10px)' : 'none',
        alignItems: 'stretch',
        overflow: 'hidden',
        zIndex: 1,
        boxShadow: isDesktop ? '0 40px 100px rgba(0, 0, 0, 0.5)' : 'none',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        {/* Left Side / Top - Logo Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        }}>
          <img 
            src="/ooz.PNG" 
            alt="Oozbek Logo" 
            style={{ 
              width: '100%', 
              maxWidth: isDesktop ? '420px' : (isMobile ? '220px' : '300px'), 
              height: 'auto', 
              filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(130, 205, 0, 0.2))',
              marginBottom: isMobile ? '0' : '1rem'
            }} 
          />
          {isDesktop && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1rem', fontWeight: 500, letterSpacing: '1px' }}>
                PROFESSIONAL MANAGEMENT SYSTEM
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Form Card */}
        <div style={{
          flex: isDesktop ? 0.9 : 1,
          backgroundColor: isMobile ? 'transparent' : '#F3F4F6', 
          padding: isDesktop ? '5rem 4rem' : (isMobile ? '2rem 1rem' : '4rem 2.5rem'),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: isDesktop ? '0' : '30px',
        }}>
          <div style={{ marginBottom: isMobile ? '2rem' : '3.5rem' }}>
            {!isMobile && (
              <h1 style={{ 
                fontSize: '1rem', 
                color: 'var(--color-primary-dark)', 
                fontWeight: 800, 
                letterSpacing: '4px', 
                marginBottom: '3rem',
                opacity: 0.8
              }}>WELCOME</h1>
            )}
            
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: isMobile ? '#fff' : 'var(--color-primary-dark)', fontWeight: 800, marginBottom: '0.5rem' }}>Login</h2>
              <p style={{ fontSize: '1rem', color: isMobile ? 'var(--mobile-text-dim)' : '#6B7280', fontWeight: 500 }}>Enter your credentials to continue</p>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-green)' }} />
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                  borderRadius: isMobile ? '15px' : '20px',
                  border: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : '2px solid #E5E7EB',
                  backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isMobile ? '#fff' : 'var(--color-primary-dark)',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary-green)' }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                  borderRadius: isMobile ? '15px' : '20px',
                  border: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : '2px solid #E5E7EB',
                  backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.05)' : '#fff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isMobile ? '#fff' : 'var(--color-primary-dark)',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              />
            </div>
            {error && <p style={{ color: '#fb7185', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.25rem',
                backgroundColor: loading ? '#9CA3AF' : 'var(--color-primary-green)',
                color: '#fff',
                borderRadius: isMobile ? '15px' : '20px',
                fontSize: '1.1rem',
                fontWeight: 800,
                marginTop: '1.5rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: 'none',
                boxShadow: isMobile ? '0 10px 20px rgba(130, 205, 0, 0.2)' : '0 10px 25px rgba(130, 205, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} />
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: isMobile ? 'var(--mobile-text-dim)' : '#9CA3AF', fontSize: '0.875rem', fontWeight: 500 }}>
              &copy; 2026 Oozbek. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
