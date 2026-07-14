import { Blob } from 'buffer';
import { Debug } from 'lib/constants/debug';
import { coveoIndexingItemFetcher } from 'lib/coveo/indexing/item-fetcher';
import { graphQLCoveoSitemapIndexService } from 'lib/coveo/indexing/item-fetcher/graphql-coveo-sitemap-index-service';
import { coveoIndexingItemProcessor } from 'lib/coveo/indexing/item-processor';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';
import xml from 'xmlbuilder';

const debug = Debug.api.coveo.sitemap;

const pageSize = 50;

/**
 * Builds the Coveo sitemap XML for a single page of indexable items under the
 * given root, running each item through the indexing processors.
 *
 * @param rootItemId the Sitecore item id to fetch indexable descendants for
 * @param after the GraphQL cursor identifying the page to fetch
 * @param host the public host used to build absolute urls
 * @returns the serialized `<urlset>` sitemap XML string
 */
async function buildSitemap(rootItemId: string, after: string, host?: string): Promise<string> {
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

  return root.end();
}

// Only needed for debugging to see size of each sitemap page
const asyncForEach = async <T>(array: T[], func: (arg0: T) => Promise<void>) => {
  await array.reduce(async (promise, entry) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    await func(entry);
  }, Promise.resolve());
};

async function getSize(url: string): Promise<string | undefined> {
  // Size measurement is a debugging aid only, so a failure to probe a page must
  // never fail the whole sitemap response.
  try {
    const response = await fetch(url);
    const text = await response.text();
    return `${new Blob([text]).size / 1000}KB`;
  } catch (error) {
    debug('failed to measure sitemap page size for %s: %s', url, getErrorMessage(error));
    return undefined;
  }
}

/**
 * Builds the Coveo sitemap index XML, listing a `<sitemap>` entry per page of
 * indexable items under the given root.
 *
 * @param rootItemId the Sitecore item id to page through
 * @param includeSize when true, includes a `<size>` element per page (debugging only)
 * @param host the public host used to build absolute urls
 * @returns the serialized `<sitemapindex>` XML string
 */
async function buildSitemapIndex(
  rootItemId: string,
  includeSize: boolean,
  host?: string
): Promise<string> {
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
      if (includeSize) {
        const size = await getSize(url);
        if (size) {
          sitemap.ele('size').text(size);
        }
      }
    }
  });

  return root.end();
}

/**
 * Builds a minimal HTML document used to expose a single item for crawling.
 *
 * @param item the item title to render
 * @returns the HTML document string
 */
function buildItemHtml(item: string): string {
  return `<html><head><title>${item}</title></head><body /></html>`;
}

export const sitemapService = {
  buildSitemap,
  buildSitemapIndex,
  buildItemHtml,
};

export default sitemapService;
