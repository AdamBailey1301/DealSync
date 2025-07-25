// File: pages/index.js

import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
    const [deals, setDeals] = useState([]);
    const [newDeal, setNewDeal] = useState({ brand: '', amount: '', status: 'Pending' });

    const handleAddDeal = () => {
        if (!newDeal.brand || !newDeal.amount) return;
        setDeals([...deals, { ...newDeal, id: Date.now() }]);
        setNewDeal({ brand: '', amount: '', status: 'Pending' });
    };

    const handleStatusChange = (id, status) => {
        setDeals(deals.map(deal => deal.id === id ? { ...deal, status } : deal));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <Head>
                <title>DealSync - MVP</title>
            </Head>

            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">🎯 DealSync - MVP Dashboard</h1>

                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-2">➕ Add New Deal</h2>
                    <input
                        type="text"
                        placeholder="Brand name"
                        className="border p-2 mr-2 mb-2 w-full"
                        value={newDeal.brand}
                        onChange={e => setNewDeal({ ...newDeal, brand: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Amount (£)"
                        className="border p-2 mr-2 mb-2 w-full"
                        value={newDeal.amount}
                        onChange={e => setNewDeal({ ...newDeal, amount: e.target.value })}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handleAddDeal}
                    >
                        Add Deal
                    </button>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">📋 Active Deals</h2>
                    {deals.length === 0 ? (
                        <p className="text-gray-500">No deals yet.</p>
                    ) : (
                        <ul>
                            {deals.map(deal => (
                                <li key={deal.id} className="border-b py-2">
                                    <div className="flex justify-between">
                                        <span><strong>{deal.brand}</strong> — £{deal.amount}</span>
                                        <select
                                            value={deal.status}
                                            onChange={e => handleStatusChange(deal.id, e.target.value)}
                                            className="border p-1 rounded text-sm"
                                        >
                                            <option>Pending</option>
                                            <option>Negotiating</option>
                                            <option>Closed</option>
                                            <option>Rejected</option>
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

