import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import Script from 'next/script';

import { Sitecore } from '.sitecore/AndersenWindows.sitecore';
import { DataSource } from 'lib/types/data-source';
import { Item } from 'lib/types/item';
import { Field } from '@sitecore-content-sdk/nextjs';

type ProductSchemaProps = ComponentProps &
  DataSource<Sitecore.Components.Seo.ProductSchema.ProductSchema>;

function ProductSchema_Default(props: ProductSchemaProps) {
  if (!props.fields) {
    return null;
  }

  const productItem = props.fields?.productItem as Item<Sitecore.Data.Products.Product> | null;
  const brandName = props.fields?.brandName as Item<{ Value: Field<string> }>;

  const ldJsonScript = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productItem?.fields.productName.value ?? '',
    image: productItem?.fields.productImage.value?.src ?? '',
    description: productItem?.fields.productDescription.value ?? '',
    brand: {
      '@type': 'Brand',
      name: brandName?.fields.Value.value ?? '',
    },
  };
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

export const Default = withDatasourceCheck(ProductSchema_Default);
