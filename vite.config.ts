import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const appHtmlPath = fileURLToPath(new URL('./app.html', import.meta.url));

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: appHtmlPath,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
