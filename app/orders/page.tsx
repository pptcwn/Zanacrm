'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Download } from 'lucide-react';
import { PlatformBadge } from '@/components/ui/platform-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { useOrderStore } from '@/lib/store/orderStore';
import { AddOrderModal } from './add-order-modal';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders, subscribeToOrders, unsubscribeFromOrders } = useOrderStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    subscribeToOrders();

    return () => {
      unsubscribeFromOrders();
    };
  }, [fetchOrders, subscribeToOrders, unsubscribeFromOrders]);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
        Failed to load orders: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Orders</h1>
          <p className="text-zinc-400 mt-1 text-sm">Manage all orders from every platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-zinc-300">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Order
          </Button>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1f1f1f] text-left text-xs uppercase tracking-wider text-zinc-500 bg-[#141414]">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Channel</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f] text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors text-white group">
                  <td className="px-6 py-4 font-mono text-blue-400 flex items-center gap-2 text-xs">
                    <PlatformBadge 
                      platform={order.channel} 
                      showLabel={false} 
                    />
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <PlatformBadge platform={order.channel} />
                  </td>
                  <td className="px-6 py-4 font-medium">฿{order.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View Detail
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddOrderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
