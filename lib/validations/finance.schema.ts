import { z } from 'zod';

const financeTypes = ['income', 'expense', 'ad_spend'] as const;

export const createFinanceEntrySchema = z.object({
  type: z.enum(financeTypes),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().nullable().optional(),
  reference_id: z.string().uuid().nullable().optional(),
  date: z.string().default(() => new Date().toISOString().split('T')[0]),
});

export const updateFinanceEntrySchema = createFinanceEntrySchema.partial();

export type CreateFinanceEntry = z.infer<typeof createFinanceEntrySchema>;
export type UpdateFinanceEntry = z.infer<typeof updateFinanceEntrySchema>;
