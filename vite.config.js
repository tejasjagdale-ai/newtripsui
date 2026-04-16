import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5500,
    open: true,
    proxy: {
      '/api': {
        target: 'https://newtripsbackend-1.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
