'use client';
import React from 'react';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { WebsiteStaticState } from 'lib/website/website-state';

export default function Providers({
  children,
  page,
}: Readonly<{
  children: React.ReactNode;
  page: Page & { customProps: WebsiteStaticState };
}>) {
  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
    >
      {children}
    </SitecoreProvider>
  );
}
