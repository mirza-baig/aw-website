import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import Script from 'next/script';

import { Sitecore } from '.sitecore/AndersenWindows.sitecore';
import { DataSource } from 'lib/types/data-source';

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

type WebsiteSchemaProps = ComponentProps &
  DataSource<Sitecore.Components.Seo.WebsiteSchema.WebsiteSchema>;

function WebsiteSchema_Default(props: WebsiteSchemaProps) {
  if (!props.websiteStaticState.siteInfo?.name) {
    return null;
  }

  const canonicalHostName = props.websiteStaticState.siteInfo?.canonicalHostName;
  if (!canonicalHostName || typeof canonicalHostName !== 'string') {
    return null;
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
      {!props.websiteStaticState.featureFlags.releaseSchemaOrgGraph && (
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
