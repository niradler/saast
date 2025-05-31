// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'trial';
    expiresAt?: string;
  };
}

// Message and conversation types
export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  model: string;
  settings?: {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  };
}

// Theme related types
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  mode: 'light' | 'dark';
}

// Store state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppSettings {
  theme: Theme;
  language: string;
  notifications: boolean;
  autoSave: boolean;
  defaultModel: string;
}

// API related types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  model?: string;
  settings?: {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  };
}

// Content rendering types
export interface RenderableContent {
  type: 'text' | 'markdown' | 'mermaid' | 'code' | 'html';
  content: string;
  language?: string;
  metadata?: Record<string, any>;
}