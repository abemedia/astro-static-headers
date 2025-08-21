import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect } from 'vitest';
import { makeTest } from './utils';

const test = makeTest('netlify');

test.concurrent('generates config.json headers', async ({ dir }) => {
  const vercelContent = await readFile(join(dir, '.netlify', 'v1', 'config.json'), 'utf-8');
  expect(JSON.parse(vercelContent)).toEqual({
    images: {
      remote_images: [],
    },
    headers: [
      {
        for: '/_astro/*',
        values: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
      {
        for: '/api',
        values: {
          'content-type': 'application/json',
        },
      },
      {
        for: '/new-page/',
        values: {
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY',
        },
      },
      {
        for: '/',
        values: {
          'cache-control': 'public, max-age=3600',
        },
      },
    ],
  });
});

test.concurrent('generates _redirects', async ({ dir }) => {
  const expected = `
/temp-redirect    /somewhere/    302
/old-page         /new-page/     301

/redirect-page    /new-page/    307
/redirect-api     /api          302
`;

  const actual = await readFile(join(dir, 'dist', '_redirects'), 'utf-8');
  expect(actual).toBe(expected);
});
