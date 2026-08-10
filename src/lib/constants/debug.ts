import debug from 'debug';

const defaultNamespace = 'aw';
const coveoRootNamespace = 'coveo';

export type Debugger = debug.Debugger;

export const Debug = {
  coveoItemFetcher: debug(`${coveoRootNamespace}:item-fetcher`),
  productByBVId: debug(`${defaultNamespace}:productByBVId`),
  robots: debug(`${defaultNamespace}:robots`),
  sitemapxml: debug(`${defaultNamespace}:sitemapxml`),
  itemQuery: debug(`${defaultNamespace}:item-query`),
  affiliates: debug(`${defaultNamespace}:affiliates`),
  redirects: debug(`${defaultNamespace}:redirects`),
  geoLocation: debug(`${defaultNamespace}:geoLocation`),
  mediaRedirects: debug(`${defaultNamespace}:media-redirects`),
  multilanguage: debug(`${defaultNamespace}:multilanguage`),
  featureToggle: debug(`${defaultNamespace}:feature-toggle`),
  personalization: debug(`${defaultNamespace}:personalization`),
  rules: debug(`${defaultNamespace}:rules`),
  onlinescheduling: debug(`${defaultNamespace}:onlinescheduling`),
  draftModeWorkaround: debug(`${defaultNamespace}:draft-mode-workaround`),
  cdpIdentity: debug(`${defaultNamespace}:cdp-identity`),
  api: {
    coveo: {
      accessToken: debug(`${defaultNamespace}:api:coveo:access-token`),
      sitemap: debug(`${defaultNamespace}:api:coveo:sitemap`),
    },
    shareARLink: debug(`${defaultNamespace}:api:share-ar-link`),
    customForms: {
      submitActions: {
        saveToDatabase: debug(
          `${defaultNamespace}:api:custom-forms:submit-actions:save-to-database`
        ),
        sendEmail: debug(`${defaultNamespace}:api:custom-forms:submit-actions:send-email`),
        sfmcTransactionalMessagingSendEmail: debug(
          `${defaultNamespace}:api:custom-forms:submit-actions:sfmc-transactional-messaging-send-email`
        ),
      },
    },
    designTool: {
      renoworksGetProductOptions: debug(
        `${defaultNamespace}:api:design-tool:renoworks-get-product-options`
      ),
    },
    genericFormBuilder: {
      submitActions: {
        saveToDatabase: debug(
          `${defaultNamespace}:api:generic-form-builder:submit-actions:save-to-database`
        ),
        sendEmail: debug(`${defaultNamespace}:api:generic-form-builder:submit-actions:send-email`),
        sfmcTransactionalMessagingSendEmail: debug(
          `${defaultNamespace}:api:generic-form-builder:submit-actions:sfmc-transactional-messaging-send-email`
        ),
      },
    },
  },
};
