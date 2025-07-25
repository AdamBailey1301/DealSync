// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
    const [deals, setDeals] = useState([]);
    const [brand, setBrand] = useState('');
    const [payment, setPayment] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');

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
            payment,
            contact,
            email,
            note,
            status: 'Pending',
        };
        setDeals([...deals, newDeal]);
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

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome to DealSync</h1>
            <p>This is the MVP of your micro-CRM for content creators.</p>

            <h2>Add New Deal</h2>
            <input placeholder="Brand Name" value={brand} onChange={e => setBrand(e.target.value)} />
            <input placeholder="Payment Amount" value={payment} onChange={e => setPayment(e.target.value)} />
            <input placeholder="Contact Name" value={contact} onChange={e => setContact(e.target.value)} />
            <input placeholder="Contact Email" value={email} onChange={e => setEmail(e.target.value)} />
            <textarea placeholder="Notes" value={note} onChange={e => setNote(e.target.value)} />
            <button onClick={addDeal}>Add Deal</button>

            <h2>Deals List</h2>
            {deals.length === 0 && <p>No deals added yet.</p>}
            {deals.map(deal => (
                <div key={deal.id} style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
                    <p><strong>Brand:</strong> {deal.brand}</p>
                    <p><strong>Payment:</strong> £{deal.payment}</p>
                    <p><strong>Contact:</strong> {deal.contact}</p>
                    <p><strong>Email:</strong> {deal.email}</p>
                    <p><strong>Note:</strong> {deal.note}</p>
                    <label>
                        Status:
                        <select value={deal.status} onChange={e => updateStatus(deal.id, e.target.value)}>
                            <option>Pending</option>
                            <option>Negotiating</option>
                            <option>Closed</option>
                            <option>Rejected</option>
                        </select>
                    </label>
                    <br />
                    <button onClick={() => deleteDeal(deal.id)} style={{ marginTop: '0.5rem', color: 'red' }}>Delete</button>
                </div>
            ))}
        </div>
    );
}
