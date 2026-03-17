import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { logout, user, updateUserEmail, updateUserPassword } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      alert("Email cannot be empty");
      return;
    }

    setLoading(true);
    let success = true;

    // Update Email if changed
    if (email !== user.email) {
      const res = await updateUserEmail(email);
      if (!res.success) {
        alert(res.message);
        success = false;
      } else if (res.message) {
        alert(res.message); // Show verification message
      }
    }

    // Update Password if provided
    if (success && password) {
      const res = await updateUserPassword(password);
      if (!res.success) {
        alert(res.message);
        success = false;
      }
    }

    if (success) {
      alert("Profile updated successfully!");
      setPassword(''); // Clear password field
    }
    setLoading(false);
  };

  const isMobile = windowWidth <= 768;

  if (isMobile) {
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
            marginBottom: '30px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={profileInputStyle}
              placeholder="Email"
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={profileInputStyle}
              placeholder="New Password (optional)"
            />
            <div 
              style={{ 
                position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--mobile-text-dim)',
                cursor: 'pointer'
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading}
            style={{
              backgroundColor: loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              marginTop: '10px',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    );
  }

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

        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.75rem' }} onSubmit={handleUpdate}>
          
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={desktopInputStyle}
              placeholder="Email"
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
              type={showPassword ? "text" : "password"}
              placeholder="New Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{...desktopInputStyle, paddingRight: '3.5rem'}}
            />
            <div 
              style={{ 
                position: 'absolute', 
                right: '1.25rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer'
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#6B7280' : 'var(--color-primary-dark)',
              color: '#fff',
              padding: '1.125rem',
              borderRadius: 'var(--radius-lg)',
              fontSize: '1.1rem',
              fontWeight: 800,
              marginTop: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px rgba(10, 38, 44, 0.2)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>

      </div>
    </div>
  );
}

const desktopInputStyle = {
  width: '100%',
  padding: '1.125rem 1rem 1.125rem 3.5rem',
  borderRadius: 'var(--radius-lg)',
  border: '1.5px solid #E5E7EB',
  backgroundColor: 'transparent',
  fontSize: '1rem',
  outline: 'none',
  fontWeight: 700,
  color: 'var(--color-primary-dark)'
};

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

