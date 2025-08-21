import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { HostRoutes, printAsRedirects } from '@astrojs/underscore-redirects';
import type { ValidRedirectStatus } from 'astro';

interface NetlifyConfig {
  headers: {
    for: string;
    values: Record<string, string>;
  }[];
}

export async function netlify(
  headers: Record<string, Headers>,
  redirects: Record<string, { status: ValidRedirectStatus; destination: string }>,
  outDir: string,
) {
  const headersContent = Object.entries(headers).map(([source, headers]) => ({
    for: source,
    values: Object.fromEntries([...headers].map(([k, v]) => [k, v])),
  }));
  if (headersContent.length) {
    const configPath = join('.netlify', 'v1', 'config.json');
    const config = JSON.parse(await readFile(configPath, 'utf8')) as NetlifyConfig;
    config.headers = [...config.headers, ...headersContent];
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
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
