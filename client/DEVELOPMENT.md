# ChatSaaS Development Guide

## 🏗️ Architecture Overview

This SaaS template follows modern React best practices with a clean, scalable architecture.

### Key Design Patterns

1. **Component Composition** - Reusable UI components
2. **Custom Hooks** - Business logic separation  
3. **State Management** - Zustand for global state
4. **Type Safety** - TypeScript throughout
5. **Mock-First Development** - Built-in mock API

## 🔧 Development Workflow

### 1. Setting Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start mock server (optional)
npm run mock-server
```

### 2. Working with Components

#### Creating New UI Components
```typescript
// src/components/ui/NewComponent.tsx
import { forwardRef } from 'react';
import { cn } from '../../utils';

interface NewComponentProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const NewComponent = forwardRef<
  HTMLDivElement, 
  NewComponentProps
>(({ variant = 'primary', children, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'base-classes',
        variant === 'primary' ? 'primary-styles' : 'secondary-styles'
      )}
      {...props}
    >
      {children}
    </div>
  );
});
```

#### Adding to UI Index
```typescript
// src/components/ui/index.ts
export { NewComponent } from './NewComponent';
```

### 3. State Management

#### Creating New Store
```typescript
// src/store/newStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewState {
  data: any[];
  loading: boolean;
  addItem: (item: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useNewStore = create<NewState>()(
  persist(
    (set, get) => ({
      data: [],
      loading: false,
      
      addItem: (item) => {
        set((state) => ({
          data: [...state.data, item]
        }));
      },
      
      setLoading: (loading) => {
        set({ loading });
      }
    }),
    {
      name: 'new-storage',
      partialize: (state) => ({
        data: state.data
      })
    }
  )
);
```

### 4. Adding New Routes

```typescript
// src/pages/NewPage.tsx
import { Layout } from '../components/layout';

export function NewPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1>New Page</h1>
      </div>
    </Layout>
  );
}
```

```typescript
// Update src/App.tsx
import { NewPage } from './pages/NewPage';

// Add to Routes
<Route path="/new" element={<NewPage />} />
```

### 5. Extending Content Renderers

#### Adding New Content Type
```typescript
// src/components/chat/NewRenderer.tsx
interface NewRendererProps {
  content: string;
  className?: string;
}

export function NewRenderer({ content, className }: NewRendererProps) {
  return (
    <div className={className}>
      {/* Your rendering logic */}
    </div>
  );
}
```

#### Update Content Renderer
```typescript
// src/components/chat/ContentRenderer.tsx
import { NewRenderer } from './NewRenderer';

// Add to switch statement
case 'newtype':
  return <NewRenderer content={renderableContent.content} />;

// Add detection logic
function detectContentType(content: string): RenderableContent {
  // Add your detection logic
  if (content.startsWith('::newtype')) {
    return {
      type: 'newtype',
      content: content.slice(9)
    };
  }
  // ... existing logic
}
```

## 🎨 Styling Guidelines

### Using Tailwind CSS

1. **Utility-First Approach**
```tsx
<div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
```

2. **Custom Components with cn()**
```tsx
import { cn } from '../utils';

const Button = ({ className, ...props }) => (
  <button 
    className={cn(
      'px-4 py-2 rounded-lg font-medium',
      'hover:opacity-90 transition-opacity',
      className
    )}
    {...props}
  />
);
```

3. **Dark Mode Support**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

### Theme System

1. **Adding New Theme**
```typescript
// src/store/settingsStore.ts
const newTheme: Theme = {
  id: 'new-theme',
  name: 'New Theme',
  mode: 'dark',
  colors: {
    primary: '#your-primary',
    secondary: '#your-secondary',
    // ... other colors
  }
};

// Add to availableThemes array
const availableThemes = [lightTheme, darkTheme, newTheme];
```

2. **Using Theme Colors**
```tsx
// Access current theme
const { theme } = useSettingsStore();

// Use in components
<div style={{ backgroundColor: theme.colors.primary }}>
```

## 🔌 API Integration

### Mock API Development

The template includes a comprehensive mock API for development:

```typescript
// src/services/mockAPI.js
const mockAPI = {
  newEndpoint: async (data) => {
    await delay(1000);
    // Your mock logic
    return { success: true, data };
  }
};
```

### Real API Integration

1. **Create Service**
```typescript
// src/services/newService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export async function newAPICall(data: any) {
  try {
    const response = await api.post('/new-endpoint', data);
    return response.data;
  } catch (error: any) {
    // Fallback to mock if needed
    if (error.code === 'ERR_NETWORK') {
      const mockAPI = (window as any).mockAPI;
      if (mockAPI?.newEndpoint) {
        return await mockAPI.newEndpoint(data);
      }
    }
    throw new Error(error.response?.data?.message || 'Request failed');
  }
}
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// src/components/__tests__/Button.test.tsx (example)
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Store Testing
```typescript
// src/store/__tests__/authStore.test.ts (example)
import { useAuthStore } from '../authStore';

test('login updates state correctly', () => {
  const store = useAuthStore.getState();
  const mockUser = { id: '1', email: 'test@example.com' };
  
  store.login(mockUser, 'token');
  
  expect(store.isAuthenticated).toBe(true);
  expect(store.user).toEqual(mockUser);
});
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization
```typescript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  const handleClick = useCallback(() => {
    // Handle click
  }, []);

  return <div onClick={handleClick}>{processedData}</div>;
}
```

## 🔧 Build & Deployment

### Environment Variables
```bash
# .env.local
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=ChatSaaS
VITE_ENABLE_MOCK=true
```

### Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
});
```

### Deployment Checklist
- [ ] Update API URLs for production
- [ ] Configure environment variables
- [ ] Test all authentication flows
- [ ] Verify responsive design
- [ ] Check theme switching
- [ ] Test content rendering
- [ ] Validate form submissions
- [ ] Ensure error handling works

## 🐛 Debugging Tips

### Common Issues

1. **Theme not persisting**
   - Check localStorage in browser dev tools
   - Verify Zustand persist configuration

2. **Content not rendering**
   - Check ContentRenderer detection logic
   - Verify component imports
   - Test with simple content first

3. **Authentication issues**
   - Check token storage
   - Verify API endpoints
   - Test with mock API first

### Development Tools

1. **React Developer Tools**
2. **Redux DevTools** (for Zustand)
3. **Tailwind CSS IntelliSense**
4. **ES7+ React/Redux/React-Native snippets**

## 📖 Best Practices

1. **Always use TypeScript interfaces**
2. **Implement error boundaries for robustness**
3. **Use semantic HTML elements**
4. **Follow accessibility guidelines**
5. **Keep components small and focused**
6. **Use custom hooks for complex logic**
7. **Implement proper loading states**
8. **Handle edge cases gracefully**

## 🤝 Contributing Guidelines

1. **Follow existing code style**
2. **Add TypeScript types for new features**
3. **Update documentation**
4. **Test on multiple themes**
5. **Ensure mobile responsiveness**
6. **Add error handling**

Happy coding! 🚀