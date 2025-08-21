import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect } from 'vitest';
import { makeTest } from './utils';

const test = makeTest('cloudflare');

test.concurrent('generates _headers', async ({ dir }) => {
  const expected = `

/api
  content-type: application/json

/new-page/
  x-content-type-options: nosniff
  x-frame-options: DENY

/
  cache-control: public, max-age=3600
`;

  const actual = await readFile(join(dir, 'dist', '_headers'), 'utf-8');
  expect(actual).toBe(expected);
});

test.concurrent('generates _redirects', async ({ dir }) => {
  const expected = `\
/temp-redirect    /somewhere/    302
/old-page         /new-page/     301
/redirect-page    /new-page/    307
/redirect-api     /api          302
`;

  const actual = await readFile(join(dir, 'dist', '_redirects'), 'utf-8');
  expect(actual).toBe(expected);
});
