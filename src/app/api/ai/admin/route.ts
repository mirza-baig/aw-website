// src/rendering/src/pages/api/ai/admin/route.ts
import config from 'aw.config.server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const COOKIE_NAME = 'aw_chat_token';

export async function GET(req: NextRequest) {
  return handler(req);
}
export async function POST(req: NextRequest) {
  return handler(req);
}
export async function PUT(req: NextRequest) {
  return handler(req);
}
export async function PATCH(req: NextRequest) {
  return handler(req);
}
export async function DELETE(req: NextRequest) {
  return handler(req);
}

async function handler(req: NextRequest) {
  try {
    const apiBase = config.chatbot.api.baseUrl;
    if (!apiBase) {
      return NextResponse.json({ error: 'Server secrets not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Missing "path" query param' }, { status: 400 });
    }

    // 1) Try user token from cookie
    let token: string | null = await getUserToken();

    // 2) Else fall back to service account token
    if (!token) {
      token = await getServiceToken(apiBase);
      if (!token) {
        return NextResponse.json({ error: 'Could not obtain service token' }, { status: 502 });
      }
    }

    // Rebuild query string excluding "path"
    const qs = new URLSearchParams();
    qs.delete('path');
    const qsStr = qs.toString();
    const url = `${apiBase}/admin/${encodeURI(path)}${qsStr ? `?${qsStr}` : ''}`;

    // Forward request
    const method = req.method ?? 'GET';
    const isBodyAllowed = !['GET', 'HEAD'].includes(method);
    const requestBody = await req.json();
    const upstream = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        Authorization: `Bearer ${token}`,
      },
      body: isBodyAllowed && requestBody ? JSON.stringify(requestBody) : undefined,
    });

    // Stream JSON (or empty) back with original status
    const data = await safeJson(upstream);
    NextResponse.json(data ?? {}, { status: upstream.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    NextResponse.json(
      { error: 'Server error', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

async function getUserToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

async function getServiceToken(apiBase: string): Promise<string | null> {
  const username = config.chatbot.api.username;
  const password = config.chatbot.api.password;
  if (!username || !password) {
    return null;
  }

  // Adjust if your backend uses /user-login instead of /auth/login
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
