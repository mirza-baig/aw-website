/* eslint-disable @typescript-eslint/no-explicit-any */
import config from 'aw.config.server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const COOKIE_NAME = 'aw_chat_token';

export async function POST(req: NextRequest) {
  try {
    // 1) Extract the new Beta fields from the request body
    const body = await req.json().catch(() => ({}));
    const {
      message_id,
      rating,
      responses = [],
      user_name = null,
      accuracy_comment = null,
      source_comment = null,
      completeness_comment = null,
      relevance_comment = null,
      session_id = null,
    } = body ?? {};

    // 2) Validate basic requirements
    if (typeof message_id !== 'number' || typeof rating !== 'number') {
      return NextResponse.json(
        {
          error: 'Missing/invalid "message_id" (number) or "rating" (number)',
        },
        { status: 400 }
      );
    }
    const apiBase = config.chatbot.api.baseUrl;
    if (!apiBase) {
      return NextResponse.json({ error: 'Server secrets not configured' }, { status: 500 });
    }

    // 3) Authentication Logic (Matches your existing proxy)
    let token: string | null = await getUserToken();

    if (!token) {
      token = await getServiceToken(apiBase);
      if (!token) {
        return NextResponse.json({ error: 'Could not obtain service token' }, { status: 502 });
      }
    }

    // 4) Construct the body for the Python FastAPI backend
    const backendBody = {
      message_id,
      rating,
      responses,
      user_name,
      accuracy_comment,
      source_comment,
      completeness_comment,
      relevance_comment,
      session_id,
    };

    // 5) Forward to the NEW Python endpoint we created earlier
    const fbResp = await fetch(`${apiBase}/ai/feedback/beta`, {
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

// --- Helper functions remain the same as your original proxy ---
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
