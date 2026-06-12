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
    const stepId = req.nextUrl.searchParams.get('stepId') ?? '';

    if (!configId || !stepId) {
      return Response.json(
        { ok: false, error: 'Missing required query parameters.' },
        { status: 400 }
      );
    }

    const response = await fetch(`${paradigmConfigApiUrl}/${configId}/steps/${stepId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        Cookie: paradigmConfigCookie,
        redirect: 'follow',
      },
    });

    if (!response.ok) {
      const details = await response.json();
      return Response.json(
        { error: 'Failed to create quote', details },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data) {
      return Response.json({ error: 'Failed to retrieve step data' }, { status: 502 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export const GET = handler;
