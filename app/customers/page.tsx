'use client';

const customers = [
  { id: 1, name: 'น้องมิ้น', orders: 12, spent: '฿48,200', lastOrder: '19 Jun', segment: 'Loyal' },
  { id: 2, name: 'คุณสมชาย', orders: 7, spent: '฿29,800', lastOrder: '18 Jun', segment: 'Regular' },
  { id: 3, name: 'คุณจันทร์', orders: 3, spent: '฿12,450', lastOrder: '10 Jun', segment: 'New' },
  { id: 4, name: 'คุณโจ', orders: 21, spent: '฿124,000', lastOrder: '17 Jun', segment: 'VIP' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted mt-1">Customer 360° — Understand your buyers</p>
        </div>
        <button className="btn btn-primary">+ Add Customer</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-sm text-muted">Total Customers</div>
          <div className="text-3xl font-semibold mt-1">4,821</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-muted">Active (30 days)</div>
          <div className="text-3xl font-semibold mt-1">1,284</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-muted">Avg Order Value</div>
          <div className="text-3xl font-semibold mt-1">฿2,840</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-muted">Repeat Rate</div>
          <div className="text-3xl font-semibold mt-1">38%</div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700 text-left">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total Orders</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Last Order</th>
              <th className="px-6 py-4">Segment</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-800/40">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4">{c.orders}</td>
                <td className="px-6 py-4 font-medium">{c.spent}</td>
                <td className="px-6 py-4 text-muted">{c.lastOrder}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    c.segment === 'VIP' ? 'badge-info' : 
                    c.segment === 'Loyal' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {c.segment}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline text-sm">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
