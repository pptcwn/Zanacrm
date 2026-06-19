'use client';

import { Search, Bell, Plus } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-14 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 flex items-center px-6 justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <label htmlFor="global-search" className="sr-only">Search orders, customers, or products</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input
            id="global-search"
            type="text"
            placeholder="Search orders, customers, products..."
            aria-label="Search orders, customers, or products"
            className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Quick Add
        </button>

        <button 
          aria-label="View notifications" 
          className="relative p-2 hover:bg-zinc-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
        >
          <Bell className="w-5 h-5 text-zinc-400" aria-hidden="true" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
          <span className="sr-only">3 unread notifications</span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
          <div className="text-right text-sm leading-tight">
            <div className="font-medium">Patchawin</div>
            <div className="text-[10px] text-zinc-500">Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}
