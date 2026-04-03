import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect } from 'vitest';
import { makeTest } from './utils';

describe('v5', () => {
  const test = makeTest('astro5/vercel');

  test.concurrent('generates vercel.json', async ({ dir }) => {
    const content = await readFile(join(dir, '.vercel', 'output', 'config.json'), 'utf-8');
    expect(JSON.parse(content)).toEqual({
      version: 3,
      routes: [
        {
          src: '^/old-page$',
          headers: { Location: '/new-page/' },
          status: 301,
        },
        {
          src: '^/temp-redirect$',
          headers: { Location: '/somewhere/' },
          status: 302,
        },
        {
          src: '^/redirect-api$',
          headers: { Location: '/api' },
          status: 302,
        },
        {
          src: '^/redirect-page$',
          headers: { Location: '/new-page/' },
          status: 307,
        },
        {
          src: '^/api$',
          headers: { 'content-type': 'application/json' },
        },
        {
          src: '^/new-page/$',
          headers: {
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
          },
        },
        {
          src: '^/$',
          headers: { 'cache-control': 'public, max-age=3600' },
        },
        {
          handle: 'filesystem',
        },
        {
          src: '^/_astro/(.*)$',
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
        {
          src: '^/_server-islands/([^/]+?)/?$',
          dest: '_render',
        },
        {
          src: '^/_image/?$',
          dest: '_render',
        },
        {
          src: '^/dynamic/?$',
          dest: '_render',
        },
      ],
    });
  });
});

describe('v6', () => {
  const test = makeTest('astro6/vercel');

  test.concurrent('generates vercel.json', async ({ dir }) => {
    const content = await readFile(join(dir, '.vercel', 'output', 'config.json'), 'utf-8');
    expect(JSON.parse(content)).toEqual({
      version: 3,
      routes: [
        {
          src: '^/old-page$',
          headers: { Location: '/new-page/' },
          status: 301,
        },
        {
          src: '^/temp-redirect$',
          headers: { Location: '/somewhere/' },
          status: 302,
        },
        {
          src: '^/redirect-api$',
          headers: { Location: '/api' },
          status: 302,
        },
        {
          src: '^/redirect-page$',
          headers: { Location: '/new-page/' },
          status: 307,
        },
        {
          src: '^/api$',
          headers: { 'content-type': 'application/json' },
        },
        {
          src: '^/new-page/$',
          headers: {
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
          },
        },
        {
          src: '^/$',
          headers: { 'cache-control': 'public, max-age=3600' },
        },
        {
          handle: 'filesystem',
        },
        {
          src: '^/_astro/(.*)$',
          headers: { 'cache-control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
        {
          src: '^/_server-islands/([^/]+?)/?$',
          dest: '_render',
        },
        {
          src: '^/_image/?$',
          dest: '_render',
        },
        {
          src: '^/dynamic/?$',
          dest: '_render',
        },
        {
          src: '^/404/?$',
          dest: '_render',
        },
        {
          src: '^/.*$',
          dest: '_render',
          status: 404,
        },
      ],
    });
  });
});
