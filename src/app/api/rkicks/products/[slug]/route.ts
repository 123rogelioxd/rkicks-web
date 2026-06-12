import { RKICKS_API_BASE } from '@/utils/api-products';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;

  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return Response.json({ error: 'Invalid product slug' }, { status: 400, headers: noStoreHeaders() });
  }

  const response = await fetch(`${RKICKS_API_BASE}/products/${encodeURIComponent(slug)}?_=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    return Response.json(
      { error: 'RKicks product API unavailable' },
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
