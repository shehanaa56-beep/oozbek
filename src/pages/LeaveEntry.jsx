import { useState, useEffect } from 'react';
import { Calendar, UserPlus } from 'lucide-react';
import DataTable from '../components/DataTable';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import EntryTabs from '../components/EntryTabs';

const COLUMNS = [
  { header: 'Date', field: 'date' },
  { header: 'Salesman Name', field: 'salesmanName' },
  { header: 'Phone No', field: 'phoneNo' },
  { 
    header: 'Total Leave', 
    field: 'totalLeave',
    render: (val) => <span style={{ color: 'var(--color-primary-green)' }}>{val}</span> 
  },
  { header: 'Salary Pending', field: 'salaryPending' },
];

export default function LeaveEntry() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesmanName, setSalesmanName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [totalLeave, setTotalLeave] = useState('');
  const [salaryPending, setSalaryPending] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const q = query(collection(db, 'leaves'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!salesmanName || !totalLeave) {
      alert("Please fill in Salesman Name and Total Leave");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'leaves'), {
        date,
        salesmanName,
        phoneNo,
        totalLeave: Number(totalLeave),
        salaryPending: `$ ${salaryPending}`,
        createdAt: new Date().toISOString()
      });

      // Clear form
      setSalesmanName('');
      setPhoneNo('');
      setTotalLeave('');
      setSalaryPending('');
      alert("Leave record added successfully!");
    } catch (error) {
      console.error("Error adding leave record:", error);
      alert("Failed to add record.");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth <= 768;

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <EntryTabs />
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
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Leave Entry</h2>
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
              {date} <Calendar size={14} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              placeholder="Enter Salesman Name" 
              style={mobileInputStyle} 
              value={salesmanName}
              onChange={(e) => setSalesmanName(e.target.value)}
            />
            <input 
              placeholder="Enter Phone Number" 
              style={mobileInputStyle} 
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <input 
              placeholder="Enter Total Leave" 
              style={mobileInputStyle} 
              value={totalLeave}
              onChange={(e) => setTotalLeave(e.target.value)}
            />
            <input 
              placeholder="Enter Salary Pending" 
              style={mobileInputStyle} 
              value={salaryPending}
              onChange={(e) => setSalaryPending(e.target.value)}
            />
            
            <button 
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? '#374151' : 'linear-gradient(to right, #1F2937, #374151)',
                color: '#fff',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                marginTop: '10px',
                fontSize: '14px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
              <UserPlus size={18} /> {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </div>

        {/* List Section */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Leave Records</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5 }}>No records found</p>
            ) : (
              entries.map((item, i) => (
                <div key={item.id || i} style={{
                  backgroundColor: 'var(--mobile-card-bg)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700 }}>{item.salesmanName}</p>
                    <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginTop: '4px' }}>Leaves: {item.totalLeave} • {item.phoneNo}</p>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#fb7185' }}>{item.salaryPending}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: 'var(--color-primary-dark)' }}>Leave Entry</h1>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        {/* Date Picker */}
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '0.875rem 1.25rem',
              border: '1.5px solid #E5E7EB',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'inherit',
              fontWeight: 700,
              outline: 'none',
              backgroundColor: '#fff',
              fontSize: '0.9rem',
              color: 'var(--color-primary-dark)',
              width: '240px'
            }}
          />
        </div>

        {/* Form Container Desktop (Inline Inputs for simplicity of the prompt UI) */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, marginLeft: '2rem', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <div style={inlineField}>
            <label style={inlineLabel}>Salesman</label>
            <input 
              placeholder="Name" 
              style={inlineInput} 
              value={salesmanName} 
              onChange={e => setSalesmanName(e.target.value)} 
            />
          </div>
          <div style={inlineField}>
            <label style={inlineLabel}>Phone</label>
            <input 
              placeholder="Number" 
              style={inlineInput} 
              value={phoneNo} 
              onChange={e => setPhoneNo(e.target.value)} 
            />
          </div>
          <div style={inlineField}>
            <label style={inlineLabel}>Leaves</label>
            <input 
              placeholder="Count" 
              style={inlineInput} 
              value={totalLeave} 
              onChange={e => setTotalLeave(e.target.value)} 
            />
          </div>
          <div style={inlineField}>
            <label style={inlineLabel}>Pending</label>
            <input 
              placeholder="Amount" 
              style={inlineInput} 
              value={salaryPending} 
              onChange={e => setSalaryPending(e.target.value)} 
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.75rem',
              backgroundColor: loading ? '#6B7280' : '#1F2937', 
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #fff', fontSize: '12px', fontWeight: 800
            }}>+</span>
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </div>
      </div>

      <DataTable columns={COLUMNS} data={entries} />
    </div>
  );
}

const inlineField = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const inlineLabel = { fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF' };
const inlineInput = {
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1.5px solid #E5E7EB',
  outline: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
  width: '140px'
};

const mobileInputStyle = {
  backgroundColor: '#D1D5DB', 
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#333',
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit'
};

