import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Shield, Key, Trash2, Users } from 'lucide-react';

export default function UserManagement() {
  const { localUsers, addUser, deleteUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser({ email, password, role });
    setEmail('');
    setPassword('');
    setRole('Staff');
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ backgroundColor: 'var(--color-primary-dark)', padding: '10px', borderRadius: '12px', color: '#fff' }}>
          <Users size={24} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>User Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
        {/* Add User Form */}
        <div style={{
          backgroundColor: '#fff',
          padding: '2.5rem',
          borderRadius: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.03)',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={18} color="var(--color-primary-green)" /> Add New Account
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>User Role</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={iconStyle} />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={inputStyle}
                >
                  <option>Staff</option>
                  <option>Manager</option>
                  <option>Accountant</option>
                </select>
              </div>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={iconStyle} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Access Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={iconStyle} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: 'var(--color-primary-dark)',
                color: '#fff',
                padding: '1.125rem',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 800,
                marginTop: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(10, 38, 44, 0.1)'
              }}
            >
              Create Account
            </button>
          </form>
        </div>

        {/* User List */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem' }}>Registered Users ({localUsers.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {localUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                No additional users registered.
              </div>
            ) : (
              localUsers.map((u, i) => (
                <div key={i} style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem 2rem',
                  borderRadius: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(130, 205, 0, 0.1)',
                      color: 'var(--color-primary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      {u.role[0]}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{u.email}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280' }}>Role: {u.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteUser(u.email)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const fieldGroup = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-dark)' };
const iconStyle = { position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' };
const inputStyle = {
  width: '100%',
  padding: '1.125rem 1.125rem 1.125rem 3.5rem',
  borderRadius: '16px',
  border: '1.5px solid #E5E7EB',
  outline: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--color-primary-dark)',
  backgroundColor: '#fff'
};
