export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-zinc-400">System Overview & Operations</p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">TikTok Shop</div>
          <div className="text-2xl font-semibold mt-2 text-emerald-500">Connected</div>
          <div className="text-xs text-emerald-500 mt-1">Last sync: 2 mins ago</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">Shopee</div>
          <div className="text-2xl font-semibold mt-2 text-emerald-500">Connected</div>
          <div className="text-xs text-emerald-500 mt-1">Last sync: 1 min ago</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">Facebook</div>
          <div className="text-2xl font-semibold mt-2 text-orange-500">Partial</div>
          <div className="text-xs text-orange-500 mt-1">Webhook issue detected</div>
        </div>
      </div>

      {/* Order Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Order Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-semibold">1,284</div>
            <div className="text-sm text-zinc-400">Total Orders Today</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-amber-500">312</div>
            <div className="text-sm text-zinc-400">Pending</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-blue-500">567</div>
            <div className="text-sm text-zinc-400">Processing</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-emerald-500">405</div>
            <div className="text-sm text-zinc-400">Shipped</div>
          </div>
        </div>
      </div>

      {/* Stock Alert */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl">
            <div>กางเกงยีนส์ Slim (JN-045)</div>
            <div className="text-orange-500">42 left</div>
          </div>
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-xl">
            <div>รองเท้าผ้าใบ (SN-112)</div>
            <div className="text-red-500">8 left • Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
}
