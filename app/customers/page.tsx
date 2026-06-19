'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCustomerStore } from '@/lib/store/customerStore';
import { AddCustomerModal } from './add-customer-modal';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { customers, isLoading, error, fetchCustomers, subscribeToCustomers, unsubscribeFromCustomers } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
    subscribeToCustomers();
    return () => unsubscribeFromCustomers();
  }, [fetchCustomers, subscribeToCustomers, unsubscribeFromCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  const kpis = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.total_orders > 0).length; // rough proxy for active
    const totalSpent = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.total_orders, 0);
    const avgOrderValue = totalCustomers > 0 && totalOrders > 0 
      ? totalSpent / totalOrders 
      : 0;
    const repeatCustomers = customers.filter(c => c.total_orders > 1).length;
    const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

    return { totalCustomers, activeCustomers, avgOrderValue, repeatRate };
  }, [customers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Customers</h1>
          <p className="text-zinc-400 mt-1 text-sm">Customer 360° — Understand your buyers</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Customers</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-3xl font-semibold tracking-tight text-white">{kpis.totalCustomers.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-zinc-400">Active (Purchased)</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-3xl font-semibold tracking-tight text-white">{kpis.activeCustomers.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-3xl font-semibold tracking-tight text-white">฿{Math.round(kpis.avgOrderValue).toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-zinc-400">Repeat Rate</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="text-3xl font-semibold tracking-tight text-white">{kpis.repeatRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 max-w-md">
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customer Table */}
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-xl">
        {isLoading && customers.length === 0 ? (
           <div className="flex items-center justify-center h-48">
             <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f1f1f] text-left text-xs uppercase tracking-wider text-zinc-500 bg-[#141414]">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium">Segment</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f] text-sm">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors text-white group">
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4">
                      {c.phone && <div>{c.phone}</div>}
                      {c.email && <div className="text-zinc-500 text-xs mt-0.5">{c.email}</div>}
                      {!c.phone && !c.email && <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4">{c.total_orders}</td>
                    <td className="px-6 py-4 font-medium">฿{(c.total_spent || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border ${
                        c.segment === 'vip' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                        c.segment === 'regular' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        c.segment === 'at_risk' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/customers/${c.id}`}>
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}

