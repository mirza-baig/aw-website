import { getPageMetadata, setCachedPageParams, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { Flag, serialize } from 'flags/next';
import { setCachedFeatureFlagsParams } from 'lib/cache/feature-flags';
import { getWebsiteStaticState } from 'lib/cache/get-website-static-state';
import environment from 'lib/environment';
import * as allFlags from 'lib/feature-flags/flags';
import { loader } from 'lib/feature-flags/loader';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';
import { isNullOrEmpty } from 'lib/utils/string-utils/is-null-or-empty';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import scConfig from 'sitecore.config';
import { routing } from 'src/i18n/routing';
import Layout from 'src/Layout';
import { getSitecorePage } from 'src/lib/cache/get-sitecore-page';
import { BUILD_VALIDATION_SITE, isBuildValidationSite } from 'src/lib/sitecore-build-validation';
import client from 'src/lib/sitecore-client';
import Providers from 'src/Providers';

import { Sitecore } from '.sitecore/AndersenWindows.model';
import { sites as awSites } from '.sitecore/aw-sites';
import sites from '.sitecore/sites.json';

type PageProps = {
  params: Promise<{
    flags: string;
    site: string;
    locale: string;
    path?: string[];
    [key: string]: string | string[] | undefined;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { flags, site, locale, path } = await params;

  if (isBuildValidationSite(site)) {
    setCachedPageParams({ site, locale });
    setCachedFeatureFlagsParams({ precomputed: flags });
    notFound();
  }

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  // Draft/preview first so editing is not blocked by locale-dependent cached lookups.
  // Editing often resolves language via query string, while [locale] may fall back to defaultLanguage.
  const draft = await draftMode();

  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await getSitecorePage({ site, locale, path: path ?? [] });
  }

  // If the page is not found, return a 404
  if (!page) {
    setCachedPageParams({ site, locale });
    setCachedFeatureFlagsParams({ precomputed: flags });
    notFound();
  }

  const featureFlags = await loader(flags);

  let websiteStaticState;
  if (draft.isEnabled) {
    websiteStaticState = await client.getWebsiteStaticState(page, featureFlags, path);
  } else {
    websiteStaticState = await getWebsiteStaticState({ page, featureFlags, path: path ?? [] });
  }

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <Layout page={page} websiteStaticState={websiteStaticState} />
      </Providers>
    </NextIntlClientProvider>
  );
}

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  const { flags, values } = getDefaultFlagValues();
  const precomputed = await serialize(flags, values);

  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    const pages = await client.getAppRouterStaticParams(
      sites.map((site: SiteInfo) => site.name),
      routing.locales.slice()
    );
    return pages.map((page) => ({ flags: precomputed, ...page }));
  }
  return [
    {
      flags: precomputed,
      site: BUILD_VALIDATION_SITE,
      locale: routing.defaultLocale || scConfig.defaultLanguage,
      path: [],
    },
  ];
};

function getDefaultFlagValues() {
  const flags: Flag<unknown>[] = [], values: unknown[] = [];
  Object.values(allFlags).forEach((flag) => {
    flags.push(flag);
    values.push(flag.defaultValue);
  });

  return { flags, values };
}


type MetaRobots = 'Follow' | 'Index' | 'No Follow' | 'No Index';

// Metadata fields for the page. Mirrors the Page draft-mode branching so the <title> matches the body.
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { path, site, locale } = await params;

  if (isBuildValidationSite(site)) {
    return { title: 'Page' };
  }

  const draft = await draftMode();

  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await getSitecorePage({ site, locale, path: path ?? [] });
  }

  if (page === null || page.layout.sitecore.route === null) {
    return { title: 'Page' };
  }

  const baseMetadata = getPageMetadata(page.layout.sitecore.route);

  const siteInfo = awSites.find((s) => s.name === site);
  const fields = page.layout.sitecore.route.fields as Sitecore.BaseTemplates.BasePage['fields'];

  /* ---------- ROBOTS ---------- */
  const robotsValue = fields?.pageMetaRobots
    ?.map((item) => getEnum<MetaRobots>(item))
    .join(', ')
    .toLowerCase()
    .trim();

  const robotsCleanedValue = isNullOrEmpty(robotsValue) ? undefined : robotsValue;

  const robots =
    environment.isProduction() && environment.isWww() ? robotsCleanedValue : 'noindex, nofollow';

  /* ---------- CANONICAL ---------- */
  const pagePathName = fields?.pageCanonicalUrl?.value?.href;
  const canonicalUrl = `${siteInfo?.canonicalHostName}${
    isNullOrWhitespace(pagePathName) ? client.parsePath(path ?? []) : pagePathName
  }`;

  /* ---------- META NAME/VALUE LIST ---------- */
  const additionalMeta =
    fields?.pageMetaNameValueList?.value?.split('&').reduce<Record<string, string>>((acc, kv) => {
      const [key, value] = kv.split('=');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {}) ?? {};

  return {
    ...baseMetadata,
    title: fields?.pageTitle?.value ?? 'Page',
    robots,

    alternates: {
      canonical: canonicalUrl,
    },

    icons: {
      icon: [
        {
          url: '/aw/awfavicon.svg',
          type: 'image/svg+xml',
        },
      ],
    },

    other: {
      ...baseMetadata.other,
      coveobot: fields?.excludeFromSearch?.value ? 'noindex nofollow' : 'all',
      featuredImage: fields?.featuredImage?.value?.src ?? '',
      ...additionalMeta,
    },
  };
}
