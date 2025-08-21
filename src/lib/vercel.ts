import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ValidRedirectStatus } from 'astro';

interface VercelConfig {
  version: 3;
  routes: {
    src?: string;
    headers?: Record<string, string>;
    status?: number;
    handle?: string;
  }[];
}

export async function vercel(
  headers: Record<string, Headers>,
  redirects: Record<string, { status: ValidRedirectStatus; destination: string }>,
) {
  const redirectRoutes = Object.entries(redirects).map(([source, redirect]) => ({
    src: `^${escapeRegex(source)}$`,
    headers: { Location: redirect.destination },
    status: redirect.status,
  }));

  const headerRoutes = Object.entries(headers).map(([source, headers]) => ({
    src: `^${escapeRegex(source)}$`,
    headers: Object.fromEntries([...headers].map(([k, v]) => [k, v])),
  }));

  // Insert routes just before the filesystem handler.
  const configPath = join('.vercel', 'output', 'config.json');
  const config = JSON.parse(await readFile(configPath, 'utf8')) as VercelConfig;
  const filesystemIndex = config.routes.findIndex((route) => route.handle === 'filesystem');
  const insertIndex = filesystemIndex >= 0 ? filesystemIndex : config.routes.length;
  config.routes.splice(insertIndex, 0, ...redirectRoutes, ...headerRoutes);

  await writeFile(configPath, JSON.stringify(config, null, '\t'), 'utf8');
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
