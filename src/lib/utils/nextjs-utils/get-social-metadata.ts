import type { ImageField } from '@sitecore-content-sdk/nextjs';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import type { Metadata } from 'next';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type BasePageFields = Sitecore.BaseTemplates.BasePage['fields'];

type SocialMetadataOptions = {
  /** Absolute canonical URL for the page; used as og:url when "OG Url" is empty. */
  canonicalUrl: string;
  /** Absolute origin (e.g. https://www.andersenwindows.com) used to absolutize relative media URLs. */
  canonicalHostName?: string;
};

type OpenGraphImage = { url: string; width?: number; height?: number; alt?: string };

const toNumber = (value: unknown): number | undefined => {
  const parsed = typeof value === 'number' ? value : parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const toAbsoluteUrl = (src: string, origin?: string): string => {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }
  if (src.startsWith('//')) {
    return `https:${src}`;
  }
  if (!origin) {
    return src;
  }
  return `${origin.replace(/\/+$/, '')}/${src.replace(/^\/+/, '')}`;
};

const toOpenGraphImage = (
  field: ImageField | undefined,
  origin?: string
): OpenGraphImage | undefined => {
  const src = field?.value?.src;
  if (isNullOrWhitespace(src)) {
    return undefined;
  }
  const alt = field?.value?.alt;
  return {
    url: toAbsoluteUrl(src, origin),
    width: toNumber(field?.value?.width),
    height: toNumber(field?.value?.height),
    alt: typeof alt === 'string' && !isNullOrWhitespace(alt) ? alt : undefined,
  };
};

const firstNonEmpty = (...values: (string | undefined | null)[]): string | undefined =>
  values.find((value) => !isNullOrWhitespace(value)) ?? undefined;

/**
 * Builds Open Graph / Twitter card metadata from the AW page fields.
 *
 * The Content SDK's `getPageMetadata` only reads the SDK's own `baseOg*` / `baseMetadata*` fields,
 * which the AW page templates don't have, so link previews (Teams, Slack, LinkedIn, etc.) got no
 * og:image. This maps the AW "Social Properties" and "Image Properties" fields instead.
 *
 * Image precedence: OG Image → Primary Image → Featured Image → Primary Image Mobile.
 */
export function getSocialMetadata(
  fields: BasePageFields,
  { canonicalUrl, canonicalHostName }: SocialMetadataOptions
): Pick<Metadata, 'description' | 'openGraph' | 'twitter'> {
  const image = [
    fields?.openGraphImage,
    fields?.primaryImage,
    fields?.featuredImage,
    fields?.primaryImageMobile,
  ]
    .map((field) => toOpenGraphImage(field, canonicalHostName))
    .find((value) => value !== undefined);

  const pageDescription = firstNonEmpty(fields?.pageMetaDescription?.value);
  const title = firstNonEmpty(fields?.openGraphTitle?.value, fields?.pageTitle?.value);
  const description = firstNonEmpty(fields?.openGraphDescription?.value, pageDescription);
  const url = firstNonEmpty(fields?.openGraphUrl?.value?.href, canonicalUrl);
  const siteName = firstNonEmpty(fields?.openGraphSiteName?.value);
  const type = firstNonEmpty(fields?.openGraphType?.value);

  return {
    ...(pageDescription && { description: pageDescription }),
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      ...(url && { url }),
      ...(siteName && { siteName }),
      type: type?.toLowerCase() === 'article' ? 'article' : 'website',
      ...(image && { images: [image] }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      ...(title && { title }),
      ...(description && { description }),
      ...(image && { images: [image.url] }),
    },
  };
}
