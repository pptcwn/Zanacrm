import { describe, it, expect, vi, beforeEach } from 'vitest';
import { quickReplyService } from '../quick-reply.service';

const mockOrder = vi.fn();
const mockSelect = vi.fn(() => ({
  order: mockOrder,
}));
const mockFrom = vi.fn((_table?: string) => ({
  select: mockSelect,
}));

vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    from: (table: string) => mockFrom(table),
  }),
}));

describe('quickReplyService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches quick reply templates ordered by shortcut', async () => {
    const mockData = [
      { id: '1', shortcut: '/hello', title: 'Greeting', content: 'Hello!', created_at: '2026-06-19T00:00:00Z' },
      { id: '2', shortcut: '/thanks', title: 'Thanks', content: 'Thank you!', created_at: '2026-06-19T00:00:00Z' },
    ];

    mockOrder.mockResolvedValueOnce({ data: mockData, error: null });

    const result = await quickReplyService.getAll();

    expect(mockFrom).toHaveBeenCalledWith('quick_reply_templates');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('shortcut', { ascending: true });
    expect(result).toEqual(mockData);
  });

  it('throws an error if the query fails', async () => {
    const mockError = new Error('Database error');
    mockOrder.mockResolvedValueOnce({ data: null, error: mockError });

    await expect(quickReplyService.getAll()).rejects.toThrow('Database error');
  });
});
