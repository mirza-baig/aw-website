import { setCachedPageParams } from '@sitecore-content-sdk/nextjs';
import awClientConfig from 'aw.config.client';
import { releaseTrustArcAutoBlock } from 'lib/feature-flags/flags';
import { draftMode } from 'next/headers';
import Script from 'next/script';
import { JSX } from 'react';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string; locale: string }>;
}) {
  const { site, locale } = await params;
  const useAutoBlock = (await releaseTrustArcAutoBlock()) && (await shouldRenderTrustArc());

  // Update the cached page info with the current site and locale values.
  // This ensures the notFound page can access the correct site and locale information when rendered
  // without opting out of SSG by using functions like `headers()`.
  setCachedPageParams({ locale, site });

  return (
    <>
      {/*
       * next/script with beforeInteractive is hoisted into <head> regardless of
       * where it is rendered, so these auto-block scripts still load and execute
       * before any first-party code or tracker can fire.
       */}
      {useAutoBlock && <TrustArcConsentScripts />}
      {children}
    </>
  );
}

// ============================================================================
//   Start TrustArc
// ============================================================================

const TRUSTARC_BASE_URL = 'https://consent.trustarc.com/v2';

// Determines whether the server-rendered TrustArc scripts and placeholders
// should be emitted: a Consent Manager ID must be configured and the request
// must not be a Sitecore editing/preview (draft) request.
export async function shouldRenderTrustArc(): Promise<boolean> {
  if (!awClientConfig.trustArc.cmid) {
    return false;
  }

  const draft = await draftMode();
  return !draft.isEnabled;
}

function TrustArcConsentScripts(): JSX.Element {
  const trustArcCmId = awClientConfig.trustArc.cmid;

  // The beforeInteractive rule targets the pages router; in the app router,
  // beforeInteractive scripts rendered in the root layout's <head> are the
  // supported way to load scripts before hydration.
  return (
    <>
      {/*
       * Auto-block core: patches the DOM so script/img/iframe tags are blocked
       * until consent is given. Must load before the blocklist.
       */}
      <Script
        id="trustarc-autoblock-core"
        src={`${TRUSTARC_BASE_URL}/autoblockasset/core.min.js?cmId=${trustArcCmId}`}
        strategy="beforeInteractive"
      />
      {/*
       * Blocklist: contains the customer's categories and domains and starts
       * the auto-blocking process.
       */}
      <Script
        id="trustarc-autoblock-blocklist"
        src={`${TRUSTARC_BASE_URL}/autoblock?cmId=${trustArcCmId}`}
        strategy="beforeInteractive"
      />
      {/*
       * Consent Manager notice: renders the cookie banner / preference center.
       */}
      <Script
        id="trustarc-notice"
        src={`${TRUSTARC_BASE_URL}/notice/${trustArcCmId}`}
        strategy="beforeInteractive"
      />
      {/*
       * Reload the page after the user submits their preferences so that tags
       * which should be blocked stop collecting personal data.
       */}
      <Script
        id="trustarc-reload-on-preference-submit"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener("message", function(event) {
              var eventDataJson = null;
              try {
                eventDataJson = JSON.parse(event.data);
              } catch (e) {
              }
              // Safeguard to make sure we are only getting events from TrustArc
              if (eventDataJson && eventDataJson.source === "preference_manager") {
                // Means that the user has submitted their preferences
                if (eventDataJson.message === "submit_preferences") {
                  setTimeout(function () {
                    window.location.reload();
                  }, 20);
                }
              }
            }, false);
          `,
        }}
      />

      <div
        id="consent-banner"
        dangerouslySetInnerHTML={{ __html: '' }}
        suppressHydrationWarning
      ></div>
    </>
  );
}

// ==========================================================================
//   End TrustArc
// ==========================================================================
