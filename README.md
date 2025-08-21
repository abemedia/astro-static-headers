# astro-static-headers 📡

An Astro integration that captures headers and redirects from statically-generated routes during the
build and generates the appropriate configuration files for your deployment platform.

## Why Astro Static Headers?

Astro generates fully static sites by default, but it doesn’t include a built-in way to define
custom HTTP headers or network-level redirects for your pages. This makes it challenging to add
things like caching rules, security headers, or instant server-side redirects without manually
editing configuration files for your hosting platform.

With **Astro Static Headers**, you can define headers and redirects in your statically-generated
routes using
[`Astro.response.headers.set`](https://docs.astro.build/en/guides/on-demand-rendering/#astroresponseheaders)
and [`Astro.redirect`](https://docs.astro.build/en/reference/api-reference/#redirect) - just as as
you would in `server` output mode. During the build, the plugin automatically captures these and
generates the appropriate configuration for your adapter (currently supports `@astrojs/netlify`,
`@astrojs/cloudflare`, and `@astrojs/vercel`).

This keeps your headers and redirects in your code, ensuring consistent builds, faster network-level
redirects, and improved performance and SEO - all without the need for platform-specific
configuration.

## Installation

```sh
npx astro add astro-static-headers
```

### Manual Install

Install the `astro-static-headers` using your package manager.

```sh
npm install astro-static-headers
```

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import staticHeaders from 'astro-static-headers';

export default defineConfig({
  // ...
  integrations: [staticHeaders()],
});
```

## Usage

`astro-static-headers` automatically detects headers and redirects for statically-generated routes
during the build process. Simply set them the same way you would for on-demand rendered routes.

### Setting Headers for Static Astro Pages

Use `Astro.response.headers.set()` in your pages to add custom headers:

```astro
---
Astro.response.headers.set('Cache-Control', 'public, max-age=3600');
---

<html>
  <!-- Page here... -->
</html>
```

### Setting Headers for Static Astro Endpoints

Return a headers object in your endpoints to add custom headers:

```js
export async function GET() {
  return new Response(`{ "message": "Hello, World!" }`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

### Creating Redirects for Astro Static Pages

Use `Astro.redirect()` in your pages to create redirects:

```astro
---
return Astro.redirect('/new-location', 301);
---
```

### Creating Redirects for Astro Static Endpoints

Use `context.redirect()` in your endpoints to create redirects:

```js
export async function GET({ redirect }) {
  return redirect('/new-location', 302);
}
```
