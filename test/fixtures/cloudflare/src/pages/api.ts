export async function GET() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  return new Response(JSON.stringify({ status: 'ok', message: 'API working' }, null, 2), {
    status: 200,
    headers,
  });
}

export async function POST() {
  const headers = new Headers();
  headers.set('Server', 'Astro'); // Should not create headers for POST endpoints.

  return new Response(JSON.stringify({ status: 'ok', message: 'API working 123' }, null, 2), {
    status: 200,
    headers,
  });
}
