import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PlatformBadge } from '@/components/ui/platform-badge';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: rawOrder, error } = await supabase
    .from('orders')
    .select('*, order_items(*), customers(name, phone, platforms)')
    .eq('id', id)
    .single();

  if (error || !rawOrder) {
    notFound();
  }
  
  const order = rawOrder as any;

  const items = order.order_items || [];
  const customer = order.customers as any;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <PlatformBadge platform={order.channel} showLabel={false} />
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-blue-400">{order.order_number}</h1>
          </div>
          <p className="mt-1 text-zinc-400">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <Button variant="secondary" size="sm">
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-zinc-950 p-4 text-sm"
              >
                <div>
                  <div className="font-medium text-zinc-100">{item.product_name}</div>
                  <div className="font-mono text-xs text-zinc-500">ID: {item.product_id?.substring(0,8) || 'Manual'}</div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-300">
                    {item.quantity} × ฿{item.unit_price.toLocaleString()}
                  </div>
                  <div className="font-medium text-zinc-100">
                    ฿{item.total.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
               <div className="text-center p-4 text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800 border-dashed">No items found</div>
            )}

            <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>฿{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span>฿{order.shipping_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Discount</span>
                <span className="text-red-400">-฿{order.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-zinc-100 pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span className="text-blue-400">฿{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {customer ? (
                <>
                  <div className="font-medium text-zinc-100">{customer.name}</div>
                  {customer.phone && <div className="text-zinc-400">{customer.phone}</div>}
                  {order.shipping_address && <div className="text-zinc-400 mt-2">{JSON.stringify(order.shipping_address)}</div>}
                </>
              ) : (
                <div className="text-zinc-500 italic">No customer linked</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="text-zinc-400">Provider: {order.shipping_provider || 'Not specified'}</div>
              <div className="text-zinc-400">
                Tracking: <span className="font-mono text-blue-400">{order.tracking_number || '—'}</span>
              </div>
            </CardContent>
          </Card>
          
          {order.notes && (
             <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="text-zinc-400 whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
