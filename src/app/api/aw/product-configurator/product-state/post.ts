import config from 'aw.config.server';

type ClientBody = {
  quoteId: string;
  backendName: string;
};

export async function handler(req: Request): Promise<Response> {
  try {
    const paradigmApiUrl = config.paradigm.configApiUrl;
    if (!paradigmApiUrl) {
      return Response.json({ error: 'Missing required environment variables' }, { status: 400 });
    }

    const { quoteId, backendName } = ((await req.json()) ?? {}) as ClientBody;
    if (!quoteId || !backendName) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!bearerToken) {
      return Response.json(
        {
          error: 'Missing bearer token. Provide Authorization: Bearer <token> header.',
        },
        { status: 400 }
      );
    }

    const externalPayload = {
      SelectedAnswers: [],
      SearchString: 'string',
      FirstPage: 0,
      LastPage: 0,
      PageSize: 0,
      BrandID: 1,
    };

    const productStateResponse = await fetch(
      `${paradigmApiUrl}/productlists/selections?backendName=${backendName}&quoteId=${quoteId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(externalPayload),
      }
    );

    if (!productStateResponse.ok) {
      const errorData = await productStateResponse.json();
      return Response.json(
        {
          error: 'Failed to fetch product state',
          details: errorData,
        },
        { status: productStateResponse.status }
      );
    }

    const productStateData = await productStateResponse.json();
    if (!productStateData) {
      return Response.json({ error: 'Failed to retrieve product state' }, { status: 502 });
    }

    return Response.json(productStateData);
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = handler;
