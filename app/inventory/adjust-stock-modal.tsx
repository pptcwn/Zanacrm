'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { productService } from '@/lib/services/product.service'
import { Database } from '@/types/database.types'

type ProductRow = Database['public']['Tables']['products']['Row']

interface AdjustStockModalProps {
  product: ProductRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdjustStockModal({ product, isOpen, onClose }: AdjustStockModalProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [adjustment, setAdjustment] = useState<number | ''>('')
  
  const currentStock = product?.stock_quantity || 0
  const adjValue = typeof adjustment === 'number' ? adjustment : 0
  const newStock = currentStock + adjValue

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || typeof adjustment !== 'number' || adjustment === 0) return

    setLoading(true)
    setErrorMsg('')

    try {
      await productService.update(product.id, {
        stock_quantity: newStock
      })
      onClose()
      setAdjustment('')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust stock')
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adjust Stock" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-1 mb-4">
          <div className="font-medium text-white">{product.name}</div>
          <div className="text-sm font-mono text-zinc-500">{product.sku}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Current</div>
            <div className="text-xl font-semibold text-white">{currentStock}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">New Stock</div>
            <div className={`text-xl font-semibold ${adjValue > 0 ? 'text-emerald-400' : adjValue < 0 ? 'text-orange-400' : 'text-white'}`}>
              {newStock}
            </div>
          </div>
        </div>

        <Input
          type="number"
          label="Adjustment Amount (+ or -)"
          value={adjustment}
          onChange={(e) => setAdjustment(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="e.g. 10 or -5"
        />
        <p className="text-xs text-zinc-500">Use positive numbers to add stock, negative to deduct.</p>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || adjustment === '' || adjustment === 0}>
            {loading ? 'Saving...' : 'Save Adjustment'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
