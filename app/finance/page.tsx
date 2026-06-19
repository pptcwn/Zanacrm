'use client';

import { useState } from 'react';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cost' | 'ad' | 'report'>('overview');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Finance</h1>
        <p className="text-zinc-400">Profit, Cost & Ad Spend Management</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'cost', label: 'Cost Recording' },
          { key: 'ad', label: 'Ad Campaigns' },
          { key: 'report', label: 'P&L Reports' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'cost' | 'ad' | 'report')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key 
                ? 'border-blue-500 text-white' 
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Revenue vs Cost vs Profit</h3>
            <div className="h-80 flex items-center justify-center text-zinc-500">
              Line Chart (Revenue / Cost / Profit)
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Net Profit Margin</span> <span className="font-medium text-emerald-500">34.2%</span></div>
              <div className="flex justify-between"><span>Ad ROI</span> <span className="font-medium">3.8x</span></div>
              <div className="flex justify-between"><span>Total Ad Spend</span> <span className="font-medium">฿48,200</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Recording Tab */}
      {activeTab === 'cost' && (
        <div className="max-w-2xl">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Record New Cost</h3>
            <form className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Cost Type</label>
                <select className="w-full mt-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5">
                  <option>COGS (ต้นทุนสินค้า)</option>
                  <option>Ad Spend (ยิงโฆษณา)</option>
                  <option>Shipping</option>
                  <option>Platform Fee</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400">Amount (฿)</label>
                  <input type="number" className="w-full mt-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Date</label>
                  <input type="date" className="w-full mt-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5" />
                </div>
              </div>
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium">Save Cost Entry</button>
            </form>
          </div>
        </div>
      )}

      {/* Ad Campaigns Tab */}
      {activeTab === 'ad' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Ad Campaigns</h3>
            <button className="text-sm px-4 py-2 bg-white text-black rounded-xl">+ Add Campaign</button>
          </div>
          <div className="text-sm text-zinc-400">Upload CSV from TikTok Ads / Facebook Ads / Google Ads</div>
        </div>
      )}

      {/* P&L Reports Tab */}
      {activeTab === 'report' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Profit & Loss Report</h3>
          <button className="px-5 py-2.5 bg-white text-black rounded-xl text-sm">Export Excel / PDF</button>
        </div>
      )}
    </div>
  );
}
