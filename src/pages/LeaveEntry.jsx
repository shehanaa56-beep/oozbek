import { useState, useEffect } from 'react';
import { Calendar, UserPlus } from 'lucide-react';
import DataTable from '../components/DataTable';

const MOCK_LEAVE_DATA = [
  { date: '12-03-2026', salesmanName: 'ASHIQ', phoneNo: '+91 6757 6758 54', totalLeave: 2, salaryPending: '$ 1,000' },
  { date: '12-03-2026', salesmanName: 'ASHIQ', phoneNo: '+91 6757 6758 54', totalLeave: 2, salaryPending: '$ 1,000' },
  { date: '12-03-2026', salesmanName: 'ASHIQ', phoneNo: '+91 6757 6758 54', totalLeave: 2, salaryPending: '$ 1,000' },
];

const COLUMNS = [
  { header: 'Date', field: 'date' },
  { header: 'Salesman Name', field: 'salesmanName' },
  { header: 'Phone No', field: 'phoneNo' },
  { 
    header: 'Total Leave', 
    field: 'totalLeave',
    render: (val) => <span style={{ color: 'var(--color-primary-green)' }}>{val}</span> 
  },
  { header: 'Salary Pending', field: 'salaryPending' },
];

export default function LeaveEntry() {
  const [date, setDate] = useState('2026-02-12');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Form Container (Simplified for Leave) */}
        <div style={{
          backgroundColor: 'var(--mobile-card-bg)',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '3px', height: '18px', backgroundColor: 'var(--color-primary-green)', borderRadius: '4px' }}></div>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Leave Entry</h2>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px'
            }}>
              12-03-2026 <Calendar size={14} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Enter Salesman Name" style={mobileInputStyle} />
            <input placeholder="Enter Phone Number" style={mobileInputStyle} />
            <input placeholder="Enter Total Leave" style={mobileInputStyle} />
            <input placeholder="Enter Salary Pending" style={mobileInputStyle} />
            
            <button style={{
              background: 'linear-gradient(to right, #1F2937, #374151)',
              color: '#fff',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 800,
              marginTop: '10px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <UserPlus size={18} /> Add User
            </button>
          </div>
        </div>

        {/* List Section */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Leave Records</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_LEAVE_DATA.map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'var(--mobile-card-bg)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700 }}>{item.salesmanName}</p>
                  <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginTop: '4px' }}>Leaves: {item.totalLeave} • {item.phoneNo}</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#fb7185' }}>{item.salaryPending}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: 'var(--color-primary-dark)' }}>Leave Entry</h1>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        {/* Date Picker (Mock) */}
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '0.875rem 1.25rem',
              border: '1.5px solid #E5E7EB',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'inherit',
              fontWeight: 700,
              outline: 'none',
              backgroundColor: '#fff',
              fontSize: '0.9rem',
              color: 'var(--color-primary-dark)',
              width: '240px'
            }}
          />
        </div>

        {/* Add User Button */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.75rem',
          backgroundColor: '#1F2937', 
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}>
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #fff', fontSize: '12px', fontWeight: 800
          }}>+</span>
          Add User
        </button>
      </div>

      <DataTable columns={COLUMNS} data={MOCK_LEAVE_DATA} />
    </div>
  );
}

const mobileInputStyle = {
  backgroundColor: '#D1D5DB', 
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#333',
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit'
};

