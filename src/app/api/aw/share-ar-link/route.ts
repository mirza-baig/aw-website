// pages/api/aw/share-ar-link.ts
import config from 'aw.config.server';
import marlimarService from 'lib/marlimar';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

type ShareARLinkRequest = {
  phoneNumber?: string;
  link?: string;
};

type SuccessResponse = {
  message: string;
  marlimarId?: string;
};

type ErrorResponse = {
  error: string;
  details?: unknown;
};

type ShareARLinkResponse = SuccessResponse | ErrorResponse;
export async function POST(req: NextRequest): Promise<NextResponse<ShareARLinkResponse>> {
  if (req.method !== 'POST') {
    return NextResponse.json<ErrorResponse>(
      { error: 'Method Not Allowed', details: ' Method not allowed' },
      { status: 405 }
    );
  }
  try {
    const body: ShareARLinkRequest = (await req.json().catch(() => null)) ?? {};
    const phoneNumber = body.phoneNumber;
    const link = body.link;

    if (!phoneNumber) {
      return NextResponse.json<ErrorResponse>(
        { error: 'phoneNumber is required' },
        { status: 400 }
      );
    }

    const payload = {
      hashKey: config.marlimar.hashKeys.shareAR,
      mobileNumber: phoneNumber, // or digits-only if their API requires it; see below
      custom: link,
    };

    const response = await marlimarService.sendOutboundMessage(payload);

    const ok =
      response?.status === '1' &&
      typeof response.message === 'string' &&
      response.message.toLowerCase() === 'success';

    if (!ok) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Error sending message', details: response },
        { status: 500 }
      );
    }

    const marlimarId: string | undefined =
      typeof response?.id === 'string' ? response.id : undefined;

    const success: SuccessResponse = { message: 'Message Sent', marlimarId };
    return NextResponse.json<SuccessResponse>(success, { status: 200 });
  } catch (err: unknown) {
    const details = getErrorMessage(err);
    console.error('Error sending message - handler', details);

    return NextResponse.json<ErrorResponse>(
      { error: 'Error sending message', details },
      { status: 500 }
    );
  }
}
