// Environment configuration with type safety and validation
interface AppConfig {
  // Environment
  nodeEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  
  // API
  apiBaseUrl: string;
  apiTimeout: number;
  enableMockApi: boolean;
  
  // Application
  appName: string;
  appVersion: string;
  appDescription: string;
  
  // Features
  features: {
    voiceRecording: boolean;
    fileUpload: boolean;
    analytics: boolean;
    errorReporting: boolean;
  };
  
  // Analytics
  analytics: {
    googleAnalyticsId?: string;
    mixpanelToken?: string;
  };
  
  // Error Reporting
  errorReporting: {
    sentryDsn?: string;
    sentryEnvironment?: string;
  };
  
  // Storage
  storage: {
    prefix: string;
    maxConversations: number;
    maxMessagesPerConversation: number;
  };
  
  // UI/UX
  ui: {
    defaultTheme: 'light' | 'dark';
    enableThemePersistence: boolean;
    animationDuration: number;
  };
  
  // Security
  security: {
    enableCsp: boolean;
    allowedOrigins: string[];
  };
}

// Helper function to safely get environment variables
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return value || defaultValue || '';
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

function getEnvArray(key: string, defaultValue: string[] = []): string[] {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

// Create and export configuration
export const config: AppConfig = {
  // Environment
  nodeEnv: (getEnvVar('VITE_NODE_ENV', 'development') as AppConfig['nodeEnv']),
  isDevelopment: getEnvVar('VITE_NODE_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_NODE_ENV', 'development') === 'production',
  
  // API
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 10000),
  enableMockApi: getEnvBoolean('VITE_ENABLE_MOCK_API', true),
  
  // Application
  appName: getEnvVar('VITE_APP_NAME', 'Saast'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  appDescription: getEnvVar('VITE_APP_DESCRIPTION', 'Modern AI Chat SaaS Template'),
  
  // Features
  features: {
    voiceRecording: getEnvBoolean('VITE_ENABLE_VOICE_RECORDING', false),
    fileUpload: getEnvBoolean('VITE_ENABLE_FILE_UPLOAD', false),
    analytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
    errorReporting: getEnvBoolean('VITE_ENABLE_ERROR_REPORTING', false),
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: getEnvVar('VITE_GOOGLE_ANALYTICS_ID') || undefined,
    mixpanelToken: getEnvVar('VITE_MIXPANEL_TOKEN') || undefined,
  },
  
  // Error Reporting
  errorReporting: {
    sentryDsn: getEnvVar('VITE_SENTRY_DSN') || undefined,
    sentryEnvironment: getEnvVar('VITE_SENTRY_ENVIRONMENT') || undefined,
  },
  
  // Storage
  storage: {
    prefix: getEnvVar('VITE_STORAGE_PREFIX', 'saast_'),
    maxConversations: getEnvNumber('VITE_MAX_CONVERSATIONS', 100),
    maxMessagesPerConversation: getEnvNumber('VITE_MAX_MESSAGES_PER_CONVERSATION', 1000),
  },
  
  // UI/UX
  ui: {
    defaultTheme: (getEnvVar('VITE_DEFAULT_THEME', 'light') as 'light' | 'dark'),
    enableThemePersistence: getEnvBoolean('VITE_ENABLE_THEME_PERSISTENCE', true),
    animationDuration: getEnvNumber('VITE_ANIMATION_DURATION', 300),
  },
  
  // Security
  security: {
    enableCsp: getEnvBoolean('VITE_ENABLE_CSP', true),
    allowedOrigins: getEnvArray('VITE_ALLOWED_ORIGINS', ['http://localhost:5173']),
  },
};

// Validation function
export function validateConfig(): void {
  const errors: string[] = [];
  
  if (!config.apiBaseUrl) {
    errors.push('API_BASE_URL is required');
  }
  
  if (!config.appName) {
    errors.push('APP_NAME is required');
  }
  
  if (config.features.analytics && !config.analytics.googleAnalyticsId && !config.analytics.mixpanelToken) {
    errors.push('Analytics is enabled but no analytics tokens provided');
  }
  
  if (config.features.errorReporting && !config.errorReporting.sentryDsn) {
    errors.push('Error reporting is enabled but no Sentry DSN provided');
  }
  
  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors);
    if (config.isProduction) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
}

// Initialize configuration validation
if (config.isProduction) {
  validateConfig();
}

// Export individual sections for convenience
export const { features, analytics, errorReporting, storage, ui, security } = config;