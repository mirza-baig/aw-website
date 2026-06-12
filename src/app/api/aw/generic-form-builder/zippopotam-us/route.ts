import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

type ZipRequestBody = { postalCode?: string };

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: ZipRequestBody | null = await req.json().catch(() => null);
    const zipCode = body?.postalCode;
    if (!zipCode) {
      return Response.json(
        { message: 'Invalid payload', error: 'postalCode is required' },
        { status: 400 }
      );
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`, requestOptions);
    if (!response.ok) {
      const resText = await response.text();
      return Response.json(
        { message: 'Zippopotam request failed', error: resText || response.statusText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected server error';
    return Response.json({ message: 'Server error', error: msg }, { status: 500 });
  }
}
