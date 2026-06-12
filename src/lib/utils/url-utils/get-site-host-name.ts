import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { Environment } from 'lib/environment/environment';

import { isNullOrWhitespace } from '../string-utils/is-null-or-whitespace';

export function getSiteHostName(siteInfo: SiteInfo | undefined, environment: Environment): string {
  if (siteInfo == undefined) {
    return process.env.PUBLIC_URL ?? '';
  }

  if (typeof siteInfo.targetHostName == 'string' && !isNullOrWhitespace(siteInfo.targetHostName)) {
    return `https://${siteInfo.targetHostName}`;
  }

  if (!siteInfo.hostName.includes('|')) {
    return siteInfo.hostName.includes('*')
      ? (process.env.PUBLIC_URL ?? '')
      : `https://${siteInfo.hostName}`;
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

  return process.env.PUBLIC_URL ?? '';
}
