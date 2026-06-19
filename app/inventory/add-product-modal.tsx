'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProductSchema } from '@/lib/validations/product.schema'
import { z } from 'zod'
import { productService } from '@/lib/services/product.service'

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    cost: 0,
    stock_quantity: 0,
    low_stock_threshold: 10,
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        sku: '',
        price: 0,
        cost: 0,
        stock_quantity: 0,
        low_stock_threshold: 10,
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
      const validatedData = createProductSchema.parse(formData)
      await productService.create(validatedData)
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
        const message = err instanceof Error ? err.message : 'Failed to create product'
        setErrorMsg(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={fieldErrors.name}
          placeholder="e.g. Oversized T-Shirt"
        />

        <Input
          label="SKU (Stock Keeping Unit)"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          error={fieldErrors.sku}
          placeholder="e.g. TS-001"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Selling Price (฿)"
            min="0"
            value={formData.price === 0 ? '' : formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            error={fieldErrors.price}
          />
          <Input
            type="number"
            label="Cost (฿)"
            min="0"
            value={formData.cost === 0 ? '' : formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            error={fieldErrors.cost}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Initial Stock"
            min="0"
            value={formData.stock_quantity === 0 ? '' : formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
            error={fieldErrors.stock_quantity}
          />
          <Input
            type="number"
            label="Low Stock Threshold"
            min="0"
            value={formData.low_stock_threshold === 0 ? '' : formData.low_stock_threshold}
            onChange={(e) => setFormData({ ...formData, low_stock_threshold: Number(e.target.value) })}
            error={fieldErrors.low_stock_threshold}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
