'use client';

import { Search, Bell, Plus } from 'lucide-react';

export function TopBar() {
  return (
    <header className="px-4 pt-4 pb-2 bg-background shrink-0">
      {/* Floating HUD Glass container */}
      <div 
        style={{
          backgroundColor: 'var(--hud-bg)',
          backdropFilter: 'var(--hud-blur)',
          borderColor: 'var(--hud-border)',
          boxShadow: 'var(--shadow-hud)',
        }}
        className="h-14 rounded-2xl border flex items-center px-4 justify-between transition-all"
      >
        <div className="flex items-center gap-4 flex-1 max-w-sm">
          <div className="relative w-full">
            <label htmlFor="global-search" className="sr-only">Search orders, customers, or products</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" aria-hidden="true" />
            <input
              id="global-search"
              type="text"
              placeholder="Search orders, customers, products..."
              aria-label="Search orders, customers, or products"
              className="w-full bg-white/3 border border-transparent pl-9 pr-4 py-1.5 text-xs rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder-zinc-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Add with minimal accent style */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm shadow-primary/10">
            <Plus className="w-3.5 h-3.5" />
            Quick Add
          </button>

          {/* Translucent Notifications */}
          <button 
            aria-label="View notifications" 
            className="relative p-2 hover:bg-white/5 text-zinc-400 hover:text-foreground rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full" aria-hidden="true" />
            <span className="sr-only">3 unread notifications</span>
          </button>

          {/* Profile Details */}
          <div className="flex items-center gap-2 pl-3 border-l border-[var(--hud-border)]">
            <div className="text-right text-xs leading-tight">
              <div className="font-semibold">Patchawin</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Owner</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
