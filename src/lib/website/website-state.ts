import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { BreadcrumbItem } from 'lib/breadcrumb/breadcrumb-service';
import { FlagValues } from 'lib/feature-flags/types';
import { FeatureToggles } from 'lib/feature-toggles/feature-toggles';

import { FavoriteProductsState } from './favorite-products/state';
import { GenericModalState } from './generic-modal';
import { StickyBannerState } from './sticky-banner';
import { ThemeName } from './theme';

// Note: When adding properties to the static state, make sure to update the staticState and dynamicState methods
export type WebsiteStaticState = {
  theme: ThemeName;
  siteInfo?: SiteInfo;
  requestedPath?: string;
  featureToggles: FeatureToggles;
  breadcrumbs?: BreadcrumbItem[];
  featureFlags: FlagValues;
};

export type WebsiteDynamicState = FavoriteProductsState &
  GenericModalState &
  StickyBannerState & {
    [key: string]: unknown;
  };

export type WebsiteState = WebsiteStaticState & WebsiteDynamicState;
