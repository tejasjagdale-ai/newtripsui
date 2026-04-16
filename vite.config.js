import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5500,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
