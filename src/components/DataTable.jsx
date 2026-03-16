export default function DataTable({ columns, data }) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '24px', 
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.03)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      transition: 'var(--transition-normal)',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  style={{ 
                    padding: '1.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    color: 'var(--color-primary-dark)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: '2px solid #F3F4F6',
                    opacity: 0.8
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} style={{ 
                borderBottom: idx === data.length - 1 ? 'none' : '1px solid #F3F4F6',
                transition: 'var(--transition-fast)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    style={{ 
                      padding: '1.5rem', 
                      fontSize: '0.95rem', 
                      color: '#4B5563',
                      fontWeight: 500,
                    }}
                  >
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  No entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
