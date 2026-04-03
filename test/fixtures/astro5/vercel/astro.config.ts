import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import staticHeaders from 'astro-static-headers';
import { redirects } from './src/redirects.ts';

export default defineConfig({
  adapter: vercel(),
  integrations: [staticHeaders()],
  redirects,
});
