import { useState } from 'react';
import { Share2, Download } from 'lucide-react';

export default function Reports() {
  const [fromDate, setFromDate] = useState('2026-02-12');
  const [toDate, setToDate] = useState('2026-02-12');

  const statements = [
    { title: 'March 2026 Statement' },
    { title: 'March 2026 Statement' },
    { title: 'March 2026 Statement' },
    { title: 'March 2026 Statement' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Monthly Reports</h1>
      </div>
      
      {/* Date Range Selection Card */}
      <div style={{
        backgroundColor: '#fff',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        marginBottom: '3.5rem',
        border: '1px solid rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '2rem', fontWeight: 800 }}>Select Date Range</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', alignItems: 'end' }}>
          {/* From Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>From</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                padding: '0.875rem 1.25rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: 'var(--radius-lg)',
                fontFamily: 'inherit',
                fontWeight: 700,
                outline: 'none',
                backgroundColor: '#fff',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)'
              }}
            />
          </div>

          {/* To Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>To</label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                padding: '0.875rem 1.25rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: 'var(--radius-lg)',
                fontFamily: 'inherit',
                fontWeight: 700,
                outline: 'none',
                backgroundColor: '#fff',
                fontSize: '0.9rem',
                color: 'var(--color-primary-dark)'
              }}
            />
          </div>

          {/* Apply Button */}
          <button style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--color-primary-dark)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 800,
            fontSize: '1rem',
            border: 'none',
            boxShadow: '0 4px 12px rgba(10, 38, 44, 0.2)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}>
            Apply
          </button>
        </div>
      </div>

      {/* Statement Preview Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Statement Preview</h2>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <button style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}><Share2 size={22} /></button>
          <button style={{ 
            color: '#fff',
            backgroundColor: '#8B5CF6', // Purple hue from mock
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Statement List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {statements.map((stmt, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--color-primary-dark)',
            color: '#fff',
            padding: '1.75rem',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.15)', 
              color: '#fff',
              padding: '0.45rem 0.85rem', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>
              PDF
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{stmt.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
