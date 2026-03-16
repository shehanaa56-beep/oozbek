import { ArrowUpRight, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sun', income: 4000, expense: 2400 },
  { name: 'Mon', income: 3000, expense: 1398 },
  { name: 'Tue', income: 2000, expense: 9800 },
  { name: 'Wed', income: 2780, expense: 3908 },
  { name: 'Thu', income: 1890, expense: 4800 },
  { name: 'Fri', income: 2390, expense: 3800 },
  { name: 'Sat', income: 3490, expense: 4300 },
];

export default function MobileDashboard() {
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
