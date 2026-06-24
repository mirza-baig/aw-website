import Link from 'next/link';
import client from 'lib/sitecore-client';
import scConfig from 'sitecore.config';
import { ErrorPage } from '@sitecore-content-sdk/nextjs';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { loader } from 'lib/feature-flags/loader';

export default async function NotFound() {
  if (scConfig.defaultSite) {
    const page = await client.getErrorPage(ErrorPage.NotFound, {
      site: scConfig.defaultSite,
      locale: scConfig.defaultLanguage,
    });

    if (page) {
      const featureFlags = await loader();
      const pageWithCustomProps = await client.getPageWithCustomProps(page, featureFlags);

      return (
        <Providers page={pageWithCustomProps}>
          <Layout page={pageWithCustomProps} />
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
