import config from 'aw.config.server';
import crypto from 'crypto';
import type { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
// Normalize code by trimming whitespace and converting to lowercase
function normalizeCode(input: string) {
  return input.trim().toLowerCase();
}

// Compute SHA-256 hex digest
function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// Constant-time comparison to prevent timing attacks
function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  return crypto.timingSafeEqual(bufA, bufB);
}

// Load configuration from environment variables
function getConfig() {
  const zoomUrl = config.shareholderRegistration.zoomURL;
  const salt = config.shareholderRegistration.salt;
  const codesRaw = config.shareholderRegistration.codesSha256;

  let codesSha256: string[] = [];

  try {
    const parsed = JSON.parse(codesRaw);
    if (Array.isArray(parsed)) {
      codesSha256 = parsed;
    }
  } catch {
    /* ignore */
  }
  return { zoomUrl, salt, codesSha256 };
}

export async function POST(req: NextRequest): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    });
  }

  try {
    const body = (await req.json().catch(() => null)) as { code?: string } | null;
    const code = body?.code;

    if (!code) {
      return Response.json({ ok: false, error: 'Missing code.' }, { status: 400 });
    }

    const { zoomUrl, salt, codesSha256 } = getConfig();
    if (!zoomUrl || !salt || !codesSha256.length) {
      return Response.json({ ok: false, error: 'Service not configured.' }, { status: 500 });
    }

    const candidate = sha256Hex(`${salt}:${normalizeCode(code)}`);
    const match = codesSha256.some((stored) => timingSafeEqualHex(stored, candidate));
    if (!match) {
      return Response.json({ ok: false, error: 'Invalid code.' }, { status: 401 });
    }

    // Successful validation
    return Response.json({ ok: true, redirectTo: zoomUrl }, { status: 200 });
  } catch {
    return Response.json({ ok: false, error: 'Unexpected error.' }, { status: 500 });
  }
}
