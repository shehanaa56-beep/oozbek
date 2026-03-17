import { useState, useEffect } from 'react';
import { ArrowUpRight, DollarSign, Loader2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ income: 0, expense: 0, profit: 0, growth: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    // Queries
    const qI = query(collection(db, 'income'), where('date', '>=', startDate));
    const qE = query(collection(db, 'expenses'), where('date', '>=', startDate));

    const processData = (incomeDocs, expenseDocs) => {
      let todayI = 0, todayE = 0;
      const dailyMap = {};

      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleString('default', { weekday: 'short' });
        dailyMap[dateStr] = { name: dayLabel, income: 0, expense: 0 };
      }

      incomeDocs.forEach(doc => {
        const data = doc.data();
        const amt = parseFloat(data.amount?.replace(/[^0-9.]/g, '')) || 0;
        if (data.date === today) todayI += amt;
        if (dailyMap[data.date]) dailyMap[data.date].income += amt;
      });

      expenseDocs.forEach(doc => {
        const data = doc.data();
        const amt = parseFloat(data.amount?.replace(/[^0-9.]/g, '')) || 0;
        if (data.date === today) todayE += amt;
        if (dailyMap[data.date]) dailyMap[data.date].expense += amt;
      });

      setStats({
        income: todayI,
        expense: todayE,
        profit: todayI - todayE,
        growth: todayI > 0 ? Math.round(((todayI - todayE) / todayI) * 100) : 0
      });

      setChartData(Object.values(dailyMap));
      setLoading(false);
    };

    let iDocs = [], eDocs = [];
    const unsubI = onSnapshot(qI, (snap) => {
      iDocs = snap.docs;
      processData(iDocs, eDocs);
    });
    const unsubE = onSnapshot(qE, (snap) => {
      eDocs = snap.docs;
      processData(iDocs, eDocs);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubI();
      unsubE();
    };
  }, []);

  const isMobile = windowWidth <= 768;

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-dark)' }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '14px', color: 'var(--mobile-text-dim)' }}>Welcome Back</p>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Dashboard</h1>
          </div>
          <img src="/ooz.PNG" alt="Logo" style={{ width: '80px', height: 'auto', filter: 'brightness(1.5)' }} />
        </header>

        {/* Stats Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={mStatCard}>
            <div style={mIconBox}>
              <TrendingUp size={18} color="#82CD00" />
            </div>
            <div>
              <p style={mStatLabel}>Today's Income</p>
              <p style={mStatVal}>₹ {stats.income.toLocaleString()}</p>
            </div>
          </div>

          <div style={mStatCard}>
            <div style={mIconBox}>
              <TrendingUp size={18} color="#fb7185" style={{ transform: 'rotate(180deg)' }} />
            </div>
            <div>
              <p style={mStatLabel}>Today's Expense</p>
              <p style={mStatVal}>₹ {stats.expense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Net Profit Big Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-profit-start), var(--color-profit-end))',
          borderRadius: '24px',
          padding: '24px',
          color: '#000'
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Net Profit</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800 }}>₹ {stats.profit.toLocaleString()}</h2>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              padding: '4px 10px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <ArrowUpRight size={14} /> {stats.growth}%
            </div>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 500, opacity: 0.8 }}>Based on Today's Transaction</p>
        </div>

        {/* Chart Section */}
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Income/Expense</h3>
            <span style={{ fontSize: '12px', color: 'var(--mobile-text-dim)' }}>Weekly</span>
          </div>
          
          <div style={{ width: '100%', height: '220px', minHeight: '220px' }}>
            <ResponsiveContainer width="100%" height="100%" debounce={100} minWidth={0}>
              <BarChart data={chartData} barGap={4}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--mobile-text-dim)' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--mobile-card-bg)', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="income" fill="#82CD00" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="expense" fill="#B91C1C" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '15px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#82CD00' }}></span>
              Income ₹ {stats.income.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B91C1C' }}></span>
              Expense ₹ {stats.expense.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={dStatCard}>
           <div style={dIconBox}><TrendingUp size={24} color="#82CD00" /></div>
           <div>
             <p style={dStatLabel}>Today's Income</p>
             <h2 style={dStatValIncome}>₹ {stats.income.toLocaleString()}</h2>
           </div>
        </div>

        <div style={dStatCard}>
           <div style={dIconBox}><TrendingUp size={24} color="#fb7185" style={{ transform: 'rotate(180deg)' }} /></div>
           <div>
             <p style={dStatLabel}>Today's Expense</p>
             <h2 style={dStatValExpense}>₹ {stats.expense.toLocaleString()}</h2>
           </div>
        </div>

        <div style={dNetProfitCard}>
           <p style={dNetProfitLabel}>Net Profit</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.85rem' }}>
             <h2 style={dNetProfitVal}>₹ {stats.profit.toLocaleString()}</h2>
             <div style={dGrowthBadge}>
               <ArrowUpRight size={14} strokeWidth={3} /> {stats.growth}%
             </div>
           </div>
           <p style={dNetProfitSub}>Based on Today's Transaction</p>
        </div>
      </div>

      <div style={dChartContainer}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: 'var(--color-primary-dark)' }}>Income/Expense Analytics</h3>
        </div>
        
        <div style={{ width: '100%', height: '350px', minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height="100%" debounce={100} minWidth={0}>
            <BarChart data={chartData} barGap={10} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--color-text-muted)', fontWeight: 600 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="income" fill="#82CD00" radius={[6, 6, 0, 0]} barSize={12} />
              <Bar dataKey="expense" fill="#B91C1C" radius={[6, 6, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div style={{ display: 'flex', gap: '3.5rem', marginTop: '2.5rem', paddingLeft: '1rem' }}>
            <div style={dLegendItem}><span style={{ ...dLegendDot, backgroundColor: '#82CD00' }}></span> Income ₹ {stats.income.toLocaleString()}</div>
            <div style={dLegendItem}><span style={{ ...dLegendDot, backgroundColor: '#B91C1C' }}></span> Expense ₹ {stats.expense.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

// Styles
const mStatCard = { backgroundColor: 'var(--mobile-card-bg)', borderRadius: '20px', padding: '15px', border: '1px solid var(--mobile-card-border)', display: 'flex', alignItems: 'center', gap: '12px' };
const mIconBox = { backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' };
const mStatLabel = { fontSize: '11px', color: 'var(--mobile-text-dim)', marginBottom: '2px' };
const mStatVal = { fontSize: '16px', fontWeight: 800 };

const dStatCard = { backgroundColor: 'var(--color-card-dark)', color: '#fff', borderRadius: '24px', padding: '2rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const dIconBox = { backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.85rem', borderRadius: '14px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const dStatLabel = { fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 };
const dStatValIncome = { fontSize: '1.75rem', margin: 0, color: 'var(--color-primary-green)', fontWeight: 800 };
const dStatValExpense = { fontSize: '1.75rem', margin: 0, color: '#fb7185', fontWeight: 800 };

const dNetProfitCard = { background: 'linear-gradient(135deg, var(--color-profit-start), var(--color-profit-end))', color: '#fff', borderRadius: '24px', padding: '2rem 1.75rem', boxShadow: '0 10px 25px rgba(130, 205, 0, 0.2)', position: 'relative', overflow: 'hidden' };
const dNetProfitLabel = { fontSize: '0.95rem', marginBottom: '1rem', color: 'rgba(10, 38, 44, 0.65)', fontWeight: 700 };
const dNetProfitVal = { fontSize: '2.75rem', margin: 0, fontWeight: 800, color: '#111827' };
const dGrowthBadge = { display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'rgba(255,255,255,0.4)', padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, color: '#111827' };
const dNetProfitSub = { fontSize: '0.8rem', color: 'rgba(10, 38, 44, 0.65)', fontWeight: 700 };

const dChartContainer = { backgroundColor: '#F1F3F5', borderRadius: '28px', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' };
const dLegendItem = { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)' };
const dLegendDot = { width: '12px', height: '12px', borderRadius: '50%' };
