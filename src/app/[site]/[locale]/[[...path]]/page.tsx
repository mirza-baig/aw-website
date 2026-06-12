import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers'
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import { getEnum } from 'lib/utils/get-enum';
import { environment } from 'startup/environment';

import { isNullOrEmpty } from 'lib/utils/string-utils/is-null-or-empty';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace'
import { sites } from '.sitecore/aw-sites';
import { DraftModeWorkaroundMiddleware } from 'lib/middleware/draft-mode-workaround-middleware';

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60;

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[]; [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type MetaRobots = 'Follow' | 'Index' | 'No Follow' | 'No Index';

//export default async function Page({ params, searchParams }: PageProps) {
export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  const draft = await draftMode();

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const editingParams = await DraftModeWorkaroundMiddleware.getSearchParams(); // await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  page = await client.getPageWithCustomProps(page, path);

  return (
      <NextIntlClientProvider>
        <Providers page={page}>
          <Layout page={page} />
        </Providers>
      </NextIntlClientProvider>
  );
}

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    return await client.getAppRouterStaticParams(
      sites.map((site: SiteInfo) => site.name),
      routing.locales.slice()
    );
  }
  // Next.js 16 requires at least one result
  // Return a default param for the root page
  return [
    {
      site: sites[0]?.name || 'default',
      locale: routing.defaultLocale || scConfig.defaultLanguage,
      path: [],
    },
  ];
};
// Metadata fields for the page.
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { path, site, locale } = await params;
  const siteInfo = sites.find((s) => s.name === site);
  const page = await client.getPage(path ?? [], { site, locale });
  if (!page?.layout?.sitecore?.route) {
    return { title: 'Page' };
  }
  // const headLinks = collectHeadLinks(components);
  const fields =
    page.layout.sitecore.route.fields as Sitecore.BaseTemplates.BasePage['fields'];

  /* ---------- ROBOTS ---------- */
  const robotsValue = fields?.pageMetaRobots
    ?.map((item) => getEnum<MetaRobots>(item))
    .join(', ')
    .toLowerCase()
    .trim();

  const robots =
    environment.isProduction() && environment.isWww()
      ? !isNullOrEmpty(robotsValue)
        ? robotsValue
        : undefined
      : 'noindex, nofollow';

  /* ---------- CANONICAL ---------- */
  const pagePathName = fields?.pageCanonicalUrl?.value?.href;
  const canonicalUrl = `${siteInfo?.canonicalHostName}${
    isNullOrWhitespace(pagePathName)
      ? client.parsePath(path ?? [])
      : pagePathName
  }`;

  /* ---------- META NAME/VALUE LIST ---------- */
  const additionalMeta =
    fields?.pageMetaNameValueList?.value
      ?.split('&')
      .reduce<Record<string, string>>((acc, kv) => {
        const [key, value] = kv.split('=');
        if (key && value) acc[key] = value;
        return acc;
      }, {}) ?? {};

  return {
    title: fields?.pageTitle?.value ?? 'Page',

    description: fields?.pageMetaDescription?.value,
    keywords: fields?.pageMetaKeywords?.value,

    robots,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title:
        fields?.openGraphTitle?.value ??
        fields?.siteSearchHeadline?.value,
      description:
        fields?.openGraphDescription?.value ??
        fields?.siteSearchDescription?.value,
      images: [
        {
          url:
            fields?.openGraphImage?.value?.src ??
            fields?.primaryImage?.value?.src ??
            '',
        },
      ],
      url: fields?.openGraphUrl?.value?.href,
    },

    other: {
      coveobot: fields?.excludeFromSearch?.value
        ? 'noindex nofollow'
        : 'all',
      featuredImage: fields?.featuredImage?.value?.src ?? '',
      ...additionalMeta,
    },
  };
};
