import { DEFAULT_LLMS_TXT, LLMS_TXT_CONTENT_TYPE } from '@sitecore-content-sdk/content/site';
import { SiteResolver } from '@sitecore-content-sdk/nextjs';
import { AWGraphQLCrawlersService } from 'lib/crawlers/aw-graphql-crawlers-service';
import environment from 'lib/environment';
import sitecoreClient from 'lib/sitecore-client';
import { getHostNameFromRequest } from 'lib/utils/nextjs-utils/get-host-name-from-request';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { NextRequest } from 'next/server';

import sites from '.sitecore/sites.json';

export async function GET(req: NextRequest): Promise<Response> {
  const headers = { 'Content-Type': LLMS_TXT_CONTENT_TYPE };

  // Get hostname to check for staging because it is a 'true' production site just with the staging hostname prefix,
  // but we want to consider it a 'lower' environment from a crawler perspective
  const hostName = getHostNameFromRequest(req).toLowerCase();
  const isStageSite = hostName.startsWith('www.stage.') || hostName.startsWith('preview.stage.');

  // Disallow llms.txt in lower environments and preview sites
  const isProductionWww = environment.isProduction() && environment.isWww() && !isStageSite;
  if (!isProductionWww) {
    return new Response(DEFAULT_LLMS_TXT, {
      status: 404,
      headers,
    });
  }

  // Resolve site based on hostname
  const siteResolver = new SiteResolver(sites);
  const site = siteResolver.getByHost(hostName);

  // create crawlers graphql service
  const crawlersService = new AWGraphQLCrawlersService({
    sitecoreClient,
    siteName: site.name,
  });

  const llmsTxt = await crawlersService.fetchLlmsTxt();

  if (isNullOrWhitespace(llmsTxt)) {
    return new Response(DEFAULT_LLMS_TXT, {
      status: 404,
      headers,
    });
  }

  return new Response(llmsTxt, { headers });
}
