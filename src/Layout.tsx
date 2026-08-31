import { JSX } from 'react';
import { AppPlaceholder, DesignLibraryApp, Field, Page } from '@sitecore-content-sdk/nextjs';
import awClientConfig from 'aw.config.client';
import { BeforeAfterScript } from 'helpers/BeforeAfterScripts/BeforeAfterScripts';
import { BoldOrangeScript } from 'helpers/BoldOrangeScript/BoldOrangeScript';
import { GoogleTagManager } from 'helpers/GoogleTagManager/GoogleTagManager';
import { PageSchemaOrg } from 'helpers/SchemaOrg/PageSchemaOrg';
import { SkipLink } from 'helpers/SkipLink/SkipLink';
import { TrustArcScript } from 'helpers/TrustArcScript/TrustArcScript';
import { TypeKit } from 'helpers/TypeKit/TypeKit';
import { ApmErrorBoundary } from 'lib/apm/apm-error-boundary';
import { AppInsightsClient } from 'lib/apm/appinsights-client';
import { SourcingCookies } from 'lib/sourcing-cookies/sourcing-cookies';
import { WebsiteContextProvider } from 'lib/website/WebsiteContext';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import componentMap from '.sitecore/component-map';
import classNames from 'classnames';
import { WebsiteStaticState } from 'lib/website/website-state';
import { SetFeatureFlags } from 'lib/feature-flags/SetFeatureFlags';
import { DemoFeatureFlag } from 'lib/feature-flags/DemoFeatureFlag';
import { SchemaOrgGraph } from 'lib/schema-org-graph/SchemaOrgGraph';
import { AbandonRouteTracker } from 'helpers/Personalize/AbandonRouteTracker';

interface LayoutProps {
  page: Page & { customProps: WebsiteStaticState };
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

  const initialDynamicState = {
    isGenericModalOpen: false,
    selectedModalId: '',
    prevFocusedElementRef: null,
    bannerList: {
      mobileBannerList: [],
      desktopBannerList: [],
    },
    favoriteProducts: [],
  };

  return (
    <AppInsightsClient
      connectionString={awClientConfig.applicationInsights.connectionString}
      roleName={awClientConfig.app.application}
      roleInstance={awClientConfig.app.environment}
      additionalProperties={{
        'sitecore.siteName': page.customProps.siteInfo?.name ?? 'unknown',
        'app.name': awClientConfig.app.application,
        'app.environment': awClientConfig.app.environment,
        'app.role': awClientConfig.app.role,
      }}
    >
      <SchemaOrgGraph page={page} />
      <SetFeatureFlags values={page.customProps.featureFlags} />
      <ApmErrorBoundary disableSuspense={true}>
        <Scripts />
        <SitecoreStyles layoutData={layout} />
        {/* root placeholder for the app, which we add components to using route data */}
        <div className={classNames(mainClassPageEditing, page.customProps.theme)}>
          {mode.isDesignLibrary ? (
            route && (
              <DesignLibraryApp
                page={page}
                rendering={route}
                componentMap={componentMap}
                loadServerImportMap={() => import('.sitecore/import-map.server')}
              />
            )
          ) : (
            <>
              <SkipLink />
              <WebsiteContextProvider
                initialDynamicState={initialDynamicState}
                staticState={page.customProps}
              >
                <SourcingCookies />
                <BoldOrangeScript />
                <TrustArcScript />
                <GoogleTagManager />
                <TypeKit />
                <BeforeAfterScript />
                <PageSchemaOrg />
                <AbandonRouteTracker />
                <header>
                  <div id="header">
                    {route && (
                      <AppPlaceholder
                        page={page}
                        componentMap={componentMap}
                        name="headless-header"
                        rendering={route}
                      />
                    )}
                  </div>
                </header>
                <main id="main" tabIndex={-1} role="main">
                  <div id="hero">
                    {route && (
                      <AppPlaceholder
                        page={page}
                        componentMap={componentMap}
                        name="headless-hero"
                        rendering={route}
                      />
                    )}
                  </div>
                  <div id="content">
                    {route && (
                      <AppPlaceholder
                        page={page}
                        componentMap={componentMap}
                        name="headless-main"
                        rendering={route}
                      />
                    )}
                  </div>
                </main>
                <footer>
                  <div id="footer">
                    {route && (
                      <AppPlaceholder
                        page={page}
                        componentMap={componentMap}
                        name="headless-footer"
                        rendering={route}
                      />
                    )}
                  </div>
                </footer>
              </WebsiteContextProvider>
            </>
          )}
        </div>
        <DemoFeatureFlag page={page} />
      </ApmErrorBoundary>
    </AppInsightsClient>
  );
};

export default Layout;
