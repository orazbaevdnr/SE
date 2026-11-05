import { defineConfig } from 'vite';

export default defineConfig({
  // Vitest configuration
  test: {
    include: ['tests/**/*.test.js'],
    reporters: ['verbose'],
  },

  // Vite build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
  },

  server: {
    open: true,
  },
});
