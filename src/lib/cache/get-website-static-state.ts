import { collectSitecorePageCacheTags, Page } from '@sitecore-content-sdk/nextjs';
import { FlagValues } from 'lib/feature-flags/types';
import { WebsiteStaticState } from 'lib/website/website-state';
import { cacheTag } from 'next/cache';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';

type GetWebsiteStaticStateParams = {
  page: Page;
  path: string[];
  featureFlags: FlagValues;
};

/**
 * Gets page data using Next.js Cache Components and deterministic Sitecore cache tags.
 */
export async function getWebsiteStaticState(
  params: GetWebsiteStaticStateParams
): Promise<WebsiteStaticState> {
  'use cache';

  const { page, path, featureFlags } = params;

  const websiteStaticState = await client.getWebsiteStaticState(page, featureFlags, path);

  const tags = collectSitecorePageCacheTags({
    site: page.layout.sitecore.context.site?.name || scConfig.defaultSite,
    locale: page.layout.sitecore.context.language || scConfig.defaultLanguage,
    path: client.parsePath(path),
    route: page.layout.sitecore.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return websiteStaticState;
}
