import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 60000, // Allow time for Astro builds
    pool: 'forks', // Separate processes for concurrent tests
  },
});
