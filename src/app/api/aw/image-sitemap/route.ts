import { ImageSitemapService } from 'lib/image-sitemap/image-sitemap-service';
import sitecoreClient from 'lib/sitecore-client';
import { getHostNameFromRequest } from 'lib/utils/nextjs-utils/get-host-name-from-request';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { NextRequest } from 'next/server';
import { environment } from 'startup/environment';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  const path = req.nextUrl.searchParams.get('path');

  // Resolve site based on hostname
  const host = getHostNameFromRequest(req);
  const site = sitecoreClient.getSiteInfoByHost(host);

  // Get the sitemap paths
  const imageSitemapService = new ImageSitemapService({ sitecoreClient });

  // Get the preferred hostname
  const targetHostName = site.targetHostName as string | undefined;
  const hostName = isNullOrWhitespace(targetHostName) ? host : targetHostName;

  let result: string;
  if (path) {
    result = await imageSitemapService.generateImageSitemap(site, path, hostName);
  } else {
    result = await imageSitemapService.generateImageSitemapIndex(site, hostName);
  }

  // Set the cache control header
  const maxage = environment.isProduction() ? 300 : 10;
  const staleWhileRevalidate = environment.isProduction() ? 600 : 60;

  return new Response(result, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': `public, s-maxage=${maxage}, stale-while-revalidate=${staleWhileRevalidate}`,
    },
  });
}
