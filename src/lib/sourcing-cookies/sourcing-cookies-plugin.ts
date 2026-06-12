import { SiteInfo } from '@sitecore-content-sdk/nextjs';

import { CookieInfo } from './cookie-info';

export type SourcingCookiesPluginParams = {
  searchParams: URLSearchParams;
  siteInfo: SiteInfo;
  location: Location;
};

export interface SourcingCookiesPlugin {
  /**
   * A function which will be called during path extraction
   */
  exec(params: SourcingCookiesPluginParams): CookieInfo[];
}
