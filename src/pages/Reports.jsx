import { useState, useEffect } from 'react';
import { Share2, Download, FileText, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState({ income: 0, expense: 0, profit: 0, transactions: [] });
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Dynamic month discovery from real data
    const fetchRealMonths = () => {
      const qI = query(collection(db, 'income'), orderBy('date', 'desc'));
      const qE = query(collection(db, 'expenses'), orderBy('date', 'desc'));
      
      const updateMonths = (snaps) => {
        const months = new Set();
        snaps.forEach(snap => {
          snap.forEach(doc => {
            const d = new Date(doc.data().date);
            if (!isNaN(d)) {
              const mName = d.toLocaleString('default', { month: 'long' });
              months.add(`${mName} ${d.getFullYear()}`);
            }
          });
        });
        const sortedMonths = Array.from(months).sort((a, b) => {
          const [mA, yA] = a.split(' ');
          const [mB, yB] = b.split(' ');
          return new Date(`${mB} 1, ${yB}`) - new Date(`${mA} 1, ${yA}`);
        });
        setAvailableMonths(sortedMonths.slice(0, 6));
      };

      let iSnap = null, eSnap = null;
      const unsubI = onSnapshot(qI, (snap) => {
        iSnap = snap;
        if (eSnap) updateMonths([iSnap, eSnap]);
        else updateMonths([iSnap]);
      });
      const unsubE = onSnapshot(qE, (snap) => {
        eSnap = snap;
        if (iSnap) updateMonths([iSnap, eSnap]);
        else updateMonths([eSnap]);
      });

      return () => { unsubI(); unsubE(); };
    };

    const unsubMonths = fetchRealMonths();
    return () => {
      window.removeEventListener('resize', handleResize);
      unsubMonths();
    };
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const qI = query(collection(db, 'income'), where('date', '>=', fromDate), where('date', '<=', toDate));
      const qE = query(collection(db, 'expenses'), where('date', '>=', fromDate), where('date', '<=', toDate));
      
      const [iSnap, eSnap] = await Promise.all([getDocs(qI), getDocs(qE)]);

      let ti = 0, te = 0;
      const txs = [];
      iSnap.forEach(d => {
        const v = d.data();
        ti += parseFloat(v.amount?.replace(/[^0-9.]/g, '')) || 0;
        txs.push({...v, type: 'Income', id: d.id});
      });
      eSnap.forEach(d => {
        const v = d.data();
        te += parseFloat(v.amount?.replace(/[^0-9.]/g, '')) || 0;
        txs.push({...v, type: 'Expense', id: d.id});
      });

      setReportData({
        income: ti,
        expense: te,
        profit: ti - te,
        transactions: txs.sort((a,b) => new Date(b.date) - new Date(a.date))
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (title, start, end) => {
    const shareData = {
      title: 'Oozbek Statement',
      text: `Check out the ${title} for Oozbek Automotive from ${start} to ${end}.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Share link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const getMonthDateRange = (monthYearStr) => {
    const [monthName, year] = monthYearStr.split(' ');
    const date = new Date(`${monthName} 1, ${year}`);
    const monthIdx = date.getMonth();
    const y = date.getFullYear();
    
    const start = `${y}-${String(monthIdx + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(y, monthIdx + 1, 0).getDate();
    const end = `${y}-${String(monthIdx + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    
    return { start, end };
  };

  const getRangeTitle = (start, end) => {
    const sDate = new Date(start);
    const eDate = new Date(end);
    
    // Check if it's a full month
    if (sDate.getDate() === 1) {
      const lastDay = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0).getDate();
      if (eDate.getDate() === lastDay && sDate.getMonth() === eDate.getMonth() && sDate.getFullYear() === eDate.getFullYear()) {
        return `${sDate.toLocaleString('default', { month: 'long' })} ${sDate.getFullYear()} Statement`;
      }
    }
    
    return `Statement ${start} to ${end}`;
  };

  const downloadPDF = async (title, start, end, transactions = null) => {
    setLoading(true);
    try {
      let ti = 0, te = 0, txs = transactions;
      
      if (!txs) {
        const qI = query(collection(db, 'income'), where('date', '>=', start), where('date', '<=', end));
        const qE = query(collection(db, 'expenses'), where('date', '>=', start), where('date', '<=', end));
        const [iS, eS] = await Promise.all([getDocs(qI), getDocs(qE)]);
        txs = [];
        iS.forEach(d => {
          const v = d.data();
          const amt = parseFloat(v.amount?.replace(/[^0-9.]/g, '')) || 0;
          ti += amt;
          txs.push({...v, type: 'Income', amount: amt});
        });
        eS.forEach(d => {
          const v = d.data();
          const amt = parseFloat(v.amount?.replace(/[^0-9.]/g, '')) || 0;
          te += amt;
          txs.push({...v, type: 'Expense', amount: amt});
        });
      } else {
        ti = reportData.income;
        te = reportData.expense;
        txs = transactions.map(t => ({
          ...t,
          amountValue: typeof t.amount === 'string' ? (parseFloat(t.amount.replace(/[^0-9.]/g, '')) || 0) : t.amount
        }));
      }

      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(130, 205, 0);
      doc.text('Oozbek Automotive', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(title, 105, 30, { align: 'center' });
      
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Amount']],
        body: [['Total Income', `₹ ${ti.toLocaleString()}`], ['Total Expenses', `₹ ${te.toLocaleString()}`], ['Net Profit', `₹ ${(ti - te).toLocaleString()}`]],
        theme: 'striped', headStyles: { fillStyle: [10, 38, 44] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Date', 'Type', 'Category', 'Details', 'Amount']],
        body: txs.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => [
          t.date, 
          t.type, 
          t.category, 
          t.customerName || t.description || '-', 
          `₹ ${(t.amountValue || t.amount || 0).toLocaleString()}`
        ]),
        headStyles: { fillStyle: [130, 205, 0] }
      });

      doc.save(`Oozbek_${title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth <= 768;

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <header>
          <h1 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Select Date Range</h1>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginBottom: '5px' }}>From :</p>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={mInput} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginBottom: '5px' }}>To :</p>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={mInput} />
            </div>
          </div>
          <button onClick={fetchReportData} disabled={loading} style={mApply}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
          </button>
        </header>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{getRangeTitle(fromDate, toDate)}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={() => handleShare(getRangeTitle(fromDate, toDate), fromDate, toDate)} style={actBtn}><Share2 size={18} color="var(--primary-bright)" /></button>
               <button onClick={() => downloadPDF(getRangeTitle(fromDate, toDate), fromDate, toDate, reportData.transactions)} style={purpBtn}><Download size={18} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SummaryItem label="Total Income" value={reportData.income} color="#10b981" />
            <SummaryItem label="Total Expense" value={reportData.expense} color="#fb7185" />
            <SummaryItem label="Net Profit" value={reportData.profit} color="#fff" isBig />
          </div>

          <div style={{ marginTop: '25px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '15px' }}>Monthly Statements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableMonths.map((m, i) => (
                <div key={i} onClick={() => {
                  const { start, end } = getMonthDateRange(m);
                  downloadPDF(`${m} Statement`, start, end);
                }} style={mStmtItem}>
                  <div style={pdfTag}>
                    <FileText size={14} strokeWidth={3} />
                    <span style={{ fontSize: '8px', fontWeight: 800 }}>PDF</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{m} Statement</span>
                </div>
              ))}
            </div>
          </div>

          {reportData.transactions.length > 0 && (
            <div style={{ marginTop: '25px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '15px' }}>Transaction Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reportData.transactions.map((t, i) => (
                  <div key={i} style={mTxCard}>
                    <div>
                      <p style={{ fontSize: '11px', opacity: 0.6 }}>{t.date} • {t.type}</p>
                      <p style={{ fontWeight: 700, fontSize: '14px' }}>{t.category}</p>
                    </div>
                    <p style={{ fontWeight: 800, color: t.type === 'Income' ? '#10b981' : '#fb7185' }}>{t.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '2rem' }}>Monthly Reports</h1>
      
      <div style={dCard}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '2rem', fontWeight: 800 }}>Select Date Range</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', alignItems: 'end' }}>
          <div style={iGrp}>
            <label style={lSty}>From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={dInp} />
          </div>
          <div style={iGrp}>
            <label style={lSty}>To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={dInp} />
          </div>
          <button onClick={fetchReportData} disabled={loading} style={dApply}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Apply'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
        <SummaryCard title="Total Income" value={reportData.income} color="#10b981" />
        <SummaryCard title="Total Expense" value={reportData.expense} color="#ef4444" />
        <SummaryCard title="Net Profit" value={reportData.profit} color="#111827" bg="linear-gradient(135deg, #82CD00, #E4EE00)" />
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{getRangeTitle(fromDate, toDate)}</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Share2 size={24} onClick={() => handleShare(getRangeTitle(fromDate, toDate), fromDate, toDate)} style={{ color: '#64748b', cursor: 'pointer' }} />
              <div onClick={() => downloadPDF(getRangeTitle(fromDate, toDate), fromDate, toDate, reportData.transactions)} style={dPurpBtn}>
                <Download size={20} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reportData.transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #e5e7eb' }}>
                Select a date range and click Apply to preview transactions.
              </div>
            ) : (
              reportData.transactions.map((t, i) => (
                <div key={i} style={dTxCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ ...dIconBox, backgroundColor: t.type === 'Income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                      <FileText color={t.type === 'Income' ? '#10b981' : '#ef4444'} size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '1rem' }}>{t.category}</p>
                      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.date} • {t.customerName || t.description || 'General'}</p>
                    </div>
                  </div>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', color: t.type === 'Income' ? '#10b981' : '#ef4444' }}>
                    {t.type === 'Income' ? '+' : '-'} {t.amount}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '2rem' }}>Monthly Archive</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {availableMonths.map((m, i) => (
              <div key={i} onClick={() => {
                const { start, end } = getMonthDateRange(m);
                downloadPDF(`${m} Statement`, start, end);
              }} style={dStmtItem}>
                <div style={dPdfTag}>PDF</div>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color, isBig }) {
  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px 20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', opacity: 0.8 }}>{label}</span>
      <span style={{ fontSize: isBig ? '24px' : '18px', fontWeight: 800, color }}>₹ {value.toLocaleString()}</span>
    </div>
  );
}

function SummaryCard({ title, value, color, bg = '#fff' }) {
  return (
    <div style={{ background: bg, padding: '2rem 1.75rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: bg === '#fff' ? '1px solid #f1f5f9' : 'none' }}>
      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: bg === '#fff' ? '#64748b' : 'rgba(10,38,44,0.7)', marginBottom: '0.75rem' }}>{title}</p>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, color, margin: 0 }}>₹ {value.toLocaleString()}</h2>
    </div>
  );
}

// Styles
const mInput = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px', color: '#fff', width: '100%', fontSize: '13px' };
const mApply = { width: '100%', padding: '12px', backgroundColor: '#0a262c', color: '#fff', borderRadius: '12px', fontWeight: 800, border: '1px solid #1a3a3e', cursor: 'pointer', display: 'flex', justifyContent: 'center' };
const actBtn = { background: 'none', border: 'none', cursor: 'pointer' };
const purpBtn = { backgroundColor: '#8B5CF6', padding: '6px', borderRadius: '8px', border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '2px 2px 10px rgba(139, 92, 246, 0.4)' };
const mStmtItem = { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '15px' };
const pdfTag = { backgroundColor: '#fff', padding: '6px 8px', borderRadius: '8px', color: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const mTxCard = { backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const dCard = { backgroundColor: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '3.5rem', border: '1px solid #f1f5f9' };
const iGrp = { display: 'flex', flexDirection: 'column', gap: '0.85rem' };
const lSty = { fontWeight: 800, fontSize: '0.9rem', color: '#0a262c' };
const dInp = { padding: '0.875rem 1.25rem', border: '1.5px solid #E5E7EB', borderRadius: '12px', fontWeight: 700, outline: 'none', backgroundColor: '#fff', fontSize: '0.9rem', color: '#0a262c' };
const dApply = { width: '100%', padding: '1rem', backgroundColor: '#0a262c', color: '#fff', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' };
const dPurpBtn = { backgroundColor: '#8B5CF6', padding: '0.6rem', borderRadius: '14px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(139, 92, 246, 0.4)' };
const dStmtItem = { backgroundColor: '#0a262c', color: '#fff', padding: '1.25rem 1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', transition: '0.2s' };
const dPdfTag = { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900 };
const dTxCard = { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f8fafc' };
const dIconBox = { padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
