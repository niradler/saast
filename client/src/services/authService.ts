import axios from 'axios';
import type { LoginRequest, RegisterRequest, User, ApiResponse } from '../types';

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

export async function login(data: LoginRequest): Promise<{ user: User; token: string }> {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    // Fallback to mock API if server is not available
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const mockAPI = (window as any).mockAPI;
      if (mockAPI) {
        return await mockAPI.login(data.email, data.password);
      }
    }
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function register(data: RegisterRequest): Promise<{ user: User; token: string }> {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    // Fallback to mock API if server is not available
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const mockAPI = (window as any).mockAPI;
      if (mockAPI) {
        return await mockAPI.register(data.name, data.email, data.password);
      }
    }
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Handle logout error silently
    console.error('Logout error:', error);
  }
}

export async function refreshToken(): Promise<{ token: string }> {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
}

export async function getUserProfile(): Promise<User> {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  try {
    const response = await api.put('/auth/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
}