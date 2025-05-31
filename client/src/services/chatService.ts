import axios from 'axios';
import type { ChatRequest, Conversation, Message } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`;
      }
    } catch (error) {
      console.error('Failed to parse auth token:', error);
    }
  }
  return config;
});

export async function sendMessage(data: ChatRequest): Promise<{ message: Message; conversation?: Conversation }> {
  try {
    const response = await api.post('/chat/message', data);
    return response.data;
  } catch (error: any) {
    // Fallback to mock API if server is not available
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const mockAPI = (window as any).mockAPI;
      if (mockAPI) {
        return await mockAPI.sendMessage(data.message, data.conversationId);
      }
    }
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await api.get('/chat/conversations');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get conversations');
  }
}

export async function getConversation(id: string): Promise<Conversation> {
  try {
    const response = await api.get(`/chat/conversations/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get conversation');
  }
}

export async function createConversation(title?: string): Promise<Conversation> {
  try {
    const response = await api.post('/chat/conversations', { title });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create conversation');
  }
}

export async function updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation> {
  try {
    const response = await api.put(`/chat/conversations/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update conversation');
  }
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    await api.delete(`/chat/conversations/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete conversation');
  }
}

export async function deleteMessage(conversationId: string, messageId: string): Promise<void> {
  try {
    await api.delete(`/chat/conversations/${conversationId}/messages/${messageId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete message');
  }
}