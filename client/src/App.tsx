import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useSettingsStore } from './store/settingsStore';
import { config } from './config';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ChatPage = lazy(() => import('./pages/chat/ChatPage').then(m => ({ default: m.ChatPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const ProtectedRoute = lazy(() => import('./hooks/useProtectedRoute').then(m => ({ default: m.ProtectedRoute })));

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const { theme, setTheme } = useSettingsStore();

  // Initialize theme on app load
  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme.mode;
    
    // Set theme color meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme.colors.primary);
    }
    
    // Set default theme if configured
    if (config.ui.defaultTheme !== theme.mode && !localStorage.getItem('settings-storage')) {
      const defaultTheme = theme.mode === 'light' ? 
        { ...theme, mode: config.ui.defaultTheme as 'light' | 'dark' } : 
        theme;
      setTheme(defaultTheme);
    }
  }, [theme, setTheme]);

  // Set document title
  useEffect(() => {
    document.title = config.appName;
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.appDescription);
    }
  }, []);

  // Log app info in development
  useEffect(() => {
    if (config.isDevelopment) {
      console.log(`%c${config.appName} v${config.appVersion}`, 'color: #3b82f6; font-weight: bold; font-size: 16px;');
      console.log('Environment:', config.nodeEnv);
      console.log('Features:', config.features);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat/:conversationId" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          
          {/* Toast notifications with theme-aware styling */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme.mode === 'dark' ? '#1f2937' : '#ffffff',
                color: theme.mode === 'dark' ? '#f9fafb' : '#111827',
                border: `1px solid ${theme.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                boxShadow: theme.mode === 'dark' 
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: theme.colors.primary,
                  secondary: theme.mode === 'dark' ? '#1f2937' : '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: theme.mode === 'dark' ? '#1f2937' : '#ffffff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;