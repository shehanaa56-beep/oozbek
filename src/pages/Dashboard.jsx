import { useState, useEffect } from 'react';
import { ArrowUpRight, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sun', income: 4000, expense: 2400 },
  { name: 'Mon', income: 3000, expense: 1398 },
  { name: 'Tue', income: 2000, expense: 9800 },
  { name: 'Wed', income: 2780, expense: 3908 },
  { name: 'Thu', income: 1890, expense: 4800 },
  { name: 'Fri', income: 2390, expense: 3800 },
  { name: 'Sat', income: 3490, expense: 4300 },
];

export default function Dashboard() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

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
          <div style={{
            backgroundColor: 'var(--mobile-card-bg)',
            borderRadius: '20px',
            padding: '15px',
            border: '1px solid var(--mobile-card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)' }}>Today's Income</p>
              <p style={{ fontSize: '16px', fontWeight: 800 }}>$ 1,000</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--mobile-card-bg)',
            borderRadius: '20px',
            padding: '15px',
            border: '1px solid var(--mobile-card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)' }}>Today's Expense</p>
              <p style={{ fontSize: '16px', fontWeight: 800 }}>$ 250</p>
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
            <h2 style={{ fontSize: '36px', fontWeight: 800 }}>$ 750</h2>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              padding: '4px 10px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <ArrowUpRight size={14} /> 75%
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
          
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
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
              Income $ 1,000
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B91C1C' }}></span>
              Expense $ 250
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

      {/* Stats Cards Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        
        {/* Income Card */}
        <div style={{
          backgroundColor: 'var(--color-card-dark)',
          color: '#fff',
          borderRadius: '24px',
          padding: '2rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
           <div style={{ 
             backgroundColor: 'rgba(255,255,255,0.08)', 
             padding: '0.85rem', 
             borderRadius: '14px',
             color: '#fff',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <DollarSign size={24} />
           </div>
           <div>
             <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>Today's Income</p>
             <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-primary-green)', fontWeight: 800 }}>$ 1,000</h2>
           </div>
        </div>

        {/* Expense Card */}
        <div style={{
          backgroundColor: 'var(--color-card-dark)',
          color: '#fff',
          borderRadius: '24px',
          padding: '2rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
           <div style={{ 
             backgroundColor: 'rgba(255,255,255,0.08)', 
             padding: '0.85rem', 
             borderRadius: '14px',
             color: '#fff',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <DollarSign size={24} />
           </div>
           <div>
             <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>Today's Expense</p>
             <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#fb7185', fontWeight: 800 }}>$ 250</h2>
           </div>
        </div>

        {/* Net Profit Card - Gradient */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-profit-start), var(--color-profit-end))',
          color: '#fff',
          borderRadius: '24px',
          padding: '2rem 1.75rem',
          boxShadow: '0 10px 25px rgba(130, 205, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'rgba(10, 38, 44, 0.65)', fontWeight: 700 }}>Net Profit</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.85rem' }}>
             <h2 style={{ fontSize: '2.75rem', margin: 0, fontWeight: 800, color: '#111827' }}>$ 750</h2>
             <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                backgroundColor: 'rgba(255,255,255,0.4)',
                padding: '0.4rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#111827'
             }}>
               <ArrowUpRight size={14} strokeWidth={3} />
               75%
             </div>
           </div>
           <p style={{ fontSize: '0.8rem', color: 'rgba(10, 38, 44, 0.65)', fontWeight: 700 }}>Based on Today's Transaction</p>
        </div>

      </div>

      {/* Analytics Chart Section */}
      <div style={{
        backgroundColor: '#F1F3F5',
        borderRadius: '28px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: 'var(--color-primary-dark)' }}>Income/Expense</h3>
        </div>
        
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={10} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 13, fill: 'var(--color-text-muted)', fontWeight: 600 }} 
                dy={15} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--color-text-muted)' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
              />
              <Bar 
                dataKey="income" 
                fill="#82CD00" 
                radius={[6, 6, 0, 0]} 
                barSize={12}
              />
              <Bar 
                dataKey="expense" 
                fill="#B91C1C" 
                radius={[6, 6, 0, 0]} 
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend Section */}
        <div style={{ display: 'flex', gap: '3.5rem', marginTop: '2.5rem', paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#82CD00' }}></span>
                Income $ 1,000
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#B91C1C' }}></span>
                Expense $ 250
            </div>
        </div>
      </div>
    </div>
  );
}
