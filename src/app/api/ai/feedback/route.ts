import config from 'aw.config.server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const COOKIE_NAME = 'aw_chat_token';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      message_id,
      is_positive,
      reason_code = null,
      comment_text = null,
      session_id = null,
    } = body ?? {};

    if (typeof message_id !== 'number' || typeof is_positive !== 'boolean') {
      return NextResponse.json(
        {
          error: 'Missing/invalid "message_id" (number) or "is_positive" (boolean)',
        },
        { status: 400 }
      );
    }

    const apiBase = config.chatbot.api.baseUrl;
    if (!apiBase) {
      return NextResponse.json({ error: 'Server secrets not configured' }, { status: 500 });
    }

    // 1) Try user token
    let token: string | null = await getUserToken();

    // 2) Fall back to service token if unauthenticated
    if (!token) {
      token = await getServiceToken(apiBase);
      if (!token) {
        return NextResponse.json({ error: 'Could not obtain service token' }, { status: 502 });
      }
    }

    const backendBody = { message_id, is_positive, reason_code, comment_text, session_id };

    const fbResp = await fetch(`${apiBase}/ai/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(backendBody),
    });

    const data = await safeJson(fbResp);

    return NextResponse.json(data ?? {}, {
      status: fbResp.status,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Server error',
        detail: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}

async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

async function getServiceToken(apiBase: string): Promise<string | null> {
  const username = config.chatbot.api.username;
  const password = config.chatbot.api.password;
  if (!username || !password) {
    return null;
  }

  // Match the backend route you implemented
  const resp = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!resp.ok) {
    return null;
  }
  const data = (await safeJson(resp)) as { access_token?: string } | null;
  return data?.access_token ?? null;
}

async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}
