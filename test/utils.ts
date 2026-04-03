import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { test } from 'vitest';

const cache = new Map<string, string>(); // fixture -> built dir

export function makeTest(fixture: string) {
  return test.extend<{ dir: string }>({
    dir: [
      // biome-ignore lint/correctness/noEmptyPattern: correct pattern for vitest
      async ({}, use) => {
        let dir = cache.get(fixture);
        if (!dir) {
          dir = join(import.meta.dirname, 'fixtures', fixture);
          execSync('pnpm install', { cwd: dir, stdio: 'inherit' });
          execSync('pnpm build', { cwd: dir, stdio: 'inherit' });
          cache.set(fixture, dir);
        }
        await use(dir);
      },
      { scope: 'test' },
    ],
  });
}
