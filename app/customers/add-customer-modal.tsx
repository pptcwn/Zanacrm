'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createCustomerSchema } from '@/lib/validations/customer.schema'
import { z } from 'zod'
import { customerService } from '@/lib/services/customer.service'

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    segment: 'new',
    notes: '',
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        segment: 'new',
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
      const validatedData = createCustomerSchema.parse({
        ...formData,
        phone: formData.phone || null,
        email: formData.email || null,
        notes: formData.notes || null,
      })
      
      await customerService.create(validatedData)
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
        const message = err instanceof Error ? err.message : 'Failed to create customer'
        setErrorMsg(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500">
            {errorMsg}
          </div>
        )}

        <Input
          label="Customer Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={fieldErrors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={fieldErrors.phone}
          />
          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={fieldErrors.email}
          />
        </div>

        <Select
          label="Segment"
          value={formData.segment}
          onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
          options={[
            { value: 'new', label: 'New Customer' },
            { value: 'regular', label: 'Regular' },
            { value: 'vip', label: 'VIP' },
            { value: 'at_risk', label: 'At Risk' },
          ]}
          error={fieldErrors.segment}
        />

        <Input
          label="Internal Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g. Likes oversized clothes"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
