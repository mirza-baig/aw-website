import { Blob } from 'buffer';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { coveoIndexingItemFetcher } from 'lib/coveo/indexing/item-fetcher';
import { graphQLCoveoSitemapIndexService } from 'lib/coveo/indexing/item-fetcher/graphql-coveo-sitemap-index-service';
import { coveoIndexingItemProcessor } from 'lib/coveo/indexing/item-processor';
import { getHostNameFromRequest } from 'lib/utils/nextjs-utils/get-host-name-from-request';
import { NextRequest } from 'next/server';
import xml from 'xmlbuilder';

export const dynamic = 'force-dynamic';

const pageSize = 50;
const rootId = SitecoreIds.Content.AndersenCorporation.AndersenWindows.Id;

async function sendXml(rootItemId: string, after: string, host?: string): Promise<Response> {
  // Get the indexable items
  const indexableItems = rootItemId ? await coveoIndexingItemFetcher.fetch(rootItemId, after) : [];

  // Run items through processors
  const processedItems = await Promise.all(
    indexableItems.map((indexableItem) => coveoIndexingItemProcessor.process(indexableItem, host))
  );

  // Convert to XML string
  const root = xml
    .create('urlset', { encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    .att('xmlns:coveo', 'https://www.coveo.com/en/company/about-us')
    .att(
      'xsi:schemaLocation',
      'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd'
    );

  processedItems.forEach((sitemapItem) => {
    const url = root.ele('url');
    sitemapItem.serialize(url);
  });
  const data = root.end();

  return new Response(data, { headers: { 'Content-Type': 'text/xml;charset=utf-8' } });
}

// Only needed for debugging to see size of
const asyncForEach = async <T>(array: T[], func: (arg0: T) => Promise<void>) => {
  await array.reduce(async (promise, entry) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    await func(entry);
  }, Promise.resolve());
};

async function getSize(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  const size = `${new Blob([text]).size / 1000}KB`;
  return size;
}

async function sendXmlIndex(rootItemId: string, debug: boolean, host?: string): Promise<Response> {
  // Convert to XML string
  const root = xml
    .create('sitemapindex', { encoding: 'utf-8' })
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  const results = await graphQLCoveoSitemapIndexService.fetch(rootItemId, pageSize);

  await asyncForEach(results, async (result) => {
    if (result.endCursor !== undefined && result.endCursor !== null && result.hasNext) {
      const sitemap = root.ele('sitemap');
      const url = `${host}/coveo-sitemap.xml?rootitemid=${rootItemId}&after=${result.endCursor}`;

      sitemap.ele('loc').text(url);
      if (debug) {
        const size = await getSize(url);
        sitemap.ele('size').text(size);
      }
    }
  });

  const data = root.end();

  return new Response(data, { headers: { 'Content-Type': 'text/xml;charset=utf-8' } });
}

async function sendHtml(item: string): Promise<Response> {
  return new Response(`<html><head><title>${item}</title></head><body /></html>`, {
    headers: { 'Content-Type': 'text/html;charset=utf-8' },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  const item = req.nextUrl.searchParams.get('item');
  const after = req.nextUrl.searchParams.get('after');
  const debug = req.nextUrl.searchParams.get('debug');
  const rootItemId = req.nextUrl.searchParams.get('rootitemid') ?? rootId;
  const host = `https://${getHostNameFromRequest(req)}`;

  if (item) {
    if (Array.isArray(item)) {
      return sendHtml(item.join(' '));
    } else {
      return sendHtml(item);
    }
  } else {
    if (after !== undefined && after !== null) {
      return await sendXml(rootItemId, after, host);
    }
    return await sendXmlIndex(rootItemId, debug !== null, host);
  }
}
