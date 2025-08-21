import type { ValidRedirectStatus } from 'astro';

declare global {
  var __astroStaticHeaders: {
    headers: Record<string, Headers>;
    redirects: Record<string, { status: ValidRedirectStatus; destination: string }>;
    routes: Record<string, string[]>;
  };
}
