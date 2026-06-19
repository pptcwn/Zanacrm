'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createOrderSchema } from '@/lib/validations/order.schema'
import { z } from 'zod'
import { orderService } from '@/lib/services/order.service'

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    channel: 'facebook',
    status: 'pending',
    subtotal: 0,
    shipping_cost: 0,
    discount: 0,
    notes: '',
  })

  // Auto calculate total
  const total_amount = Math.max(0, formData.subtotal + formData.shipping_cost - formData.discount)

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        channel: 'facebook',
        status: 'pending',
        subtotal: 0,
        shipping_cost: 0,
        discount: 0,
        notes: '',
      })
      setFieldErrors({})
      setErrorMsg('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setFieldErrors({})

    try {
      const validatedData = createOrderSchema.parse({
        ...formData,
        total_amount,
      })
      
      await orderService.create(validatedData)
      // Since useOrderStore has real-time subscription, it will auto-update the list!
      onClose()
    } catch (err: any) {
      if (err instanceof z.ZodError || err.errors) {
        const errors: Record<string, string> = {}
        const zodErr = err as any
        zodErr.errors.forEach((e: any) => {
          if (e.path[0]) errors[e.path[0].toString()] = e.message
        })
        setFieldErrors(errors)
      } else {
        const message = err instanceof Error ? err.message : 'Failed to create order'
        setErrorMsg(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Manual Order" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Channel"
            value={formData.channel}
            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
            options={[
              { value: 'facebook', label: 'Facebook' },
              { value: 'tiktok', label: 'TikTok' },
              { value: 'shopee', label: 'Shopee' },
              { value: 'lazada', label: 'Lazada' },
            ]}
            error={fieldErrors.channel}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
            ]}
            error={fieldErrors.status}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            type="number"
            label="Subtotal (฿)"
            min="0"
            value={formData.subtotal === 0 ? '' : formData.subtotal}
            onChange={(e) => setFormData({ ...formData, subtotal: Number(e.target.value) })}
            error={fieldErrors.subtotal}
          />
          <Input
            type="number"
            label="Shipping (฿)"
            min="0"
            value={formData.shipping_cost === 0 ? '' : formData.shipping_cost}
            onChange={(e) => setFormData({ ...formData, shipping_cost: Number(e.target.value) })}
            error={fieldErrors.shipping_cost}
          />
          <Input
            type="number"
            label="Discount (฿)"
            min="0"
            value={formData.discount === 0 ? '' : formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
            error={fieldErrors.discount}
          />
        </div>

        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-800 flex justify-between items-center">
          <span className="text-zinc-400 text-sm">Total Amount</span>
          <span className="text-xl font-bold text-white">฿{total_amount.toLocaleString()}</span>
        </div>

        <Input
          label="Internal Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g. VIP customer, needs fast shipping"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
