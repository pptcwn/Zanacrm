import { z } from 'zod';

const customerSegments = ['vip', 'regular', 'new', 'at_risk'] as const;

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().nullable().optional(),
  email: z.string().email('Invalid email').nullable().optional(),
  segment: z.enum(customerSegments).default('new'),
  platforms: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
