// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [brand, setBrand] = useState('');
  const [payment, setPayment] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortType, setSortType] = useState('Newest');
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    const storedDeals = localStorage.getItem('deals');
    if (storedDeals) {
      setDeals(JSON.parse(storedDeals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('deals', JSON.stringify(deals));
  }, [deals]);

  const addDeal = () => {
    if (!brand || !payment) return;
    const newDeal = {
      id: Date.now(),
      brand,
      payment: parseFloat(payment),
      contact,
      email,
      note,
      status: 'Pending',
    };
    setDeals([newDeal, ...deals]);
    setBrand('');
    setPayment('');
    setContact('');
    setEmail('');
    setNote('');
  };

  const updateStatus = (id, newStatus) => {
    setDeals(deals.map(deal => deal.id === id ? { ...deal, status: newStatus } : deal));
  };

  const deleteDeal = (id) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#facc15';
      case 'Negotiating': return '#fb923c';
      case 'Closed': return '#22c55e';
      case 'Rejected': return '#ef4444';
      default: return '#ccc';
    }
  };

  const startEditing = (deal) => {
    setEditingId(deal.id);
    setEditFields({ ...deal });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFields({});
  };

  const saveEdit = () => {
    setDeals(deals.map(deal => deal.id === editingId ? { ...editFields } : deal));
    setEditingId(null);
    setEditFields({});
  };

  const exportToCSV = () => {
    const headers = ['Brand', 'Payment', 'Contact', 'Email', 'Note', 'Status'];
    const rows = filteredDeals.map(deal => [
      deal.brand,
      deal.payment,
      deal.contact,
      deal.email,
      deal.note,
      deal.status
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deals-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDeals = deals
    .filter(deal =>
      (deal.brand.toLowerCase().includes(search.toLowerCase()) ||
       deal.contact.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === 'All' || deal.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortType === 'Newest') return b.id - a.id;
      if (sortType === 'Payment') return b.payment - a.payment;
      if (sortType === 'Alphabetical') return a.brand.localeCompare(b.brand);
      return 0;
    });

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to DealSync</h1>
      <p>This is the MVP of your micro-CRM for content creators.</p>

      <button onClick={exportToCSV} style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px' }}>
        📤 Export CSV
      </button>

      <h2>Add New Deal</h2>
      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
        <input placeholder="Brand Name" value={brand} onChange={e => setBrand(e.target.value)} />
        <input placeholder="Payment Amount" value={payment} onChange={e => setPayment(e.target.value)} />
        <input placeholder="Contact Name" value={contact} onChange={e => setContact(e.target.value)} />
        <input placeholder="Contact Email" value={email} onChange={e => setEmail(e.target.value)} />
        <textarea placeholder="Notes" value={note} onChange={e => setNote(e.target.value)} />
        <button onClick={addDeal} style={{ padding: '0.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>Add Deal</button>
      </div>

      <h2>Search & Filter</h2>
      <input
        placeholder="Search by brand or contact"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Closed">Closed</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={sortType} onChange={e => setSortType(e.target.value)}>
          <option value="Newest">Newest to Oldest</option>
          <option value="Payment">Payment High to Low</option>
          <option value="Alphabetical">Alphabetical</option>
        </select>
      </div>

      <h2>Deals List</h2>
      {filteredDeals.length === 0 && <p>No matching deals found.</p>}
      {filteredDeals.map(deal => (
        <div key={deal.id} style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
          {editingId === deal.id ? (
            <>
              <input value={editFields.brand} onChange={e => setEditFields({ ...editFields, brand: e.target.value })} />
              <input value={editFields.payment} onChange={e => setEditFields({ ...editFields, payment: e.target.value })} />
              <input value={editFields.contact} onChange={e => setEditFields({ ...editFields, contact: e.target.value })} />
              <input value={editFields.email} onChange={e => setEditFields({ ...editFields, email: e.target.value })} />
              <textarea value={editFields.note} onChange={e => setEditFields({ ...editFields, note: e.target.value })} />
              <select value={editFields.status} onChange={e => setEditFields({ ...editFields, status: e.target.value })}>
                <option>Pending</option>
                <option>Negotiating</option>
                <option>Closed</option>
                <option>Rejected</option>
              </select>
              <br />
              <button onClick={saveEdit} style={{ marginTop: '0.5rem', color: 'green' }}>Save</button>
              <button onClick={cancelEditing} style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Brand:</strong> {deal.brand}</p>
              <p><strong>Payment:</strong> £{deal.payment}</p>
              <p><strong>Contact:</strong> {deal.contact}</p>
              <p><strong>Email:</strong> {deal.email}</p>
              <p><strong>Note:</strong> {deal.note}</p>
              <p>
                <strong>Status:</strong>
                <span style={{ backgroundColor: getStatusColor(deal.status), color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem' }}>{deal.status}</span>
              </p>
              <button onClick={() => startEditing(deal)}>✏️ Edit</button>
              <button onClick={() => deleteDeal(deal.id)} style={{ marginLeft: '1rem', color: 'red' }}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
