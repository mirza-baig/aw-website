import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { SearchQueryService } from 'lib/graphql/search-query-service';
import { AWSitecoreClient } from 'lib/sitecore-client';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';

import { FeatureToggleIds } from './feature-toggle-ids';
import { FeatureToggles } from './feature-toggles';

const defaultQuery = /* GraphQL */ `
  query getFeatureToggles {
    search(
      first: 50
      where: {
        AND: [
          { name: "_path" value: "${SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.Settings.FeatureToggles.Id}" operator: CONTAINS }
          { name: "_templates" value: "${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Data.FeatureToggles.FeatureToggle.Id}" operator: CONTAINS }
          { name: "_language", value: "en" }
        ]
      }
    ) {
      pageInfo {
        endCursor
        hasNext
      }
      results {
        ... on AW_FeatureToggle {
          id
          name
          featureState {
            targetItem {
              ... on Enum {
                value { value }
              }
            }
          }
          enableForSites {
            targetItems {
              name
              children(
                includeTemplateIDs: ["${SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.JssSettings.Id}"]
              ) {
                results {
                  name
                  children(
                    includeTemplateIDs: ["${SitecoreIds.Templates.Foundation.HeadlessExperienceAccelerator.Multisite.HeadlessSiteGrouping.Id}"]
                  ) {
                    results {
                      name
                      children {
                        results {
                          environment: field(name: "Environment") { value }
                          siteName: field(name: "SiteName") { value }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type FeatureState = 'Disabled' | 'All' | 'Selected';

interface Site {
  environment?: {
    value?: string;
  };
  siteName?: {
    value?: string;
  };
}

interface SiteGrouping {
  name?: string;
  children?: {
    results?: Site[];
  };
}

interface Settings {
  name?: string;
  children?: {
    results?: SiteGrouping[];
  };
}

type FeatureToggle = {
  id?: string;
  name?: string;
  featureState?: {
    targetItem?: {
      value?: {
        value?: FeatureState;
      };
    };
  };
  enableForSites?: {
    targetItems?: {
      name?: string;
      children?: {
        results?: Settings[];
      };
    }[];
  };
};

export class FeatureTogglesService {
  private readonly searchService: SearchQueryService;

  constructor(public options: { sitecoreClient: AWSitecoreClient }) {
    this.searchService = new SearchQueryService({
      sitecoreClient: options.sitecoreClient,
    });
  }

  protected get query(): string {
    return defaultQuery;
  }

  async fetchFeatureToggles(site: string) {
    const allFeatureToggles = await this.searchService.fetchAllResults<FeatureToggle>(
      this.query,
      {}
    );

    const lookup = this.getFeatureToggleLookup(allFeatureToggles);

    const featureToggles: FeatureToggles = Object.keys(FeatureToggleIds).reduce(
      (prev, curr: keyof FeatureToggles) => {
        prev[curr] = this.toggleIsEnabled(lookup, site, FeatureToggleIds[curr]);
        return prev;
      },
      {} as FeatureToggles
    );

    return featureToggles;
  }

  protected getFeatureToggleLookup(allFeatureToggles: FeatureToggle[]) {
    const lookup = allFeatureToggles.reduce(
      (prev, curr) => {
        return {
          ...prev,
          [normalizeGuid(curr?.id)]: curr,
        };
      },
      {} as Record<string, FeatureToggle | undefined>
    );

    return lookup;
  }

  protected toggleIsEnabled(
    lookup: Record<string, FeatureToggle | undefined>,
    site: string,
    featureToggleId: string
  ) {
    const featureFlag = lookup[normalizeGuid(featureToggleId)];
    const featureState = featureFlag?.featureState?.targetItem?.value?.value;
    switch (featureState) {
      case 'All':
        return true;

      case 'Selected':
        return this.toggleIsEnabledForSelectedSites(featureFlag, site);

      case 'Disabled':
      default:
        return false;
    }
  }

  protected toggleIsEnabledForSelectedSites(featureFlag: FeatureToggle | undefined, site: string) {
    const enabledForSites: string[] = [];
    //SQ-NOSCAN-START There is probably a way to reduce the nesting, but this is good enough for now
    featureFlag?.enableForSites?.targetItems?.forEach((x) =>
      x.children?.results?.forEach((x) =>
        x.children?.results?.forEach((x) =>
          x.children?.results?.forEach((x) => {
            const siteName = x.siteName?.value?.toLocaleLowerCase();
            if (siteName && !enabledForSites.includes(siteName)) {
              enabledForSites.push(siteName);
            }
          })
        )
      )
    );
    //SQ-NOSCAN-END
    return !!enabledForSites?.includes(site.toLocaleLowerCase());
  }
}
