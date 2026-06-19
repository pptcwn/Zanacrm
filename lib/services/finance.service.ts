import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { CreateFinanceEntry, UpdateFinanceEntry } from '@/lib/validations/finance.schema';

type FinanceRow = Database['public']['Tables']['finance_entries']['Row'];

export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  avg_order_value: number;
  low_stock_items: number;
  pending_shipments: number;
  unresolved_chats: number;
  open_tasks: number;
}

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const financeService = {
  async getAll(): Promise<FinanceRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('finance_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(entryData: CreateFinanceEntry): Promise<FinanceRow> {
    const { data, error } = await getSupabaseClient()
      .from('finance_entries')
      // @ts-ignore
      .insert([entryData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async update(id: string, entryData: UpdateFinanceEntry): Promise<FinanceRow> {
    const { data, error } = await getSupabaseClient()
      .from('finance_entries')
      // @ts-ignore
      .update(entryData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await getSupabaseClient()
      .from('finance_entries')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const { data, error } = await getSupabaseClient()
      // @ts-ignore
      .rpc('get_dashboard_summary');
      
    if (error) throw error;
    
    // Ensure all values are parsed properly
    const summary = data as any;
    return {
      total_revenue: Number(summary?.total_revenue || 0),
      total_orders: Number(summary?.total_orders || 0),
      total_customers: Number(summary?.total_customers || 0),
      avg_order_value: Number(summary?.avg_order_value || 0),
      low_stock_items: Number(summary?.low_stock_items || 0),
      pending_shipments: Number(summary?.pending_shipments || 0),
      unresolved_chats: Number(summary?.unresolved_chats || 0),
      open_tasks: Number(summary?.open_tasks || 0)
    };
  },

  async getRevenueTrend(): Promise<{ dailyRevenue: { date: string, revenue: number }[], channelDistribution: { channel: string, value: number }[] }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await getSupabaseClient()
      .from('orders')
      .select('created_at, total_amount, channel')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .neq('status', 'cancelled')
      .neq('status', 'refunded');

    if (error) throw error;

    const dailyRevenueMap: Record<string, number> = {};
    const channelMap: Record<string, number> = {};
    let totalRevenue = 0;

    (data as any[])?.forEach(order => {
      // Aggregate Daily Revenue
      const date = new Date(order.created_at).toISOString().split('T')[0];
      dailyRevenueMap[date] = (dailyRevenueMap[date] || 0) + (order.total_amount || 0);

      // Aggregate Channels
      const channel = order.channel || 'unknown';
      channelMap[channel] = (channelMap[channel] || 0) + (order.total_amount || 0);
      totalRevenue += (order.total_amount || 0);
    });

    // Fill in missing days
    const dailyRevenue: { date: string, revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyRevenue.push({
        date: dateStr.split('-').slice(1).join('/'), // e.g. "06/19"
        revenue: dailyRevenueMap[dateStr] || 0
      });
    }

    const channelDistribution = Object.keys(channelMap).map(channel => ({
      channel: channel.charAt(0).toUpperCase() + channel.slice(1),
      value: totalRevenue > 0 ? Math.round((channelMap[channel] / totalRevenue) * 100) : 0
    })).sort((a, b) => b.value - a.value);

    return { dailyRevenue, channelDistribution };
  }
};
