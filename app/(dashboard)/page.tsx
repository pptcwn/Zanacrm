import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header with better hierarchy */}
      <div className="pt-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-[-0.04em]">Good morning, Patchawin</h1>
        </div>
        <p className="text-lg text-zinc-400 mt-2">Here&apos;s a clear overview of your multi-channel business today.</p>
      </div>

      {/* KPI Cards - Improved breathing room and hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Today's Revenue", value: "฿124,580", change: "+12.4%", icon: DollarSign, color: "text-emerald-500" },
          { title: "Orders", value: "187", change: "+8%", icon: ShoppingCart, color: "text-blue-500" },
          { title: "Net Profit", value: "฿42,350", change: "+23%", icon: TrendingUp, color: "text-emerald-500" },
          { title: "Active Customers", value: "1,284", change: "+5%", icon: Users, color: "text-violet-500" },
        ].map((kpi, index) => (
          <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-6">
              <CardTitle className="text-sm font-medium text-zinc-400 tracking-wide">{kpi.title}</CardTitle>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-4xl font-bold tracking-[-0.04em]">{kpi.value}</div>
              <p className="text-sm text-emerald-500 mt-2 font-medium">{kpi.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-zinc-500">
            Revenue Trend Chart (Recharts / Chart.js)
          </CardContent>
        </Card>

        {/* Channel Performance */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Sales by Channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Shopee", value: "48%", color: "bg-orange-500" },
              { name: "TikTok Shop", value: "32%", color: "bg-black" },
              { name: "Facebook", value: "20%", color: "bg-blue-600" },
            ].map((channel, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${channel.color}`} />
                  <span>{channel.name}</span>
                </div>
                <span className="font-mono font-medium">{channel.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-zinc-500">
        Last updated: Just now • Real-time data synced from all platforms
      </div>
    </div>
  );
}