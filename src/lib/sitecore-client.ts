import { Page, SiteInfo, SiteResolver } from '@sitecore-content-sdk/nextjs';
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

import { BreadcrumbItem, BreadcrumbService } from './breadcrumb/breadcrumb-service';
import { ThemeName } from './context/ThemeContext';
import { FlagValues } from './feature-flags/types';
import { defaultValues, FeatureToggles } from './feature-toggles/feature-toggles';
import { FeatureTogglesService } from './feature-toggles/feature-toggles-service';
import { WebsiteStaticState } from './website/website-state';
import { sites } from '.sitecore/aw-sites';

type SitecoreClientInit = ConstructorParameters<typeof SitecoreClient>[0];

export class AWSitecoreClient extends SitecoreClient {
  protected readonly breadcrumbService: BreadcrumbService;
  protected readonly featureTogglesService: FeatureTogglesService;

  constructor(initOptions: SitecoreClientInit) {
    super(initOptions);
    this.breadcrumbService = new BreadcrumbService({ sitecoreClient: this });
    this.featureTogglesService = new FeatureTogglesService({ sitecoreClient: this });
  }

  async getPageWithCustomProps(
    page: Page,
    featureFlags: FlagValues,
    path: string[] = []
  ): Promise<Page & { customProps: WebsiteStaticState }> {
    const siteInfo = client.getSiteInfoByName(page.siteName);
    const customProps = {
      requestedPath: client.parsePath(path),
      featureToggles: await client.getFeatureToggles(page.siteName),
      breadcrumbs: await client.getBreadcrumbs(page.layout.sitecore.route?.itemId, page.locale),
      siteInfo,
      theme: (siteInfo?.theme ?? 'aw') as ThemeName,
      featureFlags,
    };
    return { ...page, customProps };
  }

  async getBreadcrumbs(componentItemId?: string, language?: string): Promise<BreadcrumbItem[]> {
    return await this.breadcrumbService.getBreadcrumbData(componentItemId, language);
  }

  async getFeatureToggles(siteName?: string): Promise<FeatureToggles> {
    if (siteName === undefined) {
      return defaultValues;
    }
    return await this.featureTogglesService.fetchFeatureToggles(siteName);
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
