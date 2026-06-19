import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const items = [
    { name: 'เสื้อยืด Oversize', sku: 'TS-001', qty: 2, price: 590 },
    { name: 'กางเกงยีนส์ Slim', sku: 'JN-045', qty: 1, price: 1270 },
  ];
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const shipping = 40;
  const total = subtotal + shipping;

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
          <h1 className="font-mono text-3xl font-semibold tracking-tight text-blue-400">{id}</h1>
          <p className="mt-1 text-zinc-400">Placed on 19 Jun 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="processing" />
          <Button variant="secondary" size="sm">
            Print Invoice
          </Button>
          <Button size="sm">Update Status</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between rounded-xl bg-zinc-950 p-4 text-sm"
              >
                <div>
                  <div className="font-medium text-zinc-100">{item.name}</div>
                  <div className="font-mono text-xs text-zinc-500">{item.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-300">
                    {item.qty} × ฿{item.price.toLocaleString()}
                  </div>
                  <div className="font-medium text-zinc-100">
                    ฿{(item.qty * item.price).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span>฿{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-zinc-100">
                <span>Total</span>
                <span>฿{total.toLocaleString()}</span>
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
              <div className="font-medium text-zinc-100">น้องมิ้น</div>
              <div className="text-zinc-400">081-234-5678</div>
              <div className="text-zinc-400">123 ถ.สุขุมวิท กรุงเทพฯ 10110</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="text-zinc-400">Provider: Kerry Express</div>
              <div className="text-zinc-400">
                Tracking: <span className="font-mono text-blue-400">—</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
