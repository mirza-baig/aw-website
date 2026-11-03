import config from 'aw.config.server';
import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';

function getHostHeader(req: NextRequest): string {
  const host = req.headers.get('host') ?? 'localhost';
  return host.split(':')[0];
}

type RecaptchaRequestBody = {
  token?: string;
  userAction?: string;
};

export async function POST(req: NextRequest): Promise<Response> {
  const body: RecaptchaRequestBody = await req.json();
  const token = body?.token;
  const userAction = body?.userAction;

  if (!token || !userAction) {
    return Response.json(
      { message: 'Invalid payload', error: 'token and userAction are required' },
      { status: 400 }
    );
  }

  const secretKey = config.google.recaptcha.secretKey;
  const siteKey = config.google.recaptcha.siteKey;
  const projectId = config.google.recaptcha.projectId;

  try {
    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${secretKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: `${getHostHeader(req)}`,
        },
        body: JSON.stringify({
          event: {
            token: token,
            siteKey: siteKey,
            expectedAction: userAction,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return Response.json(
        { message: 'Error verifying reCAPTCHA', error: errText || response.statusText },
        { status: 500 }
      );
    }

    const verificationResult = await response.json();
    return Response.json(verificationResult, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unexpected server error';
    return Response.json({ message: 'Error verifying reCAPTCHA', error: msg }, { status: 500 });
  }
}
