import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { Environment } from 'lib/environment/environment';

import { isNullOrWhitespace } from '../string-utils/is-null-or-whitespace';
import { getSiteHostName } from './get-site-host-name';

/** Describes how a media URL should be resolved. */
export enum MediaUrlType {
  Relative,
  Cdn,
  Canonical,
}

/** Optional settings for media URL resolution. */
export type GetMediaUrlOptions = {
  fallbackUrl?: string;
};

/**
 * Resolves a media URL as a relative, CDN, or canonical URL.
 *
 * @param url A media URL string or object containing a source URL.
 * @param type The desired media URL format.
 * @param siteInfo Sitecore site metadata used to resolve media and canonical hosts.
 * @param environment The runtime environment used to determine preview or www behavior.
 * @param options Optional fallback URL used when the input URL is unavailable.
 * @returns The resolved media URL, fallback URL, or an empty string.
 */
export function getMediaUrl(
  url: { src?: string } | string | undefined | null,
  type: MediaUrlType,
  siteInfo: SiteInfo,
  environment: Environment,
  options: GetMediaUrlOptions = {}
): string {
  const { fallbackUrl } = options;

  if (url == undefined || url == null) {
    return fallbackUrl ?? '';
  }

  if (typeof url != 'string') {
    if (url.src == undefined) {
      return fallbackUrl ?? '';
    }
    url = url.src;
  }

  const parsedUrl = new URL(url, 'https://localhost/');

  if (parsedUrl == null) {
    return fallbackUrl ?? '';
  }

  const isEdgeUrl = url.startsWith('https://edge.sitecorecloud.io');
  let pathAndQuery = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

  // If it's a CDN URL, then remove the initial folder as well
  if (isEdgeUrl) {
    pathAndQuery = pathAndQuery.replace(/[^/]+\//, '-/');
  }

  let result = url;
  switch (type) {
    case MediaUrlType.Relative:
      if (environment.isPreview()) {
        if (!isNullOrWhitespace(siteInfo.targetHostName as string)) {
          result = `https://${siteInfo.mediaHostName}${pathAndQuery}`;
        }
      } else {
        result = pathAndQuery;
      }
      break;
    case MediaUrlType.Cdn:
      if (environment.isPreview() && !isNullOrWhitespace(siteInfo.targetHostName as string)) {
        result = `https://${siteInfo.mediaHostName}${pathAndQuery}`;
      }
      break;
    case MediaUrlType.Canonical:
      result = `${getSiteHostName(siteInfo, environment)}${pathAndQuery}`;
      break;
  }
  return result;
}
