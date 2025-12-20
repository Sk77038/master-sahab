
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensuring the API key is injected correctly from environment variables
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    outDir: 'dist',
    // Force use of esbuild (standard) to avoid missing terser dependency errors
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: false,
  }
});
