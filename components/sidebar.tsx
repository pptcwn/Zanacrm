'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, MessageCircle,
  CheckSquare, Truck, DollarSign, Users, BarChart3, Shield,
  TrendingUp,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { href: '/', label: 'Owner Dashboard', icon: LayoutDashboard },
      { href: '/admin', label: 'Admin', icon: Shield },
      { href: '/sales', label: 'Sales', icon: TrendingUp },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/chat', label: 'Unified Chat', icon: MessageCircle },
      { href: '/tasks', label: 'Task Board', icon: CheckSquare },
      { href: '/inventory', label: 'Inventory', icon: Package },
      { href: '/shipping', label: 'Shipping', icon: Truck },
    ],
  },
  {
    title: 'Growth',
    items: [
      { href: '/commission', label: 'Commission', icon: DollarSign },
      { href: '/customers', label: 'Customers', icon: Users },
      { href: '/finance', label: 'Finance', icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-card border-r border-border flex-col">
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-lg font-bold">O</span>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">OMS</div>
          <div className="text-[11px] text-muted-foreground">Omni Channel</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-elevated hover:text-foreground'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-elevated px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            PN
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">Patchawin</div>
            <div className="flex items-center gap-1 text-[11px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Owner
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
