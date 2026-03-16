import { useState } from 'react';
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
          backgroundColor: '#1F2937', // Darker gray for premium look
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
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
