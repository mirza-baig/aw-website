'use client';

import { setCookie } from 'lib/utils/client-storage-utils/set-cookie';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import { useEffect } from 'react';

import { CookieInfo } from './cookie-info';
import { plugins } from './plugins';

/**
 * Client component that simply runs the hook.
 * Acutually Renders nothing, just performs side effects.
 */
export function SourcingCookies() {
  const { siteInfo } = useWebsiteContext();

  useEffect(() => {
    if (!siteInfo) {
      return;
    }

    const location = window.location;
    const searchParams = new URLSearchParams(location.search);

    const cookiesToSet = plugins.reduce<CookieInfo[]>((acc, plugin) => {
      const pluginCookies = plugin.exec({ searchParams, siteInfo, location });
      return [...acc, ...pluginCookies];
    }, []);

    cookiesToSet.forEach((cookie) => {
      setCookie(cookie.name, cookie.value, cookie.expiryTime, '/');
    });
  }, [siteInfo]);

  return null;
}
