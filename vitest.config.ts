import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        'App.tsx',
        'src/**/*.tsx',
        'src/hooks/**',
        'src/storage/**',
        'src/types/**',
        'node_modules/**',
      ],
      include: ['src/lib/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
    },
  },
});
