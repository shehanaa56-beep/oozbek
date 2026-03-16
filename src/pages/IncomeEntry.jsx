import { useState } from 'react';
import DataTable from '../components/DataTable';

const MOCK_INCOME_DATA = [
  { date: '12-03-2026', customerName: 'ASHIQ', vehicleDetails: 'KL 10 BH 2345', phoneNo: '+91 6757 6758 54', paymentType: 'CASH', category: 'Polish', amount: '$ 1,000' },
  { date: '12-03-2026', customerName: 'ASHIQ', vehicleDetails: 'KL 10 BH 2345', phoneNo: '+91 6757 6758 54', paymentType: 'UPI', category: 'Polish', amount: '$ 1,000' },
  { date: '12-03-2026', customerName: 'ASHIQ', vehicleDetails: 'KL 10 BH 2345', phoneNo: '+91 6757 6758 54', paymentType: 'CASH', category: 'Polish', amount: '$ 1,000' },
];

const COLUMNS = [
  { header: 'Date', field: 'date' },
  { header: 'Customer Name', field: 'customerName' },
  { header: 'Vehicle Details', field: 'vehicleDetails' },
  { header: 'Phone No', field: 'phoneNo' },
  { 
    header: 'Payment Type', 
    field: 'paymentType',
    render: (val) => <span style={{ color: val === 'CASH' ? 'var(--color-primary-green)' : 'var(--color-primary-green)' }}>{val}</span> 
  },
  { header: 'Category', field: 'category' },
  { header: 'Amount', field: 'amount' },
];

export default function IncomeEntry() {
  const [date, setDate] = useState('2026-02-12');
  
  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Income Entry</h1>
      </div>
      
      {/* Date Picker (Mock) */}
      <div style={{ display: 'inline-block', position: 'relative', marginBottom: '2.5rem' }}>
        <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>Date</label>
        <div style={{ position: 'relative' }}>
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
      </div>

      {/* Form Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2.5rem 4rem',
        marginBottom: '3rem'
      }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Category</label>
          <select style={{ 
            padding: '1.125rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid #E5E7EB', 
            backgroundColor: '#fff',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#4B5563'
          }}>
            <option>Select Category</option>
            <option>Polish</option>
            <option>Wash</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Customer Name</label>
          <input type="text" placeholder="Enter Customer Name" style={{ 
            padding: '1.125rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid #E5E7EB', 
            backgroundColor: '#fff',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 500
          }} />
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Payment Type</label>
          <select style={{ 
            padding: '1.125rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid #E5E7EB', 
            backgroundColor: '#fff',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#4B5563'
          }}>
            <option>Select Payment Type</option>
            <option>CASH</option>
            <option>UPI</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Vehicle Details</label>
          <input type="text" placeholder="Enter Vehicle Details" style={{ 
            padding: '1.125rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid #E5E7EB', 
            backgroundColor: '#fff',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 500
          }} />
        </div>

        {/* Row 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Amount</label>
          <input type="text" placeholder="Enter Amount" style={{ 
            padding: '1.125rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid #E5E7EB', 
            backgroundColor: '#fff',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 500
          }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Phone Number</label>
          <input type="text" placeholder="Enter Phone Number" style={{ 
            padding: '1.125rem', 
            borderRadius: 'var(--radius-lg)', 
            border: '1.5px solid #E5E7EB', 
            backgroundColor: '#fff',
            outline: 'none',
            fontSize: '0.95rem',
            fontWeight: 500
          }} />
        </div>
      </div>

      <button style={{
        width: '100%',
        padding: '1.125rem',
        backgroundColor: 'var(--color-primary-dark)',
        color: '#fff',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 700,
        marginBottom: '4rem',
        fontSize: '1rem',
        border: 'none',
        boxShadow: '0 10px 20px rgba(10, 38, 44, 0.15)',
        transition: 'all 0.2s'
      }}>
        Add
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Latest Entries</h3>
      </div>
      <DataTable columns={COLUMNS} data={MOCK_INCOME_DATA} />
    </div>
  );
}
