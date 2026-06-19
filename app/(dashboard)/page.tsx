'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, MessageSquare, CheckSquare } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useFinanceStore } from '@/lib/store/financeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const { dashboardSummary, revenueTrend, fetchSummary, fetchRevenueTrend, isSummaryLoading } = useFinanceStore();

  useEffect(() => {
    fetchSummary();
    fetchRevenueTrend();
  }, [fetchSummary, fetchRevenueTrend]);

  const kpis = [
    { title: "Total Revenue", value: dashboardSummary ? `$${dashboardSummary.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '...', icon: DollarSign, color: "text-emerald-500" },
    { title: "Total Orders", value: dashboardSummary ? dashboardSummary.total_orders.toLocaleString() : '...', icon: ShoppingCart, color: "text-blue-500" },
    { title: "Avg Order Value", value: dashboardSummary ? `$${dashboardSummary.avg_order_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '...', icon: TrendingUp, color: "text-emerald-500" },
    { title: "Total Customers", value: dashboardSummary ? dashboardSummary.total_customers.toLocaleString() : '...', icon: Users, color: "text-violet-500" },
    { title: "Low Stock Items", value: dashboardSummary ? dashboardSummary.low_stock_items.toLocaleString() : '...', icon: Package, color: "text-orange-500" },
    { title: "Open Tasks", value: dashboardSummary ? dashboardSummary.open_tasks.toLocaleString() : '...', icon: CheckSquare, color: "text-amber-500" },
    { title: "Unresolved Chats", value: dashboardSummary ? dashboardSummary.unresolved_chats.toLocaleString() : '...', icon: MessageSquare, color: "text-rose-500" },
  ];

  const channelColors: Record<string, string> = {
    'Shopee': 'bg-orange-500',
    'Tiktok': 'bg-white',
    'Facebook': 'bg-blue-500',
    'Lazada': 'bg-indigo-500',
    'Line': 'bg-green-500',
    'Instagram': 'bg-pink-500',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header with better hierarchy */}
      <div className="pt-2 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-[-0.04em]">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {profile?.full_name?.split(' ')[0] || 'User'}</h1>
          </div>
          <p className="text-lg text-zinc-400 mt-2">Here's a live overview of your multi-channel business today.</p>
        </div>
        {isSummaryLoading && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="w-3.5 h-3.5 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
            Syncing data...
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.slice(0, 4).map((kpi, index) => (
          <Card key={index} className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl hover:border-zinc-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-6">
              <CardTitle className="text-sm font-medium text-zinc-400 tracking-wide">{kpi.title}</CardTitle>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-4xl font-bold tracking-[-0.04em]">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Actionable KPIs */}
        <Card className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpis.slice(4).map((channel, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <channel.icon className={`w-4 h-4 ${channel.color}`} />
                  <span className="text-zinc-300 font-medium">{channel.title}</span>
                </div>
                <span className={`font-mono font-bold ${channel.color}`}>{channel.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Chart Placeholder */}
        <Card className="lg:col-span-2 bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Overview (30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            {revenueTrend && revenueTrend.dailyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend.dailyRevenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    minTickGap={20}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#0a0a0a', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Loading chart data...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-[#0f0f0f] border-[#1f1f1f] shadow-xl">
          <CardHeader>
            <CardTitle>Sales by Channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueTrend?.channelDistribution && revenueTrend.channelDistribution.length > 0 ? (
              revenueTrend.channelDistribution.map((channel, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${channelColors[channel.channel] || 'bg-zinc-500'}`} />
                    <span className="text-zinc-300">{channel.channel}</span>
                  </div>
                  <span className="font-mono font-medium text-white">{channel.value}%</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-zinc-500 text-center py-4">No channel data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-zinc-500">
        Real-time data synced directly from Supabase Operational Database
      </div>
    </div>
  );
}