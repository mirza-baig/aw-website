'use client';

import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Script from 'next/script';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type OrganizationSchemaProps = ComponentProps &
  Sitecore.Components.Seo.OrganizationSchema.OrganizationSchema;

function OrganizationSchema_Default(props: OrganizationSchemaProps) {
  const { siteInfo } = useWebsiteContext();

  if (!props.fields) {
    return <></>;
  }

  const ldJsonScript = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    url: siteInfo?.canonicalHostName ?? '',
    logo: props.fields?.logo?.value?.src ?? '',
    name: props.fields?.name?.value ?? '',
    description: props.fields?.description?.value ?? '',
    email: props.fields?.email?.value ?? '',
    telephone: props.fields?.telephone?.value ?? '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.fields?.street?.value ?? '',
      addressLocality: props.fields?.city?.value ?? '',
      addressCountry: props.fields?.country?.value ?? '',
      postalCode: props.fields?.zip?.value ?? '',
    },
  };

  return (
    <Script
      id=""
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonScript) }}
    />
  );
}

export const Default = withDatasourceCheck(OrganizationSchema_Default);
