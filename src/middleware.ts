import type { MiddlewareHandler, ValidRedirectStatus } from 'astro';

const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308]);

const isValidRedirectStatus = (status: number): status is ValidRedirectStatus =>
  REDIRECT_STATUS_CODES.has(status);

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Let Astro render the page/endpoint first.
  const res = await next();

  // Only do capture during prerender (build).
  if (!context.isPrerendered) return res;

  const route = context.url.pathname || '/';
  const store = globalThis.__astroStaticHeaders;

  // Track the route pattern for deduplicating redirects from the Astro config.
  const routes = (store.routes[context.routePattern] ??= []);
  if (route !== context.routePattern) {
    routes.push(route);
  }

  // Record redirects
  if (isValidRedirectStatus(res.status)) {
    const destination = res.headers.get('Location');
    if (destination) {
      // Trim trailing slash to match the redirects from the Astro config.
      const from = route === '/' ? '/' : route.replace(/\/$/, '');
      routes.push(from);
      store.redirects[from] = { status: res.status, destination };
      return res; // Don't capture headers for redirecting routes.
    }
  }

  // Record headers
  const headers = (store.headers[route] ??= new Headers());
  res.headers.forEach((value, key) => {
    if (key.startsWith('x-astro-') || (key === 'content-type' && value === 'text/html')) {
      return; // Skip internal headers and default HTML content-type.
    }
    headers.append(key, value);
  });

  return res;
};
