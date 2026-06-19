'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlatformBadge } from '@/components/ui/platform-badge';
import { StatusBadge } from '@/components/ui/status-badge';

const mockOrders = [
  { id: 'TK-1001', channel: 'tiktok', customer: 'น้องมิ้น', amount: 2450, status: 'processing', date: '2026-06-19' },
  { id: 'SP-2847', channel: 'shopee', customer: 'คุณสมชาย', amount: 1890, status: 'shipped', date: '2026-06-18' },
  { id: 'FB-5512', channel: 'facebook', customer: 'คุณจันทร์', amount: 3200, status: 'paid', date: '2026-06-19' },
];

export default function OrdersPage() {
  const [orders] = useState(mockOrders);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="text-zinc-400">Manage all orders from every platform</p>
        </div>
        <button className="px-4 py-2 bg-white text-black rounded-xl text-sm font-medium">Export CSV</button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-zinc-800 text-left text-sm text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Channel</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-mono text-blue-400 flex items-center gap-2">
                  <PlatformBadge 
                    platform={order.channel.toLowerCase() as "tiktok" | "shopee" | "facebook" | "lazada"} 
                    showLabel={false} 
                  />
                  {order.id}
                </td>
                <td className="px-6 py-4">
                  <PlatformBadge platform={order.channel.toLowerCase() as "tiktok" | "shopee" | "facebook" | "lazada"} />
                </td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4 font-medium">฿{order.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status.toLowerCase() as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "paid" | "refunded"} />
                </td>
                <td className="px-6 py-4 text-zinc-400">{order.date}</td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/orders/${order.id}`} 
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Detail →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
