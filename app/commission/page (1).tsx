'use client';

export default function CommissionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Commission</h1>
        <p className="text-muted mt-1">Track and manage sales team commissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="text-sm text-muted">Total Commission (This Month)</div>
          <div className="text-4xl font-semibold mt-2 tracking-tighter">฿124,800</div>
          <div className="text-emerald-500 text-sm mt-1">+18% from last month</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-muted">Pending Payout</div>
          <div className="text-4xl font-semibold mt-2 tracking-tighter">฿48,200</div>
          <div className="text-orange-500 text-sm mt-1">12 sales reps</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-muted">Avg Commission Rate</div>
          <div className="text-4xl font-semibold mt-2 tracking-tighter">8.4%</div>
        </div>
      </div>

      {/* Commission Table */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Sales Performance</h3>
          <button className="btn btn-secondary text-sm">Export Report</button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-left text-muted">
              <th className="py-3">Sales Rep</th>
              <th className="py-3">Orders Closed</th>
              <th className="py-3">Total Sales</th>
              <th className="py-3">Commission</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {[
              { name: 'นัท', orders: 87, sales: '฿892,000', commission: '฿71,360', status: 'Paid' },
              { name: 'บีม', orders: 64, sales: '฿654,000', commission: '฿52,320', status: 'Pending' },
              { name: 'ฟ้า', orders: 41, sales: '฿412,000', commission: '฿32,960', status: 'Pending' },
            ].map((rep, i) => (
              <tr key={i}>
                <td className="py-4 font-medium">{rep.name}</td>
                <td className="py-4">{rep.orders}</td>
                <td className="py-4">{rep.sales}</td>
                <td className="py-4 font-medium text-emerald-500">{rep.commission}</td>
                <td className="py-4">
                  <span className={`badge ${rep.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    {rep.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
