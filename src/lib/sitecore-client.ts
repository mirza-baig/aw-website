import { Page, SiteInfo, SiteResolver } from '@sitecore-content-sdk/nextjs';
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

import { BreadcrumbItem, BreadcrumbService } from './breadcrumb/breadcrumb-service';
import { ThemeName } from './context/ThemeContext';
import { FlagValues } from './feature-flags/types';
import { WebsiteStaticState } from './website/website-state';
import { sites } from '.sitecore/aw-sites';

type SitecoreClientInit = ConstructorParameters<typeof SitecoreClient>[0];

export class AWSitecoreClient extends SitecoreClient {
  protected readonly breadcrumbService: BreadcrumbService;

  constructor(initOptions: SitecoreClientInit) {
    super(initOptions);
    this.breadcrumbService = new BreadcrumbService({ sitecoreClient: this });
  }

  async getWebsiteStaticState(
    page: Page,
    featureFlags: FlagValues,
    path: string[] = []
  ): Promise<WebsiteStaticState> {
    const siteInfo = this.getSiteInfoByName(page.layout.sitecore.context.site?.name);
    const customProps = {
      requestedPath: this.parsePath(path),
      breadcrumbs: await this.getBreadcrumbs(page.layout.sitecore.route?.itemId, page.locale),
      siteInfo,
      theme: (siteInfo?.theme ?? 'aw') as ThemeName,
      featureFlags,
    };
    return customProps;
  }

  async getBreadcrumbs(componentItemId?: string, language?: string): Promise<BreadcrumbItem[]> {
    return await this.breadcrumbService.getBreadcrumbData(componentItemId, language);
  }

  getSiteInfoByName(siteName?: string): SiteInfo | undefined {
    if (!siteName) {
      return undefined;
    }

    const siteInfo = sites.find((value) => value.name === siteName);

    return siteInfo!;
  }

  getSiteInfoByHost(host: string): SiteInfo {
    const resolver = new SiteResolver(sites);

    const site = resolver.getByHost(host);
    const siteInfo = this.getSiteInfoByName(site.name);

    return siteInfo ?? site;
  }
}

const client = new AWSitecoreClient({
  ...scConfig,
});

export default client;
