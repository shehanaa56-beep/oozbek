import { Calendar, Download, Share2, FileText } from 'lucide-react';

export default function MobileReports() {
  const reports = [
    'March 2026 Statement',
    'February 2026 Statement',
    'January 2026 Statement',
    'December 2025 Statement'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <header>
        <h1 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Select Date Range</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12px', color: 'var(--mobile-text-dim)', marginBottom: '8px' }}>From :</p>
            <div style={rangeInputStyle}>
              12-03-2026 <Calendar size={14} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '12px', color: 'var(--mobile-text-dim)', marginBottom: '8px' }}>To :</p>
            <div style={rangeInputStyle}>
              12-03-2026 <Calendar size={14} />
            </div>
          </div>
        </div>
      </header>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Statement Preview</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button style={actionButtonStyle}><Share2 size={16} color="var(--color-primary-green)" /></button>
             <button style={{ ...actionButtonStyle, backgroundColor: '#8B5CF6' }}><Download size={16} color="#fff" /></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map((report) => (
            <div key={report} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              cursor: 'pointer'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                padding: '8px', 
                borderRadius: '8px',
                color: '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <FileText size={16} strokeWidth={3} />
                <span style={{ fontSize: '8px', fontWeight: 800 }}>PDF</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{report}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const rangeInputStyle = {
  backgroundColor: '#D1D5DB',
  color: '#333',
  padding: '10px 15px',
  borderRadius: '10px',
  fontSize: '13px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const actionButtonStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '8px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
