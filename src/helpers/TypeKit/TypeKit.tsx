'use client';

import { ThemeName } from 'lib/website/theme';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import { useEffect } from 'react';

const fontUrls: Record<ThemeName, string> = {
  aw: 'https://use.typekit.net/pev3rfw.css',
  rba: 'https://use.typekit.net/shy7gxo.css',
};

export function TypeKit(): null {
  const { theme } = useWebsiteContext();
  const href = fontUrls[theme] ?? fontUrls.aw;

  useEffect(() => {
    const preconnectId1 = `tk-preconnect-1`;
    const preconnectId2 = `tk-preconnect-2`;
    const preloadId = `tk-preload-${theme}`;
    const stylesheetId = `tk-stylesheet-${theme}`;

    const head = document.head;

    // Helper to create or get a link
    const ensureLink = (id: string, attrs: Record<string, string>): HTMLLinkElement => {
      let el = document.getElementById(id) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.id = id;
        head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return el!;
    };

    // 1) Preconnects (safe to be static; we re-use the same IDs)
    ensureLink(preconnectId1, {
      rel: 'preconnect',
      href: 'https://use.typekit.net',
      crossOrigin: '',
    });
    ensureLink(preconnectId2, {
      rel: 'preconnect',
      href: 'https://p.typekit.net',
      crossOrigin: '',
    });

    // 2) Preload the stylesheet for the selected theme
    const preload = ensureLink(preloadId, {
      rel: 'preload',
      as: 'style',
      href,
    });

    // 3) Stylesheet: load as print, then swap to all
    const stylesheet = ensureLink(stylesheetId, {
      rel: 'stylesheet',
      href,
      media: 'print',
    });

    // Swap to all after next paint to avoid blocking render
    const raf = requestAnimationFrame(() => {
      stylesheet.media = 'all';
    });

    // Cleanup: if theme changes, remove only nodes tied to the previous theme
    return () => {
      cancelAnimationFrame(raf);
      // Remove theme-bound nodes (keep preconnects)
      preload.remove();
      stylesheet.remove();
    };
  }, [href, theme]);

  // No visible output; we only manipulate <head>
  return null;
}
