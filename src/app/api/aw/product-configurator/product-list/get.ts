import config from 'aw.config.server';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest): Promise<Response> {
  try {
    const paradigmApiUrl = config.paradigm.configApiUrl;
    if (!paradigmApiUrl) {
      return Response.json(
        { error: 'Missing required configApiUrl environment variable.' },
        { status: 400 }
      );
    }

    const quoteId = req.nextUrl.searchParams.get('quoteId') ?? '';
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!quoteId) {
      return Response.json({ error: 'Missing quoteId query parameter.' }, { status: 400 });
    }
    if (!bearerToken) {
      return Response.json(
        {
          error: 'Missing bearer token. Provide Authorization: Bearer <token> header.',
        },
        { status: 400 }
      );
    }

    const productListResponse = await fetch(`${paradigmApiUrl}/productlists?quoteId=${quoteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!productListResponse.ok) {
      const errorData = await productListResponse.json();
      return Response.json(
        {
          error: 'Failed to fetch product list',
          details: errorData,
        },
        { status: productListResponse.status }
      );
    }

    const productListData = await productListResponse.json();
    if (!productListData) {
      return Response.json({ error: 'Failed to retrieve product list' }, { status: 502 });
    }

    return Response.json(productListData);
  } catch (error) {
    return Response.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export const GET = handler;
