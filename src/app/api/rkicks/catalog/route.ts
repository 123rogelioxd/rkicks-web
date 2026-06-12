import { RKICKS_API_BASE } from '@/utils/api-products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const response = await fetch(`${RKICKS_API_BASE}/catalog?_=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    return Response.json(
      { error: 'RKicks catalog API unavailable' },
      {
        status: response.status >= 400 ? response.status : 502,
        headers: noStoreHeaders(),
      }
    );
  }

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json; charset=utf-8',
      ...noStoreHeaders(),
    },
  });
}

function noStoreHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
  };
}
