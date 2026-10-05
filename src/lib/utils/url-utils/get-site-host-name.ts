import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { Environment } from 'lib/environment/environment';

import { isNullOrWhitespace } from '../string-utils/is-null-or-whitespace';

/**
 * Resolves the canonical HTTPS host URL for a Sitecore site.
 *
 * @param siteInfo Sitecore site metadata, or undefined when unavailable.
 * @param environment The runtime environment used to select preview or www hosts.
 * @returns An HTTPS host URL, or an empty string when no usable host is available.
 */
export function getSiteHostName(siteInfo: SiteInfo | undefined, environment: Environment): string {
  if (siteInfo == undefined) {
    return '';
  }

  if (typeof siteInfo.targetHostName == 'string' && !isNullOrWhitespace(siteInfo.targetHostName)) {
    return `https://${siteInfo.targetHostName}`;
  }

  if (!siteInfo.hostName.includes('|')) {
    return siteInfo.hostName.includes('*') ? '' : `https://${siteInfo.hostName}`;
  }

  const hostNames = siteInfo.hostName.split('|');

  for (const hostName of hostNames) {
    if (hostName.includes('*')) {
      continue;
    }

    if (environment.isPreview() && hostName.startsWith('preview.')) {
      return `https://${hostName}`;
    }

    if (environment.isWww() && hostName.startsWith('www.')) {
      return `https://${hostName}`;
    }
  }

  return '';
}
