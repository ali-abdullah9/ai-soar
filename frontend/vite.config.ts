/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@layout': path.resolve(__dirname, './src/components/layout'),
      '@dashboard': path.resolve(__dirname, './src/components/dashboard'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
});
