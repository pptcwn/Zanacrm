'use client';

import { useState } from 'react';

const shipments = [
  { id: 'SP-8821', order: 'TK-1042', customer: 'น้องมิ้น', provider: 'Kerry', status: 'Ready to Ship', tracking: '-', date: '19 Jun' },
  { id: 'SP-8820', order: 'SP-2911', customer: 'คุณสมชาย', provider: 'J&T', status: 'Shipped', tracking: 'JT987654321', date: '18 Jun' },
  { id: 'SP-8819', order: 'FB-5512', customer: 'คุณจันทร์', provider: 'Flash', status: 'Delivered', tracking: 'FL123456789', date: '17 Jun' },
];

export default function ShippingPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' 
    ? shipments 
    : shipments.filter(s => s.status.toLowerCase().includes(filter));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Shipping</h1>
          <p className="text-muted mt-1">Manage fulfillment and track deliveries</p>
        </div>
        <button className="btn btn-primary">+ Create Shipment</button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'ready', 'shipped', 'delivered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filter === f 
                ? 'bg-white text-black' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700 text-left">
              <th className="px-6 py-4">Shipment ID</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tracking</th>
              <th className="px-6 py-4">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {filtered.map((s, index) => (
              <tr key={index} className="hover:bg-zinc-800/40">
                <td className="px-6 py-4 font-mono text-blue-400">{s.id}</td>
                <td className="px-6 py-4 font-mono">{s.order}</td>
                <td className="px-6 py-4">{s.customer}</td>
                <td className="px-6 py-4">{s.provider}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    s.status === 'Delivered' ? 'badge-success' : 
                    s.status === 'Shipped' ? 'badge-info' : 'badge-warning'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{s.tracking}</td>
                <td className="px-6 py-4 text-muted">{s.date}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline text-sm">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
