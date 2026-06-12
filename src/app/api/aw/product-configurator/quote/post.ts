import config from 'aw.config.server';

export async function handler(req: Request): Promise<Response> {
  // Validate environment variables
  const appApi = config.paradigm.appApiUrl;
  const clientId = config.paradigm.clientId;

  if (!appApi || !clientId) {
    return Response.json({ error: 'Missing required environment variables' }, { status: 400 });
  }

  // Extract auth token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const quotePayload = {
      ClientId: clientId,
      QuoteName: 'AW Product Visualizer Quote',
      ProjectName: 'AW Product Visualizer Project',
      PricingPreferences: {
        MarginAmount: 0,
        MarginPercentage: 0,
        Tax1Percentage: 0,
        Tax2Percentage: 0,
        FreightAmount: 0,
        FreightPercentage: 0,
        FreightIsTaxable: false,
        LaborAmount: 0,
        LaborPercentage: 0,
        LaborIsTaxable: false,
      },
    };

    const quoteResponse = await fetch(`${appApi}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quotePayload),
    });

    if (!quoteResponse.ok) {
      const details = await quoteResponse.json();
      return Response.json(
        { error: 'Failed to create quote', details },
        { status: quoteResponse.status }
      );
    }

    const quoteData = await quoteResponse.json();
    const newQuoteId = quoteData.Id;
    const newQuoteNumber = quoteData.QuoteNumber;
    if (!newQuoteId || !newQuoteNumber) {
      return Response.json(
        { error: 'Quote ID or Quote Number missing in response' },
        { status: 502 }
      );
    }

    return Response.json({ quoteId: newQuoteId, quoteNumber: newQuoteNumber });
  } catch (err) {
    console.error('Unexpected error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = handler;
