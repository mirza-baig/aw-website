'use client';
import { ThemeName } from 'lib/website/theme';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import { JSX } from 'react';

const faviconUrls: Record<ThemeName, string> = {
  aw: '/awfavicon.svg',
  rba: '/rbafavicon.png',
};

export const Favicon = (): JSX.Element => {
  const { theme } = useWebsiteContext();

  return <link rel="icon" href={faviconUrls[theme]} />;
};
