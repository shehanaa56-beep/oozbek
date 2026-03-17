import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { Calendar } from 'lucide-react';
import DataTable from '../components/DataTable';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import EntryTabs from '../components/EntryTabs';

const COLUMNS = [
  { header: 'Date', field: 'date' },
  { header: 'Customer Name', field: 'customerName' },
  { header: 'Vehicle Details', field: 'vehicleDetails' },
  { header: 'Phone No', field: 'phoneNo' },
  { 
    header: 'Payment Type', 
    field: 'paymentType',
    render: (val) => <span style={{ color: 'var(--color-primary-green)' }}>{val}</span> 
  },
  { header: 'Category', field: 'category' },
  { header: 'Amount', field: 'amount' },
];

export default function IncomeEntry() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [category, setCategory] = useState('Polish');
  const [paymentType, setPaymentType] = useState('CASH');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { searchQuery } = useSearch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const q = query(collection(db, 'income'), orderBy('createdAt', 'desc'));
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
    if (!customerName || !amount) {
      alert("Please fill in Customer Name and Amount");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'income'), {
        date,
        customerName,
        vehicleDetails,
        phoneNo,
        category,
        paymentType,
        amount: `₹ ${amount}`,
        createdAt: new Date().toISOString()
      });

      // Clear form
      setCustomerName('');
      setVehicleDetails('');
      setPhoneNo('');
      setAmount('');
      alert("Entry added successfully!");
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry.");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth <= 768;

  const filteredEntries = entries.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.customerName?.toLowerCase().includes(query) ||
      item.vehicleDetails?.toLowerCase().includes(query) ||
      item.phoneNo?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.amount?.toLowerCase().includes(query)
    );
  });

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
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Income Entry</h2>
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
              placeholder="Enter Customer Name" 
              style={mobileInputStyle} 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input 
              placeholder="Enter Vehicle Details" 
              style={mobileInputStyle} 
              value={vehicleDetails}
              onChange={(e) => setVehicleDetails(e.target.value)}
            />
            <input 
              placeholder="Enter Phone Number" 
              style={mobileInputStyle} 
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <select 
              style={mobileInputStyle} 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Polish">Polish</option>
              <option value="Wash">Wash</option>
            </select>
            <select 
              style={mobileInputStyle} 
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="CASH">CASH</option>
              <option value="UPI">UPI</option>
            </select>
            <input 
              placeholder="Enter Amount" 
              style={mobileInputStyle} 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            
            <button 
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? '#6B7280' : 'linear-gradient(to right, #82CD00, #E4EE00)',
                color: '#000',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                marginTop: '10px',
                fontSize: '14px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}>
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* List Section */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Today's Entries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredEntries.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5 }}>No matching entries</p>
            ) : (
              filteredEntries.map((item, i) => (
                <div key={item.id || i} style={{
                  backgroundColor: 'var(--mobile-card-bg)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700 }}>{item.customerName}</p>
                    <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginTop: '4px' }}>{item.vehicleDetails} • {item.category}</p>
                    <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)' }}>{item.phoneNo}</p>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-green)' }}>{item.amount}</p>
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
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Income Entry</h1>
      </div>
      
      {/* Date Picker */}
      <div style={{ display: 'inline-block', position: 'relative', marginBottom: '2.5rem' }}>
        <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>Date</label>
        <div style={{ position: 'relative' }}>
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
      </div>

      {/* Form Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2.5rem 4rem',
        marginBottom: '3rem'
      }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ 
              padding: '1.125rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#4B5563'
            }}>
            <option value="Polish">Polish</option>
            <option value="Wash">Wash</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Customer Name</label>
          <input 
            type="text" 
            placeholder="Enter Customer Name" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ 
              padding: '1.125rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500
            }} 
          />
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Payment Type</label>
          <select 
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            style={{ 
              padding: '1.125rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#4B5563'
            }}>
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Vehicle Details</label>
          <input 
            type="text" 
            placeholder="Enter Vehicle Details" 
            value={vehicleDetails}
            onChange={(e) => setVehicleDetails(e.target.value)}
            style={{ 
              padding: '1.125rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500
            }} 
          />
        </div>

        {/* Row 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Amount</label>
          <input 
            type="text" 
            placeholder="Enter Amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              padding: '1.125rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500
            }} 
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Phone Number</label>
          <input 
            type="text" 
            placeholder="Enter Phone Number" 
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            style={{ 
              padding: '1.125rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1.5px solid #E5E7EB', 
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500
            }} 
          />
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '1.125rem',
          backgroundColor: loading ? '#6B7280' : 'var(--color-primary-dark)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          fontWeight: 700,
          marginBottom: '4rem',
          fontSize: '1rem',
          border: 'none',
          boxShadow: '0 10px 20px rgba(10, 38, 44, 0.15)',
          transition: 'all 0.2s',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
        {loading ? 'Adding...' : 'Add'}
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Latest Entries</h3>
      </div>
      <DataTable columns={COLUMNS} data={filteredEntries} />
    </div>
  );
}

const mobileInputStyle = {
  backgroundColor: '#D1D5DB', // Light grey like in mockup
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#333',
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit'
};

