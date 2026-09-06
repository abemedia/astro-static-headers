import { execSync } from 'node:child_process';
import { join } from 'node:path';

// Fixtures import the package by name, so dist must exist.
export default function setup() {
  execSync('pnpm build', { cwd: join(import.meta.dirname, '..'), stdio: 'inherit' });
}
