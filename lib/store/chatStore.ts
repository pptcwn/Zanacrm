import { create } from 'zustand';
import { Database } from '@/types/database.types';
import { chatService } from '@/lib/services/chat.service';
import { tagService } from '@/lib/services/tag.service';
import { quickReplyService } from '@/lib/services/quick-reply.service';
import { createBrowserClient } from '@/lib/supabase/client';

type ConversationRow = Database['public']['Tables']['conversations']['Row'] & { customers?: any };
type MessageRow = Database['public']['Tables']['messages']['Row'];

interface ChatState {
  conversations: ConversationRow[];
  messages: Record<string, MessageRow[]>; // Indexed by conversation_id
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  subscriptionRef: any | null; // Keep track of the current subscription
  customerTags: Record<string, any[]>;
  templates: Database['public']['Tables']['quick_reply_templates']['Row'][];
  fetchTemplates: () => Promise<void>;

  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, senderType: 'agent' | 'system' | 'customer', senderId?: string) => Promise<void>;
  subscribeToMessages: (conversationId: string) => void;
  unsubscribeFromMessages: () => void;
  fetchCustomerTags: (customerId: string) => Promise<void>;
  addCustomerTag: (customerId: string, tagId: string) => Promise<void>;
  removeCustomerTag: (customerId: string, tagId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  isLoading: false,
  error: null,
  subscriptionRef: null,
  customerTags: {},
  templates: [],

  setActiveConversation: (id) => set({ activeConversationId: id }),

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await chatService.getConversations();
      set({ conversations: data as ConversationRow[] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await chatService.getMessages(conversationId);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: data,
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (conversationId, content, senderType, senderId) => {
    try {
      const newMessage = await chatService.sendMessage({
        conversation_id: conversationId,
        content,
        sender_type: senderType,
        sender_id: senderId,
      });

      // Optimistic update
      set((state) => {
        const existingMessages = state.messages[conversationId] || [];
        if (existingMessages.find((m) => m.id === newMessage.id)) return state;
        
        return {
          messages: {
            ...state.messages,
            [conversationId]: [...existingMessages, newMessage],
          },
        };
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchCustomerTags: async (customerId: string) => {
    try {
      const data = await tagService.getCustomerTags(customerId);
      set((state) => ({
        customerTags: {
          ...state.customerTags,
          [customerId]: data,
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  addCustomerTag: async (customerId: string, tagId: string) => {
    try {
      await tagService.addCustomerTag(customerId, tagId);
      const data = await tagService.getCustomerTags(customerId);
      set((state) => ({
        customerTags: {
          ...state.customerTags,
          [customerId]: data,
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  removeCustomerTag: async (customerId: string, tagId: string) => {
    try {
      await tagService.removeCustomerTag(customerId, tagId);
      const data = await tagService.getCustomerTags(customerId);
      set((state) => ({
        customerTags: {
          ...state.customerTags,
          [customerId]: data,
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  subscribeToMessages: (conversationId: string) => {
    const supabase = createBrowserClient();
    
    get().unsubscribeFromMessages();

    const messagesSub = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          const newMessage = payload.new as MessageRow;
          set((state) => {
            const existingMessages = state.messages[conversationId] || [];
            if (existingMessages.find((m) => m.id === newMessage.id)) return state;
            return {
              messages: {
                ...state.messages,
                [conversationId]: [...existingMessages, newMessage],
              },
            };
          });
        }
      )
      .subscribe();

    const conversationsSub = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        (payload: any) => {
          set((state) => {
            const updatedConversations = state.conversations.map((c) =>
              c.id === payload.new.id ? { ...c, ...payload.new } : c
            );
            // Sort conversations by updated_at descending
            updatedConversations.sort((a, b) => {
              const dateA = new Date(a.updated_at || 0).getTime();
              const dateB = new Date(b.updated_at || 0).getTime();
              return dateB - dateA;
            });
            return { conversations: updatedConversations };
          });
        }
      )
      .subscribe();

    set({ subscriptionRef: [messagesSub, conversationsSub] });
  },

  unsubscribeFromMessages: () => {
    const { subscriptionRef } = get();
    if (subscriptionRef) {
      if (Array.isArray(subscriptionRef)) {
        subscriptionRef.forEach((sub) => sub?.unsubscribe?.());
      } else if (typeof subscriptionRef.unsubscribe === 'function') {
        subscriptionRef.unsubscribe();
      }
      set({ subscriptionRef: null });
    }
  },

  fetchTemplates: async () => {
    try {
      const data = await quickReplyService.getAll();
      set({ templates: data });
    } catch (err: any) {
      console.error(err);
    }
  },
}));
