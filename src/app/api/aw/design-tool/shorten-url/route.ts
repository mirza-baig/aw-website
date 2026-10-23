import { NextResponse } from 'next/server';

const ALLOWED_HOST_SUFFIXES = ['andersenwindows.com'];

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']); // Local development

const TINYURL_API = 'https://tinyurl.com/api-create.php';
const TINYURL_RESPONSE_PATTERN = /^https?:\/\/tinyurl\.com\/\S+$/;
const TIMEOUT_MS = 5000;
const MAX_URL_LENGTH = 2048;

const isAllowedHost = (hostname: string) =>
  ALLOWED_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { url?: unknown };
  const url = typeof body.url === 'string' ? body.url.trim() : '';

  if (!url || url.length > MAX_URL_LENGTH) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const isLocalDev = !IS_PRODUCTION && LOCAL_HOSTS.has(parsed.hostname);
  const isAllowedSite = parsed.protocol === 'https:' && isAllowedHost(parsed.hostname);

  if (!isLocalDev && !isAllowedSite) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 400 });
  }

  try {
    const response = await fetch(`${TINYURL_API}?url=${encodeURIComponent(parsed.toString())}`, {
      method: 'GET',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });

    const text = (await response.text()).trim();

    if (!response.ok || !TINYURL_RESPONSE_PATTERN.test(text)) {
      console.error('[shorten-url] Unexpected TinyURL response', {
        status: response.status,
        body: text.slice(0, 200),
      });
      return NextResponse.json({ error: 'Shortener failed' }, { status: 502 });
    }

    return NextResponse.json({ shortenedUrl: text }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[shorten-url] TinyURL request failed', error);
    return NextResponse.json({ error: 'Shortener unavailable' }, { status: 502 });
  }
}
