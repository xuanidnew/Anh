import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // SECURITY: Disable source maps to prevent users from viewing original source code
    sourcemap: false,
    // Use 'esbuild' (default) instead of 'terser' to avoid install errors on Vercel
    minify: 'esbuild', 
    esbuild: {
      // Drop console and debugger in production for security/cleanliness
      drop: ['console', 'debugger'],
    },
  },
});