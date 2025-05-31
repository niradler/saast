import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@store': resolve(__dirname, './src/store'),
        '@utils': resolve(__dirname, './src/utils'),
        '@types': resolve(__dirname, './src/types'),
        '@config': resolve(__dirname, './src/config'),
        '@services': resolve(__dirname, './src/services'),
        '@hooks': resolve(__dirname, './src/hooks'),
      },
    },
    
    // Development server
    server: {
      port: 5173,
      host: true, // Allow external connections
      open: true, // Open browser on start
      cors: true,
    },
    
    // Preview server (for production preview)
    preview: {
      port: 4173,
      host: true,
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            'ui-vendor': ['lucide-react', 'react-hot-toast'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'markdown-vendor': ['react-markdown', 'react-syntax-highlighter', 'mermaid'],
            'state-vendor': ['zustand', 'axios'],
          },
          
          // Asset naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop() || 'chunk'
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `img/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      
      // Build optimizations
      target: 'esnext',
      cssCodeSplit: true,
      reportCompressedSize: false,
    },
    
    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    
    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'zustand',
        'axios',
        'react-hook-form',
        'zod',
        '@hookform/resolvers/zod',
        'lucide-react',
        'react-hot-toast',
        'react-markdown',
        'mermaid',
      ],
    },
  };
});