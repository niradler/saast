import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';

const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
  },
};

const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  mode: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#9ca3af',
    accent: '#8b5cf6',
    background: '#030712',
    surface: '#111827',
    text: '#f9fafb',
  },
};

const blueTheme: Theme = {
  id: 'blue',
  name: 'Ocean Blue',
  mode: 'dark',
  colors: {
    primary: '#0ea5e9',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
  },
};

const purpleTheme: Theme = {
  id: 'purple',
  name: 'Purple Rain',
  mode: 'dark',
  colors: {
    primary: '#8b5cf6',
    secondary: '#6b7280',
    accent: '#a855f7',
    background: '#1a0b2e',
    surface: '#2d1b69',
    text: '#f3f4f6',
  },
};

const availableThemes = [lightTheme, darkTheme, blueTheme, purpleTheme];

interface SettingsStore {
  // Settings state
  theme: Theme;
  language: string;
  notifications: boolean;
  autoSave: boolean;
  defaultModel: string;
  availableThemes: Theme[];

  // Actions
  setTheme: (theme: Theme) => void;
  setThemeById: (themeId: string) => void;
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
  setNotifications: (enabled: boolean) => void;
  setAutoSave: (enabled: boolean) => void;
  setDefaultModel: (model: string) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      language: 'en',
      notifications: true,
      autoSave: true,
      defaultModel: 'gpt-3.5-turbo',
      availableThemes,

      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.className = theme.mode;
      },

      setThemeById: (themeId: string) => {
        const theme = availableThemes.find((t) => t.id === themeId);
        if (theme) {
          get().setTheme(theme);
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme.mode === 'light' ? darkTheme : lightTheme;
        get().setTheme(newTheme);
      },

      setLanguage: (language: string) => {
        set({ language });
      },

      setNotifications: (notifications: boolean) => {
        set({ notifications });
      },

      setAutoSave: (autoSave: boolean) => {
        set({ autoSave });
      },

      setDefaultModel: (defaultModel: string) => {
        set({ defaultModel });
      },

      resetSettings: () => {
        set({
          theme: lightTheme,
          language: 'en',
          notifications: true,
          autoSave: true,
          defaultModel: 'gpt-3.5-turbo',
        });
        document.documentElement.className = 'light';
      },
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme when store is rehydrated
        if (state?.theme) {
          document.documentElement.className = state.theme.mode;
        }
      },
    }
  )
);