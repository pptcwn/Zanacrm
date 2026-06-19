import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import path from 'path';

const env = loadEnv('test', process.cwd(), '');

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./components/__tests__/setup.ts'],
    globals: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL:
        env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        'test-anon-key',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'test-anon-key',
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/antigravity-auto-accept/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/navigation': path.resolve(
        __dirname,
        './components/__tests__/mocks/next-navigation.ts'
      ),
    },
  },
});
