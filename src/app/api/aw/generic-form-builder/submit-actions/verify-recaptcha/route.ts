import config from 'aw.config.server';
import { NextRequest } from 'next/server';
function getHostHeader(req: NextRequest): string {
  const host = req.headers.get('host') ?? 'localhost';
  return host.split(':')[0];
}
type verifyCaptchaRequestBody = {
  token?: string;
  userAction?: string;
};
export async function POST(req: NextRequest): Promise<Response> {
  const body: verifyCaptchaRequestBody = await req.json();
  const token = body?.token;
  const userAction = body?.userAction;
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
    if (response.ok) {
      const verificationResult = await response.json();
      return Response.json(verificationResult, { status: 200 });
    } else {
      const errText = await response.text();
      return Response.json(
        { message: 'Error verifying reCAPTCHA', error: errText || response.statusText },
        { status: 500 }
      );
    }
  } catch {
    return Response.json({ message: 'Error verifying reCAPTCHA' }, { status: 500 });
  }
}
