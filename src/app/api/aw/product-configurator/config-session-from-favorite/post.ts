import config from 'aw.config.server';

type ClientBody = {
  quoteId: string;
  favoriteId: string;
};

export async function handler(req: Request): Promise<Response> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ message: 'Missing or invalid Authorization header' }, { status: 401 });
  }

  const { quoteId, favoriteId } = ((await req.json()) || {}) as ClientBody;

  if (!quoteId || !favoriteId) {
    return Response.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const paradigmConfigApiUrl = config.paradigm.configApiUrl;
  if (!paradigmConfigApiUrl) {
    return Response.json({ error: 'Missing required environment variables' }, { status: 400 });
  }

  const externalPayload = {
    ConfiguratorType: 'Step',
    IsNew: true,
    CanvasWidth: 1400,
    CanvasHeight: 600,
    SupportSelectedUnits: true,
    IncludeDrawingsInConfiguratorState: true,
    IncludeLimitationsInConfiguratorState: true,
    IncludeSummaryInConfiguratorState: true,
    IncludeListPriceInConfiguratorState: true,
    UsingProductList: true,
    QuoteId: quoteId,
    BrandId: '1',
    StartupDrawingName: null,
    DisplayMeasurementType: null,
    IncludeThreekitConfigurationInConfiguratorState: true,
    FavoriteId: favoriteId,
  };

  try {
    const response = await fetch(`${paradigmConfigApiUrl}/configurators/newSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(externalPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        {
          error: 'Failed to create config session from favorite',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    if (!responseData) {
      return Response.json({ error: 'Failed to retrieve config session data' }, { status: 502 });
    }

    const setCookieHeader = response.headers.get('set-cookie');

    return Response.json(
      { data: responseData, setCookie: setCookieHeader },
      { status: response.status }
    );
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = handler;
