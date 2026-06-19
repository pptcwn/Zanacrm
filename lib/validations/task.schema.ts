import { z } from 'zod';

const taskStates = ['todo', 'in_progress', 'review', 'completed'] as const;
const taskPriorities = ['low', 'medium', 'high', 'urgent'] as const;

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  status: z.enum(taskStates).default('todo'),
  priority: z.enum(taskPriorities).default('medium'),
  assigned_to: z.string().uuid().nullable().optional(),
  order_id: z.string().uuid().nullable().optional(),
  labels: z.array(z.string()).default([]),
  due_date: z.string().nullable().optional(),
  position: z.number().int().min(0).default(0),
});

export const updateTaskSchema = createTaskSchema.partial();

export const reorderTaskSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(taskStates),
  position: z.number().int().min(0),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type ReorderTask = z.infer<typeof reorderTaskSchema>;
