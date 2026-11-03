/* eslint-disable @typescript-eslint/no-explicit-any */
import config from 'aw.config.server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const COOKIE_NAME = 'aw_chat_token';

export async function GET(_req: NextRequest) {
  try {
    const apiBase = config.chatbot.api.baseUrl;
    if (!apiBase) {
      return NextResponse.json({ error: 'Server secrets not configured' }, { status: 500 });
    }

    // 1) Try user token, fallback to service token
    let token: string | null = await getUserToken();
    if (!token) {
      token = await getServiceToken(apiBase);
      if (!token) {
        return NextResponse.json({ error: 'Could not obtain service token' }, { status: 502 });
      }
    }

    const resp = await fetch(`${apiBase}/ai/feedback/questions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await safeJson(resp);
    // Return the .questions array directly to make frontend life easier

    return NextResponse.json(data?.questions ?? [], {
      status: resp.status,
    });
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

// --- Helpers (Same as your other proxies) ---

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
