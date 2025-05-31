import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message } from '../types';
import { generateId } from '../utils';

interface ChatStore {
  // Chat state
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversationId: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  deleteConversation: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  createNewConversation: (title?: string) => string;
  getActiveConversation: () => Conversation | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isLoading: false,
      error: null,

      setConversations: (conversations: Conversation[]) => {
        set({ conversations });
      },

      setActiveConversation: (conversationId: string | null) => {
        set({ activeConversationId: conversationId });
      },

      addConversation: (conversation: Conversation) => {
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        }));
      },

      updateConversation: (conversationId: string, updates: Partial<Conversation>) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, ...updates, updatedAt: new Date().toISOString() }
              : conv
          ),
        }));
      },

      deleteConversation: (conversationId: string) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== conversationId),
          activeConversationId:
            state.activeConversationId === conversationId ? null : state.activeConversationId,
        }));
      },

      addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date().toISOString(),
              }
              : conv
          ),
        }));
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date().toISOString(),
              }
              : conv
          ),
        }));
      },

      deleteMessage: (conversationId: string, messageId: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                ...conv,
                messages: conv.messages.filter((msg) => msg.id !== messageId),
                updatedAt: new Date().toISOString(),
              }
              : conv
          ),
        }));
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      createNewConversation: (title?: string): string => {
        const conversationId = generateId();
        const now = new Date().toISOString();

        const newConversation: Conversation = {
          id: conversationId,
          userId: '', // Will be set by the component
          title: title || 'New Conversation',
          messages: [],
          createdAt: now,
          updatedAt: now,
          model: 'gpt-3.5-turbo',
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: conversationId,
        }));

        return conversationId;
      },

      getActiveConversation: (): Conversation | null => {
        const { conversations, activeConversationId } = get();
        return conversations.find((conv) => conv.id === activeConversationId) || null;
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);