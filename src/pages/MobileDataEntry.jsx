import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function MobileDataEntry() {
  const [activeTab, setActiveTab] = useState('Income');

  const tabs = ['Income Entry', 'Expense Entry', 'Leave Entry'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tab Switcher */}
      <div style={{ 
        display: 'flex', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        padding: '5px', 
        borderRadius: '12px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.split(' ')[0])}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeTab === tab.split(' ')[0] ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeTab === tab.split(' ')[0] ? '#fff' : 'var(--mobile-text-dim)',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Container */}
      <div style={{
        backgroundColor: 'var(--mobile-card-bg)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '3px', height: '18px', backgroundColor: 'var(--color-primary-green)', borderRadius: '4px' }}></div>
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{activeTab} Entry</h2>
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
          <input placeholder="Enter Customer Name" style={inputStyle} />
          <input placeholder="Enter Vehicle Details" style={inputStyle} />
          <input placeholder="Enter Phone Number" style={inputStyle} />
          <select style={inputStyle}>
            <option>Select Category</option>
          </select>
          <select style={inputStyle}>
            <option>Select Payment Type</option>
          </select>
          <input placeholder="Enter Amount" style={inputStyle} />
          
          <button style={{
            background: 'linear-gradient(to right, #82CD00, #E4EE00)',
            color: '#000',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 800,
            marginTop: '10px',
            fontSize: '14px'
          }}>
            Add
          </button>
        </div>
      </div>

      {/* List Section */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Today's Entries</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{
              backgroundColor: 'var(--mobile-card-bg)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>Customer Name</p>
                <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginTop: '4px' }}>KL 10 BH 5330 • POLISHING</p>
                <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)' }}>+91 9198991499</p>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-green)' }}>$ {i === 1 ? '750' : '250'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  backgroundColor: '#D1D5DB', // Light grey like in mockup
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#333',
  outline: 'none',
  width: '100%'
};
