import { PersonalizeGeoData } from '@sitecore-content-sdk/nextjs';
import {
  AppRouterMultisiteProxy,
  defineProxy,
  LocaleProxy,
  PersonalizeProxy,
  RedirectsProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import { geolocation } from '@vercel/functions';
import { DraftModeWorkaroundMiddleware } from 'lib/middleware/draft-mode-workaround-middleware';
import { MediaRedirectsMiddleware } from 'lib/middleware/media-redirects-middleware';
import { SitecoreCDPIdentityMiddleware } from 'lib/middleware/sitecore-cdp-identity-middleware';
import { type NextRequest } from 'next/server';
import scConfig from 'sitecore.config';
import { environment } from 'startup/environment';

import { routing } from './i18n/routing';
import sites from '.sitecore/sites.json';

function extractGeoDataCb(req: NextRequest): PersonalizeGeoData {
  // Customization: Add geolocation data to personalize middleware request
  const { city, country, countryRegion: region } = geolocation(req);

  const geo = {
    city,
    country,
    region,
  };
  return geo;
}

export default function proxy(req: NextRequest) {
  // LocaleProxy and AppRouterMultisiteProxy must always run for App Router routing
  const locale = new LocaleProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    /**
     * List of all supported locales configured in routing.ts
     */
    locales: routing.locales.slice(),
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    // in multilanguage scenarios, we need locale proxy to always run first to ensure locale is set and used correctly by the rest of the proxies
    skip: () => false,
  });

  const multisite = new AppRouterMultisiteProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.multisite,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    skip: () => false,
  });

  // Instantiate proxies - they will use Edge config if available, otherwise fall back to local config
  // Each proxy will skip processing if required API configuration is not available
  const redirects = new RedirectsProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.api.local,
    ...scConfig.redirects,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    skip: () => false,
  });

  const personalize = new PersonalizeProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    // This function determines if the proxy should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge proxy runs on every request.
    // NOTE: Personalize requires Edge configuration and cannot work with local containers.
    // The proxy will disable itself if Edge config is not present.
    skip: () => false,
    // This is an example of how to provide geo data for personalization.
    // The provided callback will be called on each request to extract geo data.
    // extractGeoDataCb: () => {
    //   return {
    //     city: 'Athens',
    //     country: 'Greece',
    //     region: 'Attica',
    //   };
    // },
    extractGeoDataCb,
  });

  const mediaRedirects = new MediaRedirectsMiddleware({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    api: scConfig.api,
    // This function determines if the middleware should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge middleware runs on every request.
    skip: () => environment.isPreview() || environment.isLocal(), // Redirects don't work against a CM instance
  });

  const identity = new SitecoreCDPIdentityMiddleware({
    sites,
    skip: () => false,
  });

  const draftModeWorkaround = new DraftModeWorkaroundMiddleware({
    sites,
    skip: () => !environment.isPreview(),
  });

  return defineProxy(
    locale,
    multisite,
    redirects,
    mediaRedirects,
    personalize,
    identity,
    draftModeWorkaround
  ).exec(req);
}

export const config = {
  /*
   * Match all paths except for:
   * 1. API route handlers
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media) // Excluded to make media redirects work
   * 5. /healthz (Health check)
   * 7. all root files inside /public
   */
  matcher: [
    '/',
    '/((?!api/|sitemap|robots|_next/|healthz|sitecore/api/|favicon.ico|sc_logo.svg).*)',
  ],
};
