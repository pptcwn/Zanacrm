export default function SalesDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My Dashboard</h1>
        <p className="text-zinc-400">Welcome back, Sales Team</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">My Orders Today</div>
          <div className="text-4xl font-semibold mt-2">47</div>
          <div className="text-emerald-500 text-sm mt-1">+12 from yesterday</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">Active Chats</div>
          <div className="text-4xl font-semibold mt-2">9</div>
          <div className="text-orange-500 text-sm mt-1">3 need reply</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">My Commission (This Month)</div>
          <div className="text-4xl font-semibold mt-2">฿18,450</div>
          <div className="text-emerald-500 text-sm mt-1">+฿3,200</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400">Tasks Pending</div>
          <div className="text-4xl font-semibold mt-2">6</div>
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">My Orders (Today)</h3>
        <div className="space-y-3 text-sm">
          {[
            { id: "TK-1042", customer: "น้องมิ้น", amount: "฿2,450", status: "Processing" },
            { id: "SP-2911", customer: "คุณสมชาย", amount: "฿1,890", status: "Shipped" },
          ].map((order, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-zinc-800 rounded-xl">
              <div>
                <span className="font-mono text-blue-400">{order.id}</span> • {order.customer}
              </div>
              <div className="flex items-center gap-4">
                <span>{order.amount}</span>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-500">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Tasks Mini Kanban */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">My Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["To Do", "In Progress", "Completed"].map((col, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-xl">
              <div className="font-medium mb-3 text-sm">{col}</div>
              <div className="text-xs text-zinc-400">3 tasks</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
