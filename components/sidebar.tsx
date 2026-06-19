'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingCart, Package, MessageCircle, 
  CheckSquare, Truck, DollarSign, Users, BarChart3, Settings 
} from 'lucide-react';

const navItems = [
  { href: '/(dashboard)', label: 'Owner Dashboard', icon: LayoutDashboard },
  { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { href: '/sales', label: 'Sales Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/chat', label: 'Unified Chat', icon: MessageCircle },
  { href: '/tasks', label: 'Task Board', icon: CheckSquare },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/shipping', label: 'Shipping', icon: Truck },
  { href: '/commission', label: 'Commission', icon: DollarSign },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/finance', label: 'Finance', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <div>
            <div className="font-semibold text-xl tracking-tight">OMS</div>
            <div className="text-[10px] text-zinc-500 -mt-1">Omni Channel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive 
                  ? 'bg-zinc-800 text-white font-medium' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-800/50">
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-medium">
            PN
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Patchawin</div>
            <div className="text-[10px] text-emerald-500">Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}
