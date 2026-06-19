import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatStore } from '../chatStore';

const mockUnsubscribe = vi.fn();
const mockSubscribe = vi.fn().mockReturnThis();
const mockOn = vi.fn().mockReturnThis();

const mockChannel = vi.fn().mockReturnValue({
  on: mockOn,
  subscribe: mockSubscribe,
  unsubscribe: mockUnsubscribe,
});

vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    channel: (name: string) => mockChannel(name),
  }),
}));

describe('chatStore realtime subscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState({
      conversations: [],
      messages: {},
      activeConversationId: null,
      subscriptionRef: null,
    });
  });

  it('subscribes to both messages and conversations, and unsubscribe cleans them up', () => {
    useChatStore.getState().subscribeToMessages('conv-123');

    // Should create two channels
    expect(mockChannel).toHaveBeenCalledWith('messages:conv-123');
    expect(mockChannel).toHaveBeenCalledWith('conversations-realtime');

    // Should bind to postgres_changes
    expect(mockOn).toHaveBeenCalledTimes(2);
    expect(mockOn).toHaveBeenNthCalledWith(
      1,
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'conversation_id=eq.conv-123',
      },
      expect.any(Function)
    );
    expect(mockOn).toHaveBeenNthCalledWith(
      2,
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
      },
      expect.any(Function)
    );

    // subscriptionRef should store both subscriptions
    const subRef = useChatStore.getState().subscriptionRef;
    expect(Array.isArray(subRef)).toBe(true);
    expect(subRef).toHaveLength(2);

    // Calling unsubscribe should clean them up
    useChatStore.getState().unsubscribeFromMessages();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
    expect(useChatStore.getState().subscriptionRef).toBeNull();
  });

  it('updates and sorts conversations by updated_at descending on conversations UPDATE payload', () => {
    // Set initial conversations
    const initialConversations = [
      { id: '1', last_message: 'Hi', updated_at: '2026-06-20T01:00:00Z' },
      { id: '2', last_message: 'Hello', updated_at: '2026-06-20T02:00:00Z' },
    ];
    useChatStore.setState({ conversations: initialConversations as any });

    let conversationUpdateCallback: Function = () => {};

    // Capture the callback passed to on()
    mockOn.mockImplementation((event, filter, callback) => {
      if (filter.table === 'conversations') {
        conversationUpdateCallback = callback;
      }
      return {
        on: mockOn,
        subscribe: mockSubscribe,
        unsubscribe: mockUnsubscribe,
      };
    });

    useChatStore.getState().subscribeToMessages('conv-123');

    expect(conversationUpdateCallback).toBeDefined();

    // Trigger update payload for conversation 1 with a new updated_at that puts it at the top
    conversationUpdateCallback({
      new: {
        id: '1',
        last_message: 'New message',
        updated_at: '2026-06-20T03:00:00Z',
      },
    });

    // Check state
    const updatedConversations = useChatStore.getState().conversations;
    expect(updatedConversations).toHaveLength(2);
    
    // Conversation 1 should be updated and sorted first (updated_at: 03:00:00 > 02:00:00)
    expect(updatedConversations[0].id).toBe('1');
    expect(updatedConversations[0].last_message).toBe('New message');
    expect(updatedConversations[0].updated_at).toBe('2026-06-20T03:00:00Z');

    expect(updatedConversations[1].id).toBe('2');
    expect(updatedConversations[1].updated_at).toBe('2026-06-20T02:00:00Z');
  });
});
