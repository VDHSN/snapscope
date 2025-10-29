import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    css: false, // Disable CSS processing
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Prevent PostCSS from being loaded during tests
  css: {
    postcss: {
      plugins: [],
    },
  },
});