import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { HostRoutes, printAsRedirects } from '@astrojs/underscore-redirects';
import type { ValidRedirectStatus } from 'astro';

export async function cloudflare(
  headers: Record<string, Headers>,
  redirects: Record<string, { status: ValidRedirectStatus; destination: string }>,
  outDir: string,
) {
  const headersContent = Object.entries(headers).reduce((acc, [route, headers]) => {
    if (!headers) return acc;
    acc += `\n${route}\n`;
    headers.forEach((value, key) => {
      acc += `  ${key}: ${value}\n`;
    });
    return acc;
  }, '');
  if (headersContent) {
    await appendFile(join(outDir, '_headers'), `\n${headersContent}`, 'utf8');
  }

  const hostRoutes = new HostRoutes();
  Object.entries(redirects).forEach(([source, config]) => {
    hostRoutes.add({
      dynamic: false,
      input: source,
      target: config.destination,
      status: config.status,
    });
  });
  if (!hostRoutes.empty()) {
    await appendFile(join(outDir, '_redirects'), `\n${printAsRedirects(hostRoutes)}\n`, 'utf8');
  }
}
