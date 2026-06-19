import { z } from 'zod';

const commissionStatuses = ['pending', 'approved', 'paid'] as const;

export const createCommissionSchema = z.object({
  sales_id: z.string().uuid(),
  order_id: z.string().uuid(),
  amount: z.number().min(0),
  rate: z.number().min(0).max(1),
  status: z.enum(commissionStatuses).default('pending'),
  period: z.string().min(1, 'Period is required'),
});

export const approveCommissionSchema = z.object({
  status: z.enum(['approved', 'paid'] as const),
});

export type CreateCommission = z.infer<typeof createCommissionSchema>;
export type ApproveCommission = z.infer<typeof approveCommissionSchema>;
