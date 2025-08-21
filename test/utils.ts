import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { test } from 'vitest';

const cache = new Map<string, string>(); // adapter -> built dir

export function makeTest(adapter: string) {
  return test.extend<{ dir: string }>({
    dir: [
      // biome-ignore lint/correctness/noEmptyPattern: correct pattern for vitest
      async ({}, use) => {
        let dir = cache.get(adapter);
        if (!dir) {
          dir = join(import.meta.dirname, 'fixtures', adapter);
          execSync('pnpm build', { cwd: dir, stdio: 'inherit' });
          cache.set(adapter, dir);
        }
        await use(dir);
      },
      { scope: 'worker' },
    ],
  });
}
