import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tagService } from '../tag.service';

const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    from: (table: string) => mockFrom(table),
  }),
}));

describe('tagService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches all tags correctly', async () => {
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue({ data: [{ id: '1', name: 'VIP' }], error: null }),
    });
    const tags = await tagService.getTags();
    expect(tags).toEqual([{ id: '1', name: 'VIP' }]);
  });
});