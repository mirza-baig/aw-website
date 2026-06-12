import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
type ZipRequestBody = { postalCode?: string };

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: ZipRequestBody | null = await req.json().catch(() => null);
    const postalCode = body?.postalCode;
    let statusCode = 0;
    let errorText = '';
    if (!postalCode) {
      statusCode = 400;
      errorText = 'postalCode is required';
    }
    if (req.method !== 'POST') {
      statusCode = 405;
      errorText = 'method not allowed';
    }
    if (!postalCode || req.method !== 'POST') {
      return Response.json(
        { message: 'Invalid payload', error: errorText },
        { status: statusCode }
      );
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'text/plain',
      },
    };

    const response = await fetch(`https://api.zippopotam.us/us/${postalCode}`, requestOptions);
    if (!response.ok) {
      const resText = await response.text();
      return Response.json(
        { message: 'Zippopotam request failed', error: resText || response.statusText },
        { status: 500 }
      );
    }

    const data = await response.json();

    return Response.json(data, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected server error';
    return Response.json({ message: 'Server error', error: msg }, { status: 500 });
  }
}
