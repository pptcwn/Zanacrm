import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PlatformBadge } from '@/components/ui/platform-badge';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: rawCustomer, error } = await supabase
    .from('customers')
    .select('*, orders(*)')
    .eq('id', id)
    .single();

  if (error || !rawCustomer) {
    notFound();
  }
  
  const customer = rawCustomer as any;

  const orders = customer.orders || [];
  // Sort orders by created_at desc
  orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">{customer.name}</h1>
          <p className="mt-1 text-zinc-400">Customer since {new Date(customer.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
           <span className={`px-3 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase border ${
              customer.segment === 'vip' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
              customer.segment === 'regular' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              customer.segment === 'at_risk' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {customer.segment}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-zinc-500 mb-1">Phone</div>
                <div className="text-zinc-100">{customer.phone || '—'}</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Email</div>
                <div className="text-zinc-100">{customer.email || '—'}</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Platforms</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {customer.platforms?.length > 0 ? (
                    customer.platforms.map((p: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300">{p}</span>
                    ))
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Orders</span>
                <span className="font-medium text-white">{customer.total_orders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Spent</span>
                <span className="font-medium text-white">฿{(customer.total_spent || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Average Order</span>
                <span className="font-medium text-white">
                  ฿{customer.total_orders > 0 ? Math.round((customer.total_spent || 0) / customer.total_orders).toLocaleString() : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
               <div className="text-center p-8 text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800 border-dashed">
                 No orders yet
               </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <Link 
                    href={`/orders/${order.id}`} 
                    key={order.id}
                    className="block group"
                  >
                    <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-4 border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <PlatformBadge platform={order.channel} showLabel={false} />
                        <div>
                          <div className="font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                            {order.order_number}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium text-white">฿{order.total_amount.toLocaleString()}</div>
                          <div className="text-xs text-zinc-500 mt-1">
                            {order.status === 'pending' || order.status === 'paid' ? 'Active' : 'Archived'}
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
