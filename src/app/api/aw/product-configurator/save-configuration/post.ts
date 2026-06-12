import config from 'aw.config.server';

type ClientBody = {
  configId: string;
  finishAction?: string;
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const paradigmConfigApiUrl = config.paradigm.configApiUrl;
    if (!paradigmConfigApiUrl) {
      return Response.json({ error: 'Missing required environment variables' }, { status: 400 });
    }

    const { configId, finishAction } = ((await req.json()) ?? {}) as ClientBody;

    if (!configId) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const apiUrl = finishAction
      ? `${paradigmConfigApiUrl}/${configId}/configurations?finishAction=${finishAction}`
      : `${paradigmConfigApiUrl}/${configId}/configurations`;

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

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        Cookie: paradigmConfigCookie,
      },
    });

    if (!response.ok) {
      const details = await response.json();
      return Response.json(
        { error: 'Failed to save configuration', details },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data) {
      return Response.json({ error: 'Failed to retrieve saved configuration' }, { status: 502 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export const POST = handler;
