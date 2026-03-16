export default function DataTable({ columns, data }) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '24px', 
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.03)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#fff' }}>
            <tr>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  style={{ 
                    padding: '1.25rem 1.5rem', 
                    fontSize: '0.8rem', 
                    fontWeight: 800, 
                    color: 'var(--color-primary-dark)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1.5px solid #F3F4F6'
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
                borderBottom: idx === data.length - 1 ? 'none' : '1px solid #F9FAFB',
                transition: 'background-color 0.2s'
              }}>
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    style={{ 
                      padding: '1.25rem 1.5rem', 
                      fontSize: '0.9rem', 
                      color: '#4B5563',
                      fontWeight: 600,
                    }}
                  >
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
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
