'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
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
  const { profile } = useAuthStore();
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) 
    : '??';

  return (
    <aside className="hidden md:flex w-66 shrink-0 flex-col p-4 bg-background">
      {/* Floating HUD Container */}
      <div 
        style={{
          backgroundColor: 'var(--hud-bg)',
          backdropFilter: 'var(--hud-blur)',
          borderColor: 'var(--hud-border)',
          boxShadow: 'var(--shadow-hud)',
        }}
        className="flex-1 flex flex-col rounded-2xl border transition-all duration-300"
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-[var(--hud-border)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold tracking-tight">Z</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[-0.02em]">ZANA</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.05em]">managements</div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
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
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive
                          ? 'bg-primary/8 text-primary font-semibold border border-primary/20 shadow-sm shadow-primary/5'
                          : 'text-muted-foreground hover:bg-white/3 hover:text-foreground border border-transparent'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile section */}
        <div className="border-t border-[var(--hud-border)] p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/3 px-3 py-2 border border-white/3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold">{profile?.full_name || '...'}</div>
              <div className="flex items-center gap-1 text-[9px] text-success/90 font-medium">
                <span className="h-1 w-1 rounded-full bg-success" />
                <span className="capitalize">{profile?.role || 'user'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
