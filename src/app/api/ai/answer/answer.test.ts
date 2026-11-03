import { NextRequest } from 'next/server';
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  getServiceToken,
  getUserToken,
  handleStream,
  normalizeSessionId,
  resolveToken,
  safeJson,
  tryLogin,
} from './route';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('app > api > ai > answer', () => {
  describe('normalizeSessionId', () => {
    test('converts numeric string to number', () => {
      expect(normalizeSessionId('42')).toBe(42);
    });

    test('returns null for non-numeric string', () => {
      expect(normalizeSessionId('abc')).toBeNull();
    });

    test('converts empty string to 0 (Number("") === 0)', () => {
      expect(normalizeSessionId('')).toBe(0);
    });

    test('passes through a number', () => {
      expect(normalizeSessionId(7)).toBe(7);
    });

    test('returns null for undefined', () => {
      expect(normalizeSessionId(undefined)).toBeNull();
    });

    test('returns null for null', () => {
      expect(normalizeSessionId(null)).toBeNull();
    });

    test('returns null for boolean', () => {
      expect(normalizeSessionId(true)).toBeNull();
    });

    test('returns null for Infinity string', () => {
      expect(normalizeSessionId('Infinity')).toBeNull();
    });

    test('returns null for NaN string', () => {
      expect(normalizeSessionId('NaN')).toBeNull();
    });
  });

  describe('safeJson', () => {
    test('parses valid JSON response', async () => {
      const resp = new Response(JSON.stringify({ foo: 'bar' }), {
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await safeJson(resp);
      expect(result).toEqual({ foo: 'bar' });
    });

    test('returns null for non-JSON response', async () => {
      const resp = new Response('not json', {
        headers: { 'Content-Type': 'text/plain' },
      });
      const result = await safeJson(resp);
      expect(result).toBeNull();
    });

    test('returns null for empty body', async () => {
      const resp = new Response('', {
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await safeJson(resp);
      expect(result).toBeNull();
    });
  });

  describe('tryLogin', () => {
    test('returns access_token on success', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'tok123' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
      const token = await tryLogin('https://api.test/login', { username: 'u', password: 'p' });
      expect(token).toBe('tok123');
    });

    test('returns null on non-ok response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response('Unauthorized', { status: 401 })
      );
      const token = await tryLogin('https://api.test/login', { username: 'u', password: 'p' });
      expect(token).toBeNull();
    });

    test('returns null when response has no access_token', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ other: 'data' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
      const token = await tryLogin('https://api.test/login', { username: 'u', password: 'p' });
      expect(token).toBeNull();
    });

    test('sends correct request body', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'x' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
      await tryLogin('https://api.test/login', { username: 'admin', password: 'secret' });
      expect(fetchSpy).toHaveBeenCalledWith('https://api.test/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'secret' }),
      });
    });
  });

  describe('getUserToken', () => {
    test('extracts token from NextRequest cookies', () => {
      const req = new Request('http://localhost/api/ai/answer', {
        headers: { cookie: 'aw_chat_token=abc123; other=val' },
      });
      const nextReq = new NextRequest(req);
      expect(getUserToken(nextReq)).toBe('abc123');
    });

    test('returns undefined when token cookie is not present', () => {
      const req = new Request('http://localhost/api/ai/answer', {
        headers: { cookie: 'other=val' },
      });
      const nextReq = new NextRequest(req);
      expect(getUserToken(nextReq)).toBeUndefined();
    });
  });

  describe('getServiceToken', () => {
    test('returns null when no credentials configured', async () => {
      const cfg = (await import('aw.config.server')).default;
      const origUsername = cfg.chatbot.api.username;
      const origPassword = cfg.chatbot.api.password;
      cfg.chatbot.api.username = '';
      cfg.chatbot.api.password = '';

      const token = await getServiceToken('https://api.test');
      expect(token).toBeNull();

      cfg.chatbot.api.username = origUsername;
      cfg.chatbot.api.password = origPassword;
    });

    test('tries /auth/login first when username and password set', async () => {
      const cfg = (await import('aw.config.server')).default;
      const origUsername = cfg.chatbot.api.username;
      const origPassword = cfg.chatbot.api.password;
      cfg.chatbot.api.username = 'user1';
      cfg.chatbot.api.password = 'pass1';

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'primary-token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const token = await getServiceToken('https://api.test');
      expect(token).toBe('primary-token');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.test/auth/login',
        expect.anything()
      );

      cfg.chatbot.api.username = origUsername;
      cfg.chatbot.api.password = origPassword;
    });

    test('falls back to /all-login when /auth/login fails', async () => {
      const cfg = (await import('aw.config.server')).default;
      const origUsername = cfg.chatbot.api.username;
      const origPassword = cfg.chatbot.api.password;
      cfg.chatbot.api.username = 'user1';
      cfg.chatbot.api.password = 'pass1';

      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ access_token: 'fallback-token' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );

      const token = await getServiceToken('https://api.test');
      expect(token).toBe('fallback-token');
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);

      cfg.chatbot.api.username = origUsername;
      cfg.chatbot.api.password = origPassword;
    });

    test('returns null when both login attempts fail', async () => {
      const cfg = (await import('aw.config.server')).default;
      const origUsername = cfg.chatbot.api.username;
      const origPassword = cfg.chatbot.api.password;
      cfg.chatbot.api.username = 'user1';
      cfg.chatbot.api.password = 'pass1';

      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('', { status: 401 }))
        .mockResolvedValueOnce(new Response('', { status: 401 }));

      const token = await getServiceToken('https://api.test');
      expect(token).toBeNull();

      cfg.chatbot.api.username = origUsername;
      cfg.chatbot.api.password = origPassword;
    });
  });

  describe('resolveToken', () => {
    test('returns user token from cookie if present', async () => {
      const req = new Request('http://localhost/api/ai/answer', {
        headers: { cookie: 'aw_chat_token=user-tok' },
      });
      const nextReq = new NextRequest(req);
      const token = await resolveToken(nextReq, 'https://api.test');
      expect(token).toBe('user-tok');
    });

    test('falls back to service token when no cookie', async () => {
      const req = new Request('http://localhost/api/ai/answer');
      const nextReq = new NextRequest(req);

      const cfg = (await import('aw.config.server')).default;
      const origUsername = cfg.chatbot.api.username;
      const origPassword = cfg.chatbot.api.password;
      cfg.chatbot.api.username = 'svc';
      cfg.chatbot.api.password = 'svcpass';

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'svc-tok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const token = await resolveToken(nextReq, 'https://api.test');
      expect(token).toBe('svc-tok');

      cfg.chatbot.api.username = origUsername;
      cfg.chatbot.api.password = origPassword;
    });
  });

  describe('handleStream', () => {
    function streamFromChunks(chunks: string[]): ReadableStream<Uint8Array> {
      const encoder = new TextEncoder();
      return new ReadableStream({
        start(controller) {
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      });
    }

    test('returns empty response when answerResp has no body', () => {
      const answerResp = new Response(null, { status: 204 });
      Object.defineProperty(answerResp, 'body', { value: null });

      const result = handleStream(answerResp);
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });

    test('proxies stream lines as SSE data frames', async () => {
      const body = streamFromChunks([
        '{"type":"status","stage":"searching"}\n',
        '{"type":"done"}\n',
      ]);
      const answerResp = new Response(body, { status: 200 });

      const result = handleStream(answerResp);
      const text = await result.text();

      expect(text).toContain(': stream-open\n\n');
      expect(text).toContain('data: {"type":"status","stage":"searching"}\n\n');
      expect(text).toContain('data: {"type":"done"}\n\n');
    });

    test('sets correct SSE headers', () => {
      const body = streamFromChunks(['{"type":"done"}\n']);
      const answerResp = new Response(body, {
        status: 200,
        headers: { 'x-chat-stream': '1' },
      });

      const result = handleStream(answerResp);

      expect(result.headers.get('Content-Type')).toBe('text/event-stream; charset=utf-8');
      expect(result.headers.get('Cache-Control')).toBe('no-cache, no-transform');
      expect(result.headers.get('X-Accel-Buffering')).toBe('no');
      expect(result.headers.get('X-Chat-Stream')).toBe('1');
    });

    test('forwards upstream status code', async () => {
      const body = streamFromChunks(['{"error":"bad"}\n']);
      const answerResp = new Response(body, { status: 500 });

      const result = handleStream(answerResp);
      expect(result.status).toBe(500);
    });

    test('handles trailing buffer content without newline', async () => {
      const body = streamFromChunks(['{"type":"done"}']);
      const answerResp = new Response(body, { status: 200 });

      const result = handleStream(answerResp);
      const text = await result.text();

      expect(text).toContain('data: {"type":"done"}\n\n');
    });

    test('skips empty lines in stream', async () => {
      const body = streamFromChunks(['\n\n{"type":"done"}\n\n']);
      const answerResp = new Response(body, { status: 200 });

      const result = handleStream(answerResp);
      const text = await result.text();

      const dataFrames = text.split('\n\n').filter((s) => s.startsWith('data:'));
      expect(dataFrames).toHaveLength(1);
    });

    test('handles chunked data split across reads', async () => {
      // Split a JSON line across two chunks
      const body = streamFromChunks(['{"type":"don', 'e","message_id":7}\n']);
      const answerResp = new Response(body, { status: 200 });

      const result = handleStream(answerResp);
      const text = await result.text();

      expect(text).toContain('data: {"type":"done","message_id":7}\n\n');
    });

    test('defaults X-Chat-Stream to 1 when header missing', () => {
      const body = streamFromChunks(['{"type":"done"}\n']);
      const answerResp = new Response(body, { status: 200 });

      const result = handleStream(answerResp);
      expect(result.headers.get('X-Chat-Stream')).toBe('1');
    });
  });
});
