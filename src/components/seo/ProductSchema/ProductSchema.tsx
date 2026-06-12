import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import Script from 'next/script';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type ProductSchemaProps = ComponentProps & Sitecore.Components.Seo.ProductSchema.ProductSchema;

function ProductSchema_Default(props: ProductSchemaProps) {
  if (!props.fields) {
    return <></>;
  }
  //This is test
  const ldJsonScript = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: props.fields?.productItem?.fields?.productName?.value ?? '',
    image: props.fields?.productItem?.fields?.productImage?.value?.src ?? '',
    description: props.fields?.productItem?.fields?.productDescription?.value ?? '',
    brand1: {
      '@type': 'Brand',
      name: props.fields?.brandName?.fields?.Value.value ?? '',
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

export const Default = withDatasourceCheck(ProductSchema_Default);
