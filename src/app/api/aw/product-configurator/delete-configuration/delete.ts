import config from 'aw.config.server';
import { NextRequest, NextResponse } from 'next/server';

type SuccessResponse = {
  ok: true;
  message: string;
  data?: unknown;
};

type ErrorResponse = {
  ok: false;
  error: string;
  details?: unknown;
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    return await response.text();
  }

  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

export async function handler(
  req: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  const paradigmConfigApiUrl = config.paradigm.configApiUrl;
  const bearerToken = req.headers.get('authorization')?.replace('Bearer ', '');
  const paradigmConfigCookie = req.headers.get('x-paradigm-cookie');
  const configId = req.nextUrl.searchParams.get('configId');

  // Validate all required fields
  if (!paradigmConfigApiUrl) {
    return NextResponse.json(
      { ok: false, error: 'Missing required environment variables' },
      { status: 500 }
    );
  }
  if (!bearerToken) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing bearer token.   Provide Authorization: Bearer <token> header.',
      },
      { status: 401 }
    );
  }
  if (!paradigmConfigCookie) {
    return NextResponse.json(
      { ok: false, error: 'Missing configuration cookie. Provide Cookie: <cookie> header.' },
      { status: 400 }
    );
  }
  if (!configId) {
    return NextResponse.json(
      { ok: false, error: 'Missing required query parameters.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${paradigmConfigApiUrl}/${configId}/configurations`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        Cookie: paradigmConfigCookie,
      },
      redirect: 'follow',
    });

    // Handle error responses
    if (!response.ok) {
      const errorDetails = await parseResponse(response);
      return NextResponse.json(
        {
          ok: false,
          error: 'Failed to delete configuration',
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      console.log('Successfully deleted configuration:', configId);
      return NextResponse.json({ ok: true, message: 'Configuration deleted successfully' });
    }

    // Handle 200 OK with possible body
    const responseData = await parseResponse(response);
    return NextResponse.json({
      ok: true,
      message: 'Configuration deleted successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const DELETE = handler;
