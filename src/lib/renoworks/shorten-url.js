export class ShortenUrlError extends Error {
  constructor(url, reason, apiResponse) {
    super(`shortenUrl failed: ${reason}`);
    this.name = 'ShortenUrlError';
    this.url = url;
    this.reason = reason;
    this.apiResponse = apiResponse;
  }
}

export async function shortenUrl(url, abortSignal) {
  if (!url || url.length === 0) {
    throw new ShortenUrlError(url, 'Invalid URL');
  }

  try {
    const response = await fetch('/api/aw/design-tool/shorten-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Shortener route returned ${response.status}`);
    }

    const { shortenedUrl } = await response.json();

    if (!shortenedUrl) {
      throw new Error('Shortener route returned an empty URL');
    }

    return { url, shortenedUrl };
  } catch (error_) {
    if (error_?.name === 'AbortError') {
      console.info('[DesignSpecs][shortenUrl] Aborted (superseded by a newer request)', url);
    } else {
      console.error('[DesignSpecs][shortenUrl] Failed', { url, error: error_ });
    }
    throw new ShortenUrlError(url, 'API Error', error_);
  }
}
