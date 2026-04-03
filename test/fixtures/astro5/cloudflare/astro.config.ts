import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import staticHeaders from 'astro-static-headers';
import { redirects } from './src/redirects.ts';

export default defineConfig({
  adapter: cloudflare(),
  integrations: [staticHeaders()],
  redirects,
});
