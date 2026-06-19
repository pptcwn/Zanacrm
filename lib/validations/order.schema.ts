import { z } from 'zod';

const orderChannels = ['tiktok', 'shopee', 'facebook', 'lazada'] as const;
const orderStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const;

export const createOrderSchema = z.object({
  channel: z.enum(orderChannels),
  customer_id: z.string().uuid().nullable().optional(),
  sales_id: z.string().uuid().nullable().optional(),
  status: z.enum(orderStatuses).default('pending'),
  subtotal: z.number().min(0).default(0),
  shipping_cost: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total_amount: z.number().min(0).default(0),
  shipping_address: z.any().nullable().optional(),
  tracking_number: z.string().nullable().optional(),
  shipping_provider: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
});

export const createOrderItemSchema = z.object({
  order_id: z.string().uuid(),
  product_id: z.string().uuid().nullable().optional(),
  product_name: z.string().min(1),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0),
  total: z.number().min(0),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
export type CreateOrderItem = z.infer<typeof createOrderItemSchema>;
