import type { AstroConfig, AstroIntegration, IntegrationResolvedRoute } from 'astro';
import { cloudflare } from './lib/cloudflare.js';
import { netlify } from './lib/netlify.js';
import { vercel } from './lib/vercel.js';

const SUPPORTED_ADAPTERS = ['@astrojs/cloudflare', '@astrojs/netlify', '@astrojs/vercel'];

export default function staticHeaders(): AstroIntegration {
  let astroConfig: AstroConfig;
  let astroRoutes: IntegrationResolvedRoute[];
  return {
    name: 'astro-static-headers',
    hooks: {
      'astro:config:setup': ({ addMiddleware }) => {
        addMiddleware({ entrypoint: new URL('middleware.js', import.meta.url), order: 'pre' });
      },
      'astro:config:done': ({ config }) => {
        const adapterName = config.adapter?.name;
        if (!adapterName || !SUPPORTED_ADAPTERS.includes(adapterName)) {
          throw new Error(
            `Unsupported adapter "${adapterName}". Supported: ${SUPPORTED_ADAPTERS.join(', ')}`,
          );
        }
        astroConfig = config;
      },
      'astro:routes:resolved': ({ routes }) => {
        astroRoutes = routes;
      },
      'astro:build:start': () => {
        globalThis.__astroStaticHeaders = { headers: {}, redirects: {}, routes: {} };
      },
      'astro:build:done': async ({ dir, logger }) => {
        const { redirects, headers, routes } = globalThis.__astroStaticHeaders;
        Reflect.deleteProperty(globalThis, '__astroStaticHeaders');

        // Remove headers and redirects for routes that have redirects in the Astro config.
        astroRoutes
          .filter(({ redirect, isPrerendered }) => redirect && isPrerendered)
          .forEach(({ pattern }) => {
            Reflect.deleteProperty(redirects, pattern);
            Reflect.deleteProperty(headers, pattern);
            routes[pattern]?.forEach((route) => {
              Reflect.deleteProperty(redirects, route);
              Reflect.deleteProperty(headers, route);
            });
          });

        if (Object.keys(redirects).length === 0 && Object.keys(headers).length === 0) {
          logger.info('No headers or redirects captured.');
          return;
        }

        const outDir = dir.pathname;

        switch (astroConfig.adapter?.name) {
          case '@astrojs/cloudflare':
            return cloudflare(headers, redirects, outDir);
          case '@astrojs/netlify':
            return netlify(headers, redirects, outDir);
          case '@astrojs/vercel':
            return vercel(headers, redirects);
        }
      },
    },
  };
}
