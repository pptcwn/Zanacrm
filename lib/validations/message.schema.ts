import { z } from 'zod';

const senderRoles = ['customer', 'agent', 'system'] as const;
const tagCategories = ['user', 'order'] as const;

export const sendMessageSchema = z.object({
  conversation_id: z.string().uuid(),
  sender_type: z.enum(senderRoles).default('agent'),
  sender_id: z.string().uuid().nullable().optional(),
  content: z.string().min(1, 'Message cannot be empty'),
});

export const createTagSchema = z.object({
  message_id: z.string().uuid(),
  tag_type: z.enum(tagCategories),
  reference_id: z.string().uuid(),
  display_text: z.string().min(1),
});

export type SendMessage = z.infer<typeof sendMessageSchema>;
export type CreateTag = z.infer<typeof createTagSchema>;
