import Link from 'next/link';
import { getSitecoreErrorPage } from 'lib/cache/get-sitecore-error-page';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import * as flags from 'lib/feature-flags/flags';
import { getWebsiteStaticState } from 'lib/cache/get-website-static-state';
import { cacheLife } from 'next/cache';

export default async function NotFound() {
  if (scConfig.defaultSite) {
    const page = await getSitecoreErrorPage({
      site: scConfig.defaultSite,
      locale: scConfig.defaultLanguage,
      code: ErrorPage.NotFound,
    });

    if (page) {
      const featureFlags = await getDefaultFlagValues();
      const websiteStaticState = await getWebsiteStaticState({ page, featureFlags, path: [] });

      return (
        <Providers page={page}>
          <Layout page={page} websiteStaticState={websiteStaticState} />
        </Providers>
      );
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/">Go to the Home page</Link>
    </div>
  );
}

async function getDefaultFlagValues() {
  'use cache';
  cacheLife('days');

  const defaultValues = Object.entries(flags).map(([key, flag]) => {
    return [key, flag.defaultValue];
  });

  const defaults = Object.fromEntries(defaultValues);

  return defaults;
}
