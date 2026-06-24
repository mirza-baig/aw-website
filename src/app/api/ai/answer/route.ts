import config from 'aw.config.server';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const COOKIE_NAME = 'aw_chat_token';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { question, verbose = false, stream = false } = body;

    let session_id = (body?.session_id ?? body?.sessionId) as unknown;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing "question" string in body' }, { status: 400 });
    }

    session_id = normalizeSessionId(session_id);

    const apiBase = config.chatbot.api.baseUrl;
    if (!apiBase) {
      return NextResponse.json({ error: 'Server secrets not configured' }, { status: 500 });
    }

    const token = await resolveToken(req, apiBase);
    if (!token) {
      return NextResponse.json({ error: 'Could not obtain service token' }, { status: 502 });
    }

    const answerResp = await fetch(`${apiBase}/ai/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Referer: req.headers.get('referer') ?? req.headers.get('origin') ?? 'unknown',
        ...(stream ? { Accept: 'application/x-ndjson' } : {}),
      },
      body: JSON.stringify({ question, verbose, session_id, stream }),
    });

    if (stream) {
      return handleStream(answerResp);
    }

    const data = await safeJson(answerResp);
    return NextResponse.json(data ?? {}, { status: answerResp.status });
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

export function normalizeSessionId(raw: unknown): number | null {
  if (typeof raw === 'string') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof raw === 'number') {
    return raw;
  }
  return null;
}

export async function resolveToken(req: NextRequest, apiBase: string): Promise<string | null> {
  const userToken = getUserToken(req);
  if (userToken) {
    return userToken;
  }
  return getServiceToken(apiBase);
}

export function handleStream(answerResp: Response): Response {
  if (!answerResp.body) {
    return new Response(null, { status: answerResp.status });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Pipe upstream NDJSON body into SSE data frames (fire-and-forget)
  (async () => {
    try {
      await writer.write(encoder.encode(': stream-open\n\n'));

      const reader = answerResp.body!.getReader();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
              continue;
            }
            await writer.write(encoder.encode(`data: ${trimmed}\n\n`));
          }
        }
      }

      const tail = buffer.trim();
      if (tail) {
        await writer.write(encoder.encode(`data: ${tail}\n\n`));
      }
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: answerResp.status,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'X-Chat-Stream': answerResp.headers.get('x-chat-stream') ?? '1',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

export function getUserToken(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value;
}

export async function getServiceToken(apiBase: string): Promise<string | null> {
  const username = config.chatbot.api.username?.trim() ?? '';
  const password = config.chatbot.api.password?.trim() ?? '';
  if (!username && !password) {
    return null;
  }

  if (username && password) {
    const token = await tryLogin(`${apiBase}/auth/login`, { username, password });
    if (token) {
      return token;
    }
  }

  if (password) {
    const token = await tryLogin(`${apiBase}/all-login`, {
      api_key: password,
      username: username ?? 'service-user',
      password: password ?? 'service-password',
    });
    if (token) {
      return token;
    }
  }

  return null;
}

export async function tryLogin(url: string, body: Record<string, string>): Promise<string | null> {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    return null;
  }
  const data = (await safeJson(resp)) as { access_token?: string } | null;
  return data?.access_token ?? null;
}

export async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}
