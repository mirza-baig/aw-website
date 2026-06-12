import config from 'aw.config.server';
import { after, NextRequest } from 'next/server';

export async function handler(req: NextRequest): Promise<Response> {
  try {
    const paradigmConfigApiUrl = config.paradigm.configApiUrl;
    if (!paradigmConfigApiUrl) {
      return Response.json(
        { ok: false, error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    if (!bearerToken) {
      return Response.json(
        {
          ok: false,
          error: 'Missing bearer token.  Provide Authorization: Bearer <token> header.',
        },
        { status: 401 }
      );
    }

    const paradigmConfigCookie = req.headers.get('x-paradigm-cookie') ?? '';
    if (!paradigmConfigCookie) {
      return Response.json(
        {
          ok: false,
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

    // make external DELETE request in background
    after(async () => {
      try {
        await fetch(`${paradigmConfigApiUrl}/${configId}/configurations`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
            Cookie: paradigmConfigCookie,
          },
          redirect: 'follow', // Move outside of headers
        });
      } catch (error) {
        console.error('Error deleting configuration in background:', error);
      }
    });

    return Response.json({
      ok: true,
      message: 'Configuration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    // Only respond if we haven't already
    return Response.json({ error: 'Internal server error' });
  }
}

export const DELETE = handler;
