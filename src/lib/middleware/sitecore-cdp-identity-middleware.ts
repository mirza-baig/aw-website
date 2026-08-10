import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { getCoreContext } from '@sitecore-content-sdk/core';
import { eventsPlugin, Identifier, identity } from '@sitecore-content-sdk/events'; // Unified isomorphic import
import {
  analyticsProxyAdapter,
  initContentSdk,
  personalizeProxyAdapter,
} from '@sitecore-content-sdk/nextjs';
import { ProxyBase, ProxyBaseConfig } from '@sitecore-content-sdk/nextjs/proxy';
import { personalizeServerPlugin } from '@sitecore-content-sdk/personalize';
import { Debug } from 'lib/constants/debug';
import { decryptEcidEdge } from 'lib/salesforce/communities/ecid-decrypt-edge/ecid-decrypt-edge';
import { NextRequest, NextResponse } from 'next/server';
import config from 'sitecore.config';

const SALESFORCE_PROVIDER_NAME = 'AW_SALESFORCE';

/**
 * Cookie set by Sitecore analytics to flag bot requests.
 * Not yet exported from @sitecore-content-sdk/analytics-core/internal (v2.0.1).
 */
const BOT_DETECTION_COOKIE = 'sc_is_bot';

/**
 * Middleware to trigger a Sitecore CDP IDENTITY event server-side when an an
 * sf_ecid query parameter is sent.
 */
export class SitecoreCDPIdentityMiddleware extends ProxyBase {
  constructor(config: ProxyBaseConfig) {
    super(config);
  }

  async handle(request: NextRequest, res?: NextResponse): Promise<NextResponse> {
    const response = res || NextResponse.next();

    // Don't process for prefetch
    if (this.isPrefetch(request)) {
      return response;
    }

    // Salesforce communities link should only be sent for published site
    if (this.isPreview(request)) {
      Debug.cdpIdentity('skipped (isPreview)');
      return response;
    }

    const sfEcid = request.nextUrl.searchParams.get('sf_ecid');
    if (!sfEcid) {
      return response;
    }

    if (request.cookies.get(BOT_DETECTION_COOKIE)?.value) {
      Debug.cdpIdentity('skipped (bot request)');
      return response;
    }

    const key = process.env.AW_SF_ECID_DECRYPTION_KEY;
    if (!key) {
      Debug.cdpIdentity('skipped (no decryption key): AW_SF_ECID_DECRYPTION_KEY is not set');
      return response;
    }

    const crmId = await decryptEcidEdge(sfEcid, key);
    if (!crmId) {
      Debug.cdpIdentity('skipped (failed to decrypt sf_ecid): %o', { sfEcid });
      return response;
    }

    const siteHeader = request.headers.get('x-sc-rewrite') || request.headers.get('sc_site');
    const siteCookie = request.cookies.get('sc_site')?.value;
    const currentSiteName = siteHeader || siteCookie || 'default';

    const cookieDomain = request.headers.get('host')?.replace(/^www\./, '') || '';
    let isSdkInitialized = true;
    try {
      getCoreContext();
    } catch {
      isSdkInitialized = false;
    }

    if (!isSdkInitialized) {
      initContentSdk({
        config: {
          contextId: config.api.edge.clientContextId,
          edgeUrl: config.api.edge.edgeUrl,
          siteName: currentSiteName || config.defaultSite,
        },
        plugins: [
          analyticsPlugin({
            options: {
              enableCookie: true,
              cookieDomain: cookieDomain,
            },
            adapter: analyticsProxyAdapter(request, response),
          }),
          eventsPlugin(),
          personalizeServerPlugin({
            adapter: personalizeProxyAdapter(request, response),
            options: {
              enablePersonalizeCookie: true,
            },
          }),
        ],
      });
    }

    const salesforceCrmIdentifier: Identifier = { provider: SALESFORCE_PROVIDER_NAME, id: crmId };

    const identityPayload = {
      channel: 'WEB',
      currency: 'USD',
      language: 'EN',
      identifiers: [salesforceCrmIdentifier],
    };

    try {
      await identity(identityPayload);
    } catch (error) {
      Debug.cdpIdentity('failed to push server identity context: %o', error);
    }

    return response;
  }
}
