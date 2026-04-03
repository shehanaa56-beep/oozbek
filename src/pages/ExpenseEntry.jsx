import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { Calendar, Trash2, Pencil } from 'lucide-react';
import DataTable from '../components/DataTable';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import EntryTabs from '../components/EntryTabs';

const COLUMNS = (handleEdit, handleDelete) => [
  { header: 'Date', field: 'date' },
  { header: 'Category', field: 'category' },
  { 
    header: 'Payment Type', 
    field: 'paymentType',
    render: (val) => <span style={{ color: 'var(--color-primary-green)' }}>{val}</span> 
  },
  { header: 'Description', field: 'description' },
  { header: 'Amount', field: 'amount' },
  {
    header: 'Actions',
    field: 'actions',
    render: (_, row) => (
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={() => handleEdit(row)}
          style={{ border: 'none', background: 'none', padding: '5px', cursor: 'pointer', color: '#4B5563' }}
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => handleDelete(row.id)}
          style={{ border: 'none', background: 'none', padding: '5px', cursor: 'pointer', color: '#EF4444' }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    )
  }
];

export default function ExpenseEntry() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('CASH');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const { searchQuery } = useSearch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, []);

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setDate(item.date);
    setCategory(item.category);
    setAmount(item.amount.replace('₹ ', ''));
    setPaymentType(item.paymentType);
    setDescription(item.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteDoc(doc(db, 'expenses', id));
        alert("Expense deleted successfully!");
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense.");
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    setLoading(true);
    try {
      const data = {
        date,
        category,
        amount: `₹ ${amount}`,
        paymentType,
        description,
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'expenses', editId), data);
        alert("Expense updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await addDoc(collection(db, 'expenses'), {
          ...data,
          createdAt: new Date().toISOString()
        });
        alert("Expense added successfully!");
      }

      // Clear form
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth <= 768;

  const filteredEntries = entries.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.category?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.amount?.toLowerCase().includes(query) ||
      item.paymentType?.toLowerCase().includes(query)
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
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Expense Entry</h2>
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
            <select 
              style={mobileInputStyle}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Purchase">Purchase</option>
              <option value="Salary">Salary</option>
            </select>
            <input 
              placeholder="Enter Amount" 
              style={mobileInputStyle} 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select 
              style={mobileInputStyle}
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="CASH">CASH</option>
              <option value="UPI">UPI</option>
            </select>
            <input 
              placeholder="Enter Description" 
              style={mobileInputStyle} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')}
            </button>
          </div>
        </div>

        {/* List Section */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px' }}>Today's Entries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredEntries.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5 }}>No matching expenses</p>
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
                    <p style={{ fontSize: '14px', fontWeight: 700 }}>{item.category}</p>
                    <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)', marginTop: '4px' }}>{item.paymentType} • {item.description}</p>
                    <p style={{ fontSize: '11px', color: 'var(--mobile-text-dim)' }}>{item.date}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-green)' }}>{item.amount}</p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleEdit(item)}
                          style={{ border: 'none', background: 'none', color: 'var(--mobile-text-dim)' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          style={{ border: 'none', background: 'none', color: '#fb7185' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
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
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Expense Entry</h1>
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
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Purchase">Purchase</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
        
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
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Description</label>
          <input 
            type="text" 
            placeholder="Enter Description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')}
      </button>

      {isEditing && (
        <button 
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setAmount('');
            setDescription('');
          }}
          style={{
            width: '100%',
            padding: '1.125rem',
            backgroundColor: 'transparent',
            color: '#6B7280',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700,
            marginBottom: '4rem',
            fontSize: '1rem',
            border: '1.5px solid #E5E7EB',
            cursor: 'pointer',
            marginTop: '-3rem'
          }}>
          Cancel Edit
        </button>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Latest Entries</h3>
      </div>
      <DataTable columns={COLUMNS(handleEdit, handleDelete)} data={filteredEntries} />
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

