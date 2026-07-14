import { Debug } from 'lib/constants/debug';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import sitemapService from 'lib/coveo/sitemap-service';
import { getHostNameFromRequest } from 'lib/utils/nextjs-utils/get-host-name-from-request';
import { getSchemeFromRequest } from 'lib/utils/nextjs-utils/get-scheme-from-request';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { searchParams } from 'lib/utils/nextjs-utils/route-handlers/extractors/search-params';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';
import { NextRequest } from 'next/server';
import { object, string } from 'yup';

const debug = Debug.api.coveo.sitemap;

const rootId = SitecoreIds.Content.AndersenCorporation.AndersenWindows.Id;

export const schema = object({
  item: string().optional(),
  after: string().optional(),
  debug: string().optional(),
  rootitemid: string().default(rootId),
});

type Body = {
  item?: string;
  after?: string;
  debug?: string;
  rootitemid: string;
};

const xmlResponse = (data: string): Response =>
  new Response(data, { headers: { 'Content-Type': 'text/xml;charset=utf-8' } });

const htmlResponse = (data: string): Response =>
  new Response(data, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });

export async function handler(body: Body, request: NextRequest): Promise<Response> {
  debug('processing request: %o', body);

  const host = `${getSchemeFromRequest(request)}://${getHostNameFromRequest(request)}`;
  const rootItemId = body.rootitemid;

  if (body.item) {
    debug('returning item html for %s', body.item);
    return htmlResponse(sitemapService.buildItemHtml(body.item));
  }

  if (body.after !== undefined) {
    debug('building sitemap for root %s after %s', rootItemId, body.after);
    return xmlResponse(await sitemapService.buildSitemap(rootItemId, body.after, host));
  }

  debug('building sitemap index for root %s', rootItemId);
  return xmlResponse(
    await sitemapService.buildSitemapIndex(rootItemId, body.debug !== undefined, host)
  );
}

const extractor = searchParams();

export const GET = wrap(validating({ schema, handler, extractor })).in(
  errorCatching({ debug }),
  startStopTimings({ debug })
);
