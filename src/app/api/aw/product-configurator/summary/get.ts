import config from 'aw.config.server';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest): Promise<Response> {
  try {
    const paradigmConfigApiUrl = config.paradigm.configApiUrl;
    if (!paradigmConfigApiUrl) {
      return Response.json({ error: 'Missing required environment variables' }, { status: 400 });
    }

    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    if (!bearerToken) {
      return Response.json(
        {
          error: 'Missing bearer token. Provide Authorization: Bearer <token> header.',
        },
        { status: 400 }
      );
    }

    const paradigmConfigCookie = req.headers.get('x-paradigm-cookie') ?? '';
    if (!paradigmConfigCookie) {
      return Response.json(
        {
          error: 'Missing configuration cookie. Provide Cookie: <cookie> header.',
        },
        { status: 400 }
      );
    }

    const configId = req.nextUrl.searchParams.get('configId') ?? '';
    if (!configId) {
      return Response.json(
        { ok: false, error: 'Missing required query parameters.' },
        { status: 400 }
      );
    }

    const response = await fetch(`${paradigmConfigApiUrl}/${configId}/configurations/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        Cookie: paradigmConfigCookie,
        redirect: 'follow',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        {
          error: 'Failed to fetch configuration summary',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    if (!responseData) {
      return Response.json({ error: 'Failed to retrieve configuration summary' }, { status: 502 });
    }

    return Response.json(responseData, { status: response.status });
  } catch (error) {
    return Response.json({ message: 'Internal Server Error: ' + error }, { status: 500 });
  }
}

export const GET = handler;
