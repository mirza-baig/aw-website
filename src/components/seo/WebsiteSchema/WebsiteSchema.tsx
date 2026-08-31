'use client';

import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Script from 'next/script';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type WebsiteSchemaType = {
  '@context': 'https://schema.org/';
  '@type': 'WebSite';
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
};

type WebsiteSchemaProps = ComponentProps & Sitecore.Components.Seo.WebsiteSchema.WebsiteSchema;

function WebsiteSchema_Default(props: WebsiteSchemaProps) {
  const { siteInfo, featureFlags } = useWebsiteContext();

  if (!siteInfo?.name) {
    return <></>;
  }

  const canonicalHostName = siteInfo?.canonicalHostName;
  if (!canonicalHostName || typeof canonicalHostName !== 'string') {
    return <></>;
  }
  // Search Markup
  const ldJsonScript: WebsiteSchemaType = {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    url: canonicalHostName,
  };

  const searchPageUrl = props.fields?.searchPage?.value?.href;
  if (searchPageUrl) {
    ldJsonScript.potentialAction = {
      '@type': 'SearchAction',
      target: `${canonicalHostName}${searchPageUrl}#q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }

  return (
    <>
      {!featureFlags.releaseSchemaOrgGraph && (
        <Script
          id=""
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonScript) }}
        />
      )}
    </>
  );
}

export const Default = withDatasourceCheck(WebsiteSchema_Default);
