import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { Calendar, Trash2, Pencil, Printer } from 'lucide-react';
import DataTable from '../components/DataTable';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import EntryTabs from '../components/EntryTabs';

const COLUMNS = (handleEdit, handleDelete) => [
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

export default function IncomeEntry() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [category, setCategory] = useState('Wrapping');
  const [paymentType, setPaymentType] = useState('CASH');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [discount, setDiscount] = useState('');
  const [advance, setAdvance] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
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

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setDate(item.date);
    setCustomerName(item.customerName);
    setVehicleDetails(item.vehicleDetails);
    setPhoneNo(item.phoneNo);
    setCategory(item.category);
    setPaymentType(item.paymentType);
    setAmount(item.amount.replace('₹ ', ''));
    setAddress(item.address || '');
    setEmail(item.email || '');
    setDiscount(item.discount || '');
    setAdvance(item.advance || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    // Basic validation before print
    if (!customerName || !amount) {
      alert("Please fill in Customer Name and Amount before printing.");
      return;
    }

    const deliveryNo = Math.floor(1000 + Math.random() * 9000); // Random for now
    const totalAmount = parseFloat(amount) || 0;
    const discountVal = parseFloat(discount) || 0;
    const advanceVal = parseFloat(advance) || 0;
    const balanceVal = totalAmount - discountVal - advanceVal;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${customerName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
            body { font-family: 'Inter', sans-serif; padding: 20px; color: #000; background: #fff; margin: 0; }
            
            .bill-container { 
              width: 210mm; 
              margin: 0 auto; 
              padding: 2.5rem; 
              position: relative;
              background: #fff;
            }

            /* Header Section */
            .header-banner {
              background: #212020ff;
              margin: -40px -40px 20px -40px;
              padding: 20px 40px;
              display: flex;
              align-items: center;
              clip-path: polygon(0 0, 100% 0, 82% 100%, 0% 100%);
              width: 65%;
              height: 60px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
            }

            .logo-text {
              font-size: 42px;
              font-weight: 900;
              letter-spacing: -2px;
              color: #1a262c;
              margin: 0;
              position: relative;
            }
            .logo-subtitle {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 4px;
              display: block;
              margin-top: -5px;
              color: #1a262c;
              opacity: 0.8;
            }

            .company-info {
              font-size: 12px;
              line-height: 1.4;
              margin-top: 10px;
            }
            .info-item { display: flex; gap: 5px; margin-bottom: 1px; }
            .info-label { font-weight: 700; min-width: 55px; }

            .delivery-box {
              text-align: right;
            }
            .delivery-label { font-size: 10px; font-weight: 600; margin-right: 15px; }
            .delivery-number {
              display: inline-block;
              background: #000;
              color: #fff;
              padding: 6px 25px;
              font-size: 20px;
              font-weight: 800;
              border-radius: 2px;
            }

            .date-box {
              margin-top: 20px;
              text-align: right;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              gap: 8px;
            }
            .date-label {
              background: #9ca3af;
              color: #000;
              padding: 1px 12px;
              font-weight: 700;
              font-size: 11px;
            }
            .date-value { font-weight: 700; font-size: 14px; border-bottom: 1px solid #000; min-width: 100px; text-align: center; }

            /* Customer Section */
            .section-title { font-size: 11px; font-weight: 800; margin-bottom: 10px; color: #000; }
            
            .customer-grid {
              display: grid;
              grid-template-columns: 2fr 1.2fr;
              gap: 20px;
              margin-bottom: 20px;
            }

            .input-row {
              display: flex;
              align-items: baseline;
              margin-bottom: 10px;
              gap: 8px;
            }
            .input-label { font-size: 10px; font-weight: 600; white-space: nowrap; }
            .input-line { 
              flex: 1; 
              border-bottom: 1px solid #000; 
              font-size: 13px; 
              font-weight: 600; 
              padding-bottom: 1px;
              min-height: 18px;
            }

            /* Table Section */
            .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .items-table th { 
              background: #1a262c; 
              color: #fff; 
              text-align: center; 
              padding: 8px; 
              font-size: 11px; 
              font-weight: 800;
              border: 1px solid #1a262c;
            }
            .items-table td { 
              padding: 8px; 
              border: 1px solid #9ca3af; 
              font-size: 13px; 
              font-weight: 500;
              height: 38px;
              text-align: center;
            }

            /* Footer Section */
            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
              align-items: flex-end;
            }

            .signature-box {
              position: relative;
              margin-bottom: 25px;
            }
            .signature-label { font-weight: 800; font-size: 14px; }
            
            .totals-list {
              width: 220px;
            }
            .total-item {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-weight: 700;
              font-size: 14px;
            }
            .total-item.grand-total {
              border-top: 1.5px solid #000;
              margin-top: 5px;
              font-size: 16px;
              padding-top: 8px;
            }
            .total-item span:first-child { color: #000; width: 100px; }
            .total-item span:last-child { text-align: right; }

            /* Watermark */
            .watermark {
              position: absolute;
              top: 55%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 400px;
              opacity: 0.06;
              z-index: -1;
              pointer-events: none;
            }

            @media print {
              body { padding: 0; }
              .bill-container { width: 100%; padding: 20mm; border: none; min-height: auto; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="bill-container">
            <img src="/ooz.PNG" class="watermark" />
            
            <div class="header">
              <div class="header-banner">
                <img src="/ooz.PNG" alt="Oozbek" style="height: 65px; filter: brightness(0) invert(1);">
              </div>

              <div class="header-right" style="padding-top: 10px;">
                <div class="delivery-box">
                  <span class="delivery-label">Delivery Number</span>
                  <div class="delivery-number">${deliveryNo}</div>
                </div>
                <div class="date-box">
                  <span class="date-label">Date</span>
                  <div class="date-value">${date.split('-').reverse().join(' / ')}</div>
                </div>
              </div>
            </div>

            <div class="company-info" style="margin-top: -30px; margin-bottom: 20px;">
              <div class="info-item"><span class="info-label">Address:</span> Perinthalmanna</div>
              <div class="info-item"><span class="info-label">Mail:</span> oozbekautomotive@gmail.com</div>
              <div class="info-item"><span class="info-label">Phone:</span> +91 8921 766 465</div>
              <div class="info-item"><span class="info-label">Insta:</span> oozbekautomotive</div>
            </div>

            <div class="customer-section">
              <div class="section-title">Customer Details</div>
              
              <div class="customer-grid">
                <div>
                  <div class="input-row">
                    <span class="input-label">Name:</span>
                    <div class="input-line">${customerName}</div>
                  </div>
                  <div class="input-row">
                    <span class="input-label">Address:</span>
                    <div class="input-line">${address || ''}</div>
                  </div>
                </div>
                <div>
                  <div class="input-row">
                    <span class="input-label">vehicle number:</span>
                    <div class="input-line">${vehicleDetails}</div>
                  </div>
                  <div class="input-row">
                    <span class="input-label">Phone:</span>
                    <div class="input-line">${phoneNo}</div>
                  </div>
                  <div class="input-row">
                    <span class="input-label">Email:</span>
                    <div class="input-line">${email || ''}</div>
                  </div>
                </div>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 100px;">Item No</th>
                  <th>Description</th>
                  <th style="width: 120px;">Quantity</th>
                  <th style="width: 150px;">price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td style="text-align: left;">${category}</td>
                  <td>1</td>
                  <td>₹ ${totalAmount}</td>
                </tr>
                ${Array(4).fill('<tr><td></td><td></td><td></td><td></td></tr>').join('')}
              </tbody>
            </table>

            <div class="footer">
              <div class="signature-box">
                <div class="signature-label">Signature:</div>
              </div>
              <div class="totals-list">
                <div class="total-item">
                  <span>Total :</span>
                  <span>₹ ${totalAmount}</span>
                </div>
                <div class="total-item">
                  <span>discount :</span>
                  <span>₹ ${discountVal}</span>
                </div>
                <div class="total-item">
                    <span>Round To :</span>
                    <span>₹ 0</span>
                </div>
                <div class="total-item">
                  <span>Advance :</span>
                  <span>₹ ${advanceVal}</span>
                </div>
                <div class="total-item grand-total">
                  <span>Balance :</span>
                  <span>₹ ${balanceVal}</span>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteDoc(doc(db, 'income', id));
        alert("Entry deleted successfully!");
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert("Failed to delete entry.");
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!customerName || !amount) {
      alert("Please fill in Customer Name and Amount");
      return;
    }

    setLoading(true);
    try {
      const data = {
        date,
        customerName,
        vehicleDetails,
        phoneNo,
        category,
        paymentType,
        amount: `₹ ${amount}`,
        address,
        email,
        discount,
        advance,
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'income', editId), data);
        alert("Entry updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await addDoc(collection(db, 'income'), {
          ...data,
          createdAt: new Date().toISOString()
        });
        alert("Entry added successfully!");
      }

      // Clear form
      setCustomerName('');
      setVehicleDetails('');
      setPhoneNo('');
      setAmount('');
      setAddress('');
      setEmail('');
      setDiscount('');
      setAdvance('');
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry.");
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
              <option value="Wrapping">Wrapping</option>
              <option value="Graphics">Graphics</option>
              <option value="Sticker Work">Sticker Work</option>
              <option value="Cooling Film">Cooling Film</option>
              <option value="Lamination">Lamination</option>
              <option value="Detailing">Detailing</option>
              <option value="Ceramic Coating">Ceramic Coating</option>
              <option value="Graphene Coating">Graphene Coating</option>
              <option value="Borophane Coating">Borophane Coating</option>
              <option value="Paint Protection Film">Paint Protection Film</option>
              <option value="Premium Car Wash">Premium Car Wash</option>
              <option value="Polishing">Polishing</option>
              <option value="Detailing Wash">Detailing Wash</option>
              <option value="Steam Wash">Steam Wash</option>
              <option value="Head Light Restoration">Head Light Restoration</option>
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
              {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')}
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
            <option value="Wrapping">Wrapping</option>
            <option value="Graphics">Graphics</option>
            <option value="Sticker Work">Sticker Work</option>
            <option value="Cooling Film">Cooling Film</option>
            <option value="Lamination">Lamination</option>
            <option value="Detailing">Detailing</option>
            <option value="Ceramic Coating">Ceramic Coating</option>
            <option value="Graphene Coating">Graphene Coating</option>
            <option value="Borophane Coating">Borophane Coating</option>
            <option value="Paint Protection Film">Paint Protection Film</option>
            <option value="Premium Car Wash">Premium Car Wash</option>
            <option value="Polishing">Polishing</option>
            <option value="Detailing Wash">Detailing Wash</option>
            <option value="Steam Wash">Steam Wash</option>
            <option value="Head Light Restoration">Head Light Restoration</option>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Email Address (Bill)</label>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', gridColumn: 'span 2' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Address (Bill)</label>
          <textarea
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              padding: '1.125rem',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid #E5E7EB',
              backgroundColor: '#fff',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Discount (Bill)</label>
          <input
            type="number"
            placeholder="Enter Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
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
          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>Advance (Bill)</label>
          <input
            type="number"
            placeholder="Enter Advance"
            value={advance}
            onChange={(e) => setAdvance(e.target.value)}
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

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: '1.125rem',
            backgroundColor: loading ? '#6B7280' : 'var(--color-primary-dark)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 800,
            fontSize: '1rem',
            border: 'none',
            boxShadow: '0 10px 20px rgba(10, 38, 44, 0.15)',
            transition: 'all 0.2s',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Entry' : 'Add Entry')}
        </button>

        <button
          onClick={handlePrint}
          style={{
            padding: '1.125rem 2.5rem',
            backgroundColor: '#fff',
            color: 'var(--color-primary-dark)',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 800,
            fontSize: '1rem',
            border: '2px solid var(--color-primary-dark)',
            transition: 'all 0.2s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
          <Printer size={20} /> Print Bill
        </button>
      </div>

      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setCustomerName('');
            setVehicleDetails('');
            setPhoneNo('');
            setAmount('');
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

