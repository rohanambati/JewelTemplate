import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify('pk_test_51S6rKgLR42FfBY3TBQlxMKV3W0T6WeAcgyMM5Q7mPskxwWy6zIiJKOq15kTeAQ7JKl681YrFTT9k0m40vyABZz7100JwQTcSSq'),
  },
});
