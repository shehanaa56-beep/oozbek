import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useSearch } from '../context/SearchContext';
import { db } from '../firebase';
import { FileText, Download, Trash2, Loader2, Archive } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminReports() {
  const [archivedReports, setArchivedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const q = query(collection(db, 'reports_archive'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = [];
      snapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      setArchivedReports(reports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const downloadArchivedPDF = async (report) => {
    setDownloading(report.id);
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(130, 205, 0);
      doc.text('Oozbek Automotive', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(report.title, 105, 30, { align: 'center' });
      
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Amount']],
        body: [
          ['Total Income', `₹ ${report.summary.income.toLocaleString()}`], 
          ['Total Expenses', `₹ ${report.summary.expense.toLocaleString()}`], 
          ['Net Profit', `₹ ${report.summary.profit.toLocaleString()}`]
        ],
        theme: 'striped', 
        headStyles: { fillStyle: [10, 38, 44] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Date', 'Type', 'Category', 'Details', 'Amount']],
        body: report.transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => [
          t.date, 
          t.type, 
          t.category, 
          t.customerName || t.description || '-', 
          `₹ ${(typeof t.amount === 'string' ? parseFloat(t.amount.replace(/[^0-9.]/g, '')) : t.amount || 0).toLocaleString()}`
        ]),
        headStyles: { fillStyle: [130, 205, 0] }
      });

      doc.save(`Oozbek_Archived_${report.title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF.');
    } finally {
      setDownloading(null);
    }
  };

  const deleteArchive = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the archived report "${title}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'reports_archive', id));
      } catch (e) {
        console.error(e);
        alert('Failed to delete report.');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary-dark)" />
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ backgroundColor: 'var(--color-primary-dark)', padding: '10px', borderRadius: '12px', color: '#fff' }}>
          <Archive size={24} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>Reports Archive</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {(() => {
          const filteredReports = archivedReports.filter(report => {
            const query = searchQuery.toLowerCase();
            return (
              report.title?.toLowerCase().includes(query) ||
              report.summary?.income?.toString().includes(query) ||
              report.summary?.expense?.toString().includes(query) ||
              report.summary?.profit?.toString().includes(query)
            );
          });

          if (filteredReports.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '32px', border: '1px dashed #e5e7eb', color: '#64748b' }}>
                <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No matching archived reports found.</p>
              </div>
            );
          }

          return filteredReports.map((report) => (
            <div key={report.id} style={reportCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                <div style={pdfIconContainer}>
                  <FileText size={24} color="#10b981" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{report.title}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Archived on: {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>
              
              <div style={statsContainer}>
                <div style={statItem}>
                  <span style={statLabel}>Income</span>
                  <span style={{ ...statValue, color: '#10b981' }}>₹ {report.summary.income.toLocaleString()}</span>
                </div>
                <div style={statItem}>
                  <span style={statLabel}>Expense</span>
                  <span style={{ ...statValue, color: '#ef4444' }}>₹ {report.summary.expense.toLocaleString()}</span>
                </div>
                <div style={statItem}>
                  <span style={statLabel}>Profit</span>
                  <span style={{ ...statValue, color: '#111827' }}>₹ {report.summary.profit.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => downloadArchivedPDF(report)} 
                  disabled={downloading === report.id}
                  style={downloadBtnStyle}
                >
                  {downloading === report.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Download
                </button>
                <button 
                  onClick={() => deleteArchive(report.id, report.title)}
                  style={deleteBtnStyle}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}

const reportCardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem 2rem',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0,0,0,0.02)',
  gap: '2rem',
  flexWrap: 'wrap'
};

const pdfIconContainer = {
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statsContainer = {
  display: 'flex',
  gap: '2.5rem',
  padding: '0 2rem',
  borderLeft: '1.5px solid #f1f5f9',
  borderRight: '1.5px solid #f1f5f9'
};

const statItem = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const statLabel = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const statValue = {
  fontSize: '1rem',
  fontWeight: 800
};

const downloadBtnStyle = {
  backgroundColor: '#0a262c',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: '0.2s'
};

const deleteBtnStyle = {
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  color: '#ef4444',
  border: 'none',
  padding: '10px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '0.2s'
};
