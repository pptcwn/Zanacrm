'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/top-bar';
import { useFinanceStore } from '@/lib/store/financeStore';
import { Plus, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Megaphone, Trash2 } from 'lucide-react';
import { AddEntryModal } from './add-entry-modal';

export default function FinancePage() {
  const { entries, fetchEntries, deleteEntry, isLoading, error } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalAdSpend = entries.filter(e => e.type === 'ad_spend').reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpense - totalAdSpend;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setDeletingId(id);
      try {
        await deleteEntry(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Finance Tracker</h1>
            <p className="text-zinc-400 mt-1 text-sm">Manage operational income, expenses, and ad spend</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm h-10 px-4 text-sm bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Net Balance */}
          <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] shadow-xl flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <div className="p-1.5 rounded-lg bg-zinc-500/10 text-zinc-400">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Net Balance</span>
            </div>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
              ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Income */}
          <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] shadow-xl flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Income</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Expense */}
          <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] shadow-xl flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingDown className="w-12 h-12 text-rose-500" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Expense</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Ad Spend */}
          <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] shadow-xl flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Megaphone className="w-12 h-12 text-amber-500" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Megaphone className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Ad Spend</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${totalAdSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

        </div>

        {/* Table Area */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-[#141414] border-b border-[#1f1f1f]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {isLoading && entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        Loading entries...
                      </div>
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      No financial entries found.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize tracking-wider border ${
                          entry.type === 'income' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : entry.type === 'expense'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {entry.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {entry.category}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">
                        {entry.description || '-'}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${
                        entry.type === 'income' ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {entry.type === 'income' ? '+' : '-'}
                        ${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 inline-flex items-center justify-center"
                          title="Delete Entry"
                        >
                          {deletingId === entry.id ? (
                            <div className="w-4 h-4 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
