import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@sitecore-content-sdk/nextjs/proxy', () => ({
  ProxyBase: class ProxyBase {
    constructor(protected config: unknown) {}
    isPrefetch() {
      return false;
    }
    isPreview() {
      return false;
    }
  },
}));

vi.mock('@sitecore-content-sdk/core', () => ({
  getCoreContext: vi.fn(() => {
    throw new Error('not initialized');
  }),
}));

vi.mock('@sitecore-content-sdk/nextjs', () => ({
  initContentSdk: vi.fn(),
  analyticsProxyAdapter: vi.fn(() => 'analyticsAdapter'),
  personalizeProxyAdapter: vi.fn(() => 'personalizeAdapter'),
}));

vi.mock('@sitecore-content-sdk/analytics-core', () => ({
  analyticsPlugin: vi.fn(() => 'analyticsPlugin'),
}));

vi.mock('@sitecore-content-sdk/events', () => ({
  eventsPlugin: vi.fn(() => 'eventsPlugin'),
  identity: vi.fn(),
}));

vi.mock('@sitecore-content-sdk/personalize', () => ({
  personalizeServerPlugin: vi.fn(() => 'personalizePlugin'),
}));

vi.mock('lib/constants/debug', () => ({
  Debug: {
    cdpIdentity: vi.fn(),
  },
}));

vi.mock('lib/salesforce/communities/ecid-decrypt-edge/ecid-decrypt-edge', () => ({
  decryptEcidEdge: vi.fn(),
}));

vi.mock('sitecore.config', () => ({
  default: {
    api: {
      edge: {
        clientContextId: 'test-context-id',
        edgeUrl: 'https://edge.example.com',
      },
    },
    defaultSite: 'default',
  },
}));

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({ cookies: { set: vi.fn(), get: vi.fn() } })),
  },
}));

import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { identity } from '@sitecore-content-sdk/events';
import { initContentSdk } from '@sitecore-content-sdk/nextjs';
import { Debug } from 'lib/constants/debug';
import { decryptEcidEdge } from 'lib/salesforce/communities/ecid-decrypt-edge/ecid-decrypt-edge';
import { NextRequest, NextResponse } from 'next/server';

import { SitecoreCDPIdentityMiddleware } from './sitecore-cdp-identity-middleware';

// 32 random bytes, base64-encoded — satisfies the key format check
const MOCK_KEY = btoa(String.fromCodePoint(...new Uint8Array(32)));

function makeRequest(
  sfEcid: string | null,
  opts: {
    host?: string;
    scRewriteHeader?: string;
    scSiteHeader?: string;
    scSiteCookie?: string;
    isBotRequest?: boolean;
  } = {}
): NextRequest {
  const ecidParam = sfEcid ? `?sf_ecid=${encodeURIComponent(sfEcid)}` : '';
  const url = new URL(`https://example.com/page${ecidParam}`);
  return {
    nextUrl: { searchParams: url.searchParams },
    headers: {
      get: (name: string) => {
        if (name === 'x-sc-rewrite') {
          return opts.scRewriteHeader ?? null;
        }
        if (name === 'sc_site') {
          return opts.scSiteHeader ?? null;
        }
        if (name === 'host') {
          return opts.host ?? 'www.example.com';
        }
        return null;
      },
    },
    cookies: {
      get: (name: string) => {
        if (name === 'sc_is_bot' && opts.isBotRequest) {
          return { value: '1' };
        }
        if (name === 'sc_site' && opts.scSiteCookie) {
          return { value: opts.scSiteCookie };
        }
        return undefined;
      },
    },
  } as unknown as NextRequest;
}

describe('lib > middleware > SitecoreCDPIdentityMiddleware', () => {
  let middleware: SitecoreCDPIdentityMiddleware;

  beforeEach(() => {
    vi.clearAllMocks();
    middleware = new SitecoreCDPIdentityMiddleware({} as never);
    process.env.AW_SF_ECID_DECRYPTION_KEY = MOCK_KEY;
  });

  afterEach(() => {
    delete process.env.AW_SF_ECID_DECRYPTION_KEY;
  });

  describe('when request is a preview', () => {
    it('returns the response early without processing sf_ecid', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(middleware, 'isPreview' as any).mockReturnValue(true);
      const mockResponse = {} as never;
      const result = await middleware.handle(makeRequest('sometoken'), mockResponse);
      expect(result).toBe(mockResponse);
      expect(decryptEcidEdge).not.toHaveBeenCalled();
      expect(Debug.cdpIdentity).toHaveBeenCalledWith('skipped (isPreview)');
    });
  });

  describe('when no sf_ecid query parameter is present', () => {
    it('returns the provided response without calling decryptEcidEdge', async () => {
      const request = makeRequest(null);
      const mockResponse = {} as never;
      const result = await middleware.handle(request, mockResponse);
      expect(result).toBe(mockResponse);
      expect(decryptEcidEdge).not.toHaveBeenCalled();
    });

    it('returns NextResponse.next() when no response argument is provided', async () => {
      const request = makeRequest(null);
      await middleware.handle(request);
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe('when the request is flagged as a bot', () => {
    it('returns response early without decrypting', async () => {
      const mockResponse = {} as never;
      const result = await middleware.handle(
        makeRequest('sometoken', { isBotRequest: true }),
        mockResponse
      );
      expect(result).toBe(mockResponse);
      expect(decryptEcidEdge).not.toHaveBeenCalled();
      expect(Debug.cdpIdentity).toHaveBeenCalledWith('skipped (bot request)');
    });
  });

  describe('when sf_ecid is present but the decryption key env var is missing', () => {
    it('logs a debug message and returns response without decrypting', async () => {
      delete process.env.AW_SF_ECID_DECRYPTION_KEY;
      const mockResponse = {} as never;
      const result = await middleware.handle(makeRequest('sometoken'), mockResponse);
      expect(result).toBe(mockResponse);
      expect(Debug.cdpIdentity).toHaveBeenCalledWith(
        'skipped (no decryption key): AW_SF_ECID_DECRYPTION_KEY is not set'
      );
      expect(decryptEcidEdge).not.toHaveBeenCalled();
    });
  });

  describe('when decryptEcidEdge returns null', () => {
    it('logs a debug message and returns response without calling identity()', async () => {
      vi.mocked(decryptEcidEdge).mockResolvedValue(null);
      const mockResponse = {} as never;
      const result = await middleware.handle(makeRequest('badtoken'), mockResponse);
      expect(result).toBe(mockResponse);
      expect(Debug.cdpIdentity).toHaveBeenCalledWith('skipped (failed to decrypt sf_ecid): %o', {
        sfEcid: 'badtoken',
      });
      expect(identity).not.toHaveBeenCalled();
    });
  });

  describe('when decryption succeeds', () => {
    beforeEach(() => {
      vi.mocked(decryptEcidEdge).mockResolvedValue('CONTACT_123');
      vi.mocked(identity).mockResolvedValue(null);
    });

    it('calls decryptEcidEdge with the sf_ecid token and the env key', async () => {
      await middleware.handle(makeRequest('validtoken'));
      expect(decryptEcidEdge).toHaveBeenCalledWith('validtoken', MOCK_KEY);
    });

    it('calls initContentSdk with the edge config', async () => {
      await middleware.handle(makeRequest('validtoken'));
      expect(initContentSdk).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ contextId: 'test-context-id' }),
        })
      );
    });

    it('calls identity() with the correct Salesforce identifiers payload', async () => {
      await middleware.handle(makeRequest('validtoken'));
      expect(identity).toHaveBeenCalledWith({
        channel: 'WEB',
        currency: 'USD',
        language: 'EN',
        identifiers: [{ provider: 'AW_SF_LEAD_OR_CONTACT_ID', id: 'CONTACT_123' }],
      });
    });

    it('strips the www. prefix from the host header for the analytics cookieDomain', async () => {
      await middleware.handle(makeRequest('validtoken', { host: 'www.mysite.com' }));
      expect(analyticsPlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ cookieDomain: 'mysite.com' }),
        })
      );
    });

    it('uses the x-sc-rewrite header as the site name when present', async () => {
      await middleware.handle(makeRequest('validtoken', { scRewriteHeader: 'rewrite-site' }));
      expect(initContentSdk).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ siteName: 'rewrite-site' }),
        })
      );
    });

    it('falls back to the sc_site header when x-sc-rewrite is absent', async () => {
      await middleware.handle(makeRequest('validtoken', { scSiteHeader: 'header-site' }));
      expect(initContentSdk).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ siteName: 'header-site' }),
        })
      );
    });

    it('falls back to the sc_site cookie when both site headers are absent', async () => {
      await middleware.handle(makeRequest('validtoken', { scSiteCookie: 'cookie-site' }));
      expect(initContentSdk).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({ siteName: 'cookie-site' }),
        })
      );
    });

    it('logs a debug message but still returns the response when identity() throws', async () => {
      vi.mocked(identity).mockRejectedValue(new Error('identity error'));
      const mockResponse = {} as never;
      const result = await middleware.handle(makeRequest('validtoken'), mockResponse);
      expect(result).toBe(mockResponse);
      expect(Debug.cdpIdentity).toHaveBeenCalledWith(
        'failed to push server identity context: %o',
        expect.any(Error)
      );
    });
  });
});
