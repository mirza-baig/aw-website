import { LinkField } from '@sitecore-content-sdk/nextjs';
import { getCookie } from 'cookies-next';

export const getSiteSwitcherLink = (): LinkField | null => {
  if (typeof window !== 'undefined') {
    const urlObject = new URL(window.location.href);

    urlObject.host = urlObject.host.replace(/\.(com|ca)/g, (_: string, domain: string) =>
      domain === 'com' ? '.ca' : '.com'
    );

    const _currentZip = getCookie('currentZip');

    if (!urlObject.searchParams.has('currentZip') && _currentZip) {
      urlObject.searchParams.append('currentZip', _currentZip.toString());
    }

    const linkField = {
      value: {
        href: urlObject.toString(),
        linktype: 'external',
        url: urlObject.toString(),
      },
    };

    return linkField;
  }

  return null;
};
