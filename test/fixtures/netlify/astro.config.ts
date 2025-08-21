import netlify from '@astrojs/netlify';
import { defineConfig } from 'astro/config';
import staticHeaders from 'astro-static-headers';

export default defineConfig({
  adapter: netlify(),
  integrations: [staticHeaders()],
  redirects: {
    '/old-page/': '/new-page/',
    '/temp-redirect/': {
      status: 302,
      destination: '/somewhere/',
    },
  },
});
