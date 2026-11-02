import { ErrorPage, getCachedPageParams } from '@sitecore-content-sdk/nextjs';
import { getCachedFeatureFlagsParams } from 'lib/cache/feature-flags';
import { getWebsiteStaticState } from 'lib/cache/get-website-static-state';
import { getSitecoreErrorPage } from 'lib/cache/get-sitecore-error-page';
import { loader } from 'lib/feature-flags/loader';
import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import scConfig from 'sitecore.config';
import Layout from 'src/Layout';
import { isBuildValidationSite } from 'src/lib/sitecore-build-validation';
import Providers from 'src/Providers';

const staticNotFound = (
  <div style={{ padding: 10 }}>
    <h1>Page not found</h1>
    <p>This page does not exist.</p>
    <Link href="/">Go to the Home page</Link>
  </div>
);

export default async function NotFound() {
  const { site, locale } = getCachedPageParams();
  const resolvedSite = (site || scConfig.defaultSite)?.trim();
  const resolvedLocale = locale || scConfig.defaultLanguage;

  if (!resolvedSite || isBuildValidationSite(resolvedSite)) {
    return staticNotFound;
  }

  const page = await getSitecoreErrorPage({
    site: resolvedSite,
    locale: resolvedLocale,
    code: ErrorPage.NotFound,
  });

  // Set site and locale for next-intl dictionary resolution in src/i18n/request.ts.
  // Called after the cached error-page fetch so the locale is resolved from route params, not a Dynamic API.
  setRequestLocale(`${resolvedSite}_${resolvedLocale}`);

  if (page) {
    const { precomputed } = getCachedFeatureFlagsParams();
    const featureFlags = await loader(precomputed);
    const websiteStaticState = await getWebsiteStaticState({ page, featureFlags, path: [] });

    return (
      <NextIntlClientProvider>
        <Providers page={page}>
          <Layout page={page} websiteStaticState={websiteStaticState} />
        </Providers>
      </NextIntlClientProvider>
    );
  }

  return staticNotFound;
}
