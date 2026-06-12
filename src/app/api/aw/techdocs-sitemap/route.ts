import sitecoreClient from 'lib/sitecore-client';
import { getHostNameFromRequest } from 'lib/utils/nextjs-utils/get-host-name-from-request';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { NextRequest } from 'next/server';
import { TechDocsSitemapService } from 'src/lib/techdocs-sitemap/techdocs-sitemap-service';
import { environment } from 'startup/environment';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  // Resolve site based on hostname
  const host = getHostNameFromRequest(req);
  const site = sitecoreClient.getSiteInfoByHost(host);

  // Get the sitemap paths
  const techDocsSitemapService = new TechDocsSitemapService({ sitecoreClient });

  // Get the preferred hostname
  const targetHostName = site.targetHostName as string | undefined;
  const hostName = isNullOrWhitespace(targetHostName) ? host : targetHostName;

  const result = await techDocsSitemapService.generateTechDocsSitemap(site, hostName);

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
