import { SiteResolver } from '@sitecore-content-sdk/nextjs';
import { AWGraphQLRobotsService } from 'lib/robots/aw-graphql-robots-service';
import sitecoreClient from 'lib/sitecore-client';
import { getHostNameFromRequest } from 'lib/utils/nextjs-utils/get-host-name-from-request';
import { NextRequest } from 'next/server';
import { environment } from 'startup/environment';

import sites from '.sitecore/sites.json';

export const dynamic = 'force-dynamic';

const DISALLOW = 'User-agent: *\nDisallow: /';

export async function GET(req: NextRequest): Promise<Response> {
  const headers = { 'Content-Type': 'text/plain' };

  // Disallow robots in lower environments and preview sites
  const isProductionWww = environment.isProduction() && environment.isWww();
  if (!isProductionWww) {
    return new Response(DISALLOW, { headers });
  }

  // Resolve site based on hostname
  const hostName = getHostNameFromRequest(req);
  const siteResolver = new SiteResolver(sites);
  const site = siteResolver.getByHost(hostName);

  // create robots graphql service
  const robotsService = new AWGraphQLRobotsService({
    sitecoreClient,
    siteName: site.name,
  });

  const robotsResult = await robotsService.fetchRobots();

  return new Response(robotsResult, { headers });
}
