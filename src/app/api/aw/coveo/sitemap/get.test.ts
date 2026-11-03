import { faker } from '@faker-js/faker';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import sitemapService from 'lib/coveo/sitemap-service';
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { handler, schema } from './get';

const rootId = SitecoreIds.Content.AndersenCorporation.AndersenWindows.Id;
const host = 'example.com';

function requestWith(hostName: string = host, forwardedProto: string | null = null): NextRequest {
  return {
    headers: {
      get: (key: string) => {
        if (key === 'host') {
          return hostName;
        }
        if (key === 'x-forwarded-proto') {
          return forwardedProto;
        }
        return null;
      },
    },
    nextUrl: { protocol: 'https:' },
  } as unknown as NextRequest;
}

describe('app > api > aw > coveo > sitemap', async () => {
  describe('schema', () => {
    it('accepts an empty request', async () => {
      const isValid = await schema.isValid({});
      expect(isValid).toBe(true);
    });

    it('defaults rootitemid to the Andersen Windows root', async () => {
      const result = await schema.validate({});
      expect(result.rootitemid).toBe(rootId);
    });

    it('keeps a provided rootitemid', async () => {
      const rootitemid = faker.string.uuid();
      const result = await schema.validate({ rootitemid });
      expect(result.rootitemid).toBe(rootitemid);
    });

    it('accepts item, after and debug params', async () => {
      const isValid = await schema.isValid({
        item: faker.word.noun(),
        after: faker.string.alphanumeric(10),
        debug: '',
      });
      expect(isValid).toBe(true);
    });
  });

  describe('handler', async () => {
    const buildSitemap = vi.spyOn(sitemapService, 'buildSitemap').mockResolvedValue('<urlset />');
    const buildSitemapIndex = vi
      .spyOn(sitemapService, 'buildSitemapIndex')
      .mockResolvedValue('<sitemapindex />');
    const buildItemHtml = vi
      .spyOn(sitemapService, 'buildItemHtml')
      .mockReturnValue('<html></html>');

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('returns item html when item is provided', async () => {
      const item = faker.word.noun();
      const response = await handler({ item, rootitemid: rootId }, requestWith());

      expect(buildItemHtml).toHaveBeenCalledWith(item);
      expect(response.headers.get('Content-Type')).toBe('text/html;charset=utf-8');
      expect(await response.text()).toBe('<html></html>');
      expect(buildSitemap).not.toHaveBeenCalled();
      expect(buildSitemapIndex).not.toHaveBeenCalled();
    });

    it('builds a sitemap page when after is provided', async () => {
      const after = faker.string.alphanumeric(10);
      const response = await handler({ after, rootitemid: rootId }, requestWith());

      expect(buildSitemap).toHaveBeenCalledWith(rootId, after, `https://${host}`);
      expect(response.headers.get('Content-Type')).toBe('text/xml;charset=utf-8');
      expect(await response.text()).toBe('<urlset />');
      expect(buildSitemapIndex).not.toHaveBeenCalled();
    });

    it('builds the sitemap index when neither item nor after is provided', async () => {
      const response = await handler({ rootitemid: rootId }, requestWith());

      expect(buildSitemapIndex).toHaveBeenCalledWith(rootId, false, `https://${host}`);
      expect(response.headers.get('Content-Type')).toBe('text/xml;charset=utf-8');
      expect(await response.text()).toBe('<sitemapindex />');
    });

    it('enables size output when the debug param is present', async () => {
      await handler({ debug: '', rootitemid: rootId }, requestWith());
      expect(buildSitemapIndex).toHaveBeenCalledWith(rootId, true, `https://${host}`);
    });

    it('derives the host from the request', async () => {
      await handler({ rootitemid: rootId }, requestWith('www.andersenwindows.com'));
      expect(buildSitemapIndex).toHaveBeenCalledWith(
        rootId,
        false,
        'https://www.andersenwindows.com'
      );
    });

    it('uses the request scheme from x-forwarded-proto for the host', async () => {
      await handler({ rootitemid: rootId }, requestWith('localhost', 'http'));
      expect(buildSitemapIndex).toHaveBeenCalledWith(rootId, false, 'http://localhost');
    });
  });
});
