'use client';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useWebsiteContext } from 'lib/website/WebsiteContext';

import { SchemaOrgHelper } from './SchemaOrg';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const PageSchemaOrg = () => {
  const { page } = useSitecore();
  const { siteInfo, requestedPath } = useWebsiteContext();

  const pageItem = page.layout.sitecore.route as Sitecore.BaseTemplates.BasePage;

  // Note, these tags need to be direct children of <Head> per NextJS docs.
  return (
    <>
      {/* Schema.Org Markup */}
      {requestedPath === '/' && siteInfo?.name === 'AndersenWindows' && (
        <SchemaOrgHelper
          id="organization-schema"
          schema={{
            '@context': 'http://schema.org',
            '@type': 'Organization',
            '@id': 'https://www.andersenwindows.com/',
            url: 'https://www.andersenwindows.com',
            email: 'Example@example.com',
            name: 'Andersen Windows',
            telephone: '+1-800-426-4261',
            logo: 'https://techpub1.andersenwindows.com//Publications/Images/AW_Logo.png',
            sameAs: [
              'https://www.facebook.com/AndersenWindows',
              'https://www.pinterest.com/andersenwindows/',
              'https://www.instagram.com/andersen_windows/',
              'https://www.houzz.com/photos/andersen-windowsphbr0lbl-bl~l_8256',
              'https://www.youtube.com/user/AndersenWindow',
              'https://www.wikidata.org/wiki/Q4753960',
              'https://twitter.com/andersenwindow/123',
            ],
          }}
        />
      )}
      {page.layout.sitecore.route?.templateId === '9256edf3-d0fa-4588-adda-3036b9d04faa' && (
        <SchemaOrgHelper
          id="article-schema"
          schema={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            author: {
              '@type': 'Organization',
              name: 'Andersen Windows',
              url: `${siteInfo?.canonicalHostName}${requestedPath}`,
            },
            dateModified: pageItem.fields?.lastUpdated?.value,
            datePublished: (pageItem as Sitecore.Pages.ArticlePage).fields?.articleDate?.value,
            headline: (pageItem as Sitecore.Pages.ArticlePage).fields?.articleTitle?.value,
            //@ts-ignore we are using custom fields
            image: [page.fields?.primaryImage?.value?.src],
          }}
        />
      )}
    </>
  );
};
