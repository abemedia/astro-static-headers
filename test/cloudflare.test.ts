import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect } from 'vitest';
import { makeTest } from './utils';

describe('v5', () => {
  const test = makeTest('astro5/cloudflare');

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
});

describe('v6', () => {
  const test = makeTest('astro6/cloudflare');

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

    const actual = await readFile(join(dir, 'dist', 'client', '_headers'), 'utf-8');
    expect(actual).toBe(expected);
  });

  test.concurrent('generates _redirects', async ({ dir }) => {
    const expected = `\
/temp-redirect/    /somewhere/    302
/temp-redirect     /somewhere/    302
/old-page/         /new-page/     301
/old-page          /new-page/     301
/redirect-page    /new-page/    307
/redirect-api     /api          302
`;

    const actual = await readFile(join(dir, 'dist', 'client', '_redirects'), 'utf-8');
    expect(actual).toBe(expected);
  });
});
