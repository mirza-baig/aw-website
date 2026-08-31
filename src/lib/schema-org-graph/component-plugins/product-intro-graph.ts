import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { fetchAggregateRating } from 'lib/bazaarvoice/fetch-aggregate-rating';
import { AggregateRating, Product, Thing } from 'schema-dts';

import { hasGraphNode, updateGraphNode } from '../graph-utils';
import { ComponentPluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const componentName = 'ProductIntro';

type ProductIntroFields = Sitecore.Components.Product.ProductIntro.ProductIntro['fields'];

export async function plugin({
  graph,
  fields,
  page,
}: ComponentPluginParams<ProductIntroFields>): Promise<Thing[]> {
  const productItem = fields?.productItem;
  const productName = (productItem?.fields?.productName as Field<string> | undefined)?.value ?? '';

  if (!productName) {
    return graph;
  }

  const bazaarvoiceProductId = (
    productItem?.fields?.bazaarvoiceProductId as Field<string> | undefined
  )?.value?.trim();

  const ratingData = bazaarvoiceProductId ? await fetchAggregateRating(bazaarvoiceProductId) : null;

  const aggregateRating: AggregateRating | undefined =
    ratingData?.ReviewStatistics?.AverageOverallRating != null &&
    ratingData?.ReviewStatistics?.TotalReviewCount != null
      ? {
          '@type': 'AggregateRating',
          ratingValue: ratingData.ReviewStatistics.AverageOverallRating,
          reviewCount: ratingData.ReviewStatistics.TotalReviewCount,
        }
      : undefined;

  // Defer to CA-selected Product schema plugin if a Product node already exists
  if (hasGraphNode(graph, 'Product')) {
    return aggregateRating
      ? updateGraphNode(graph, 'Product', (node) => ({ ...node, aggregateRating }))
      : graph;
  }

  const canonicalHostName = (page.customProps.siteInfo?.canonicalHostName ?? '') as string;
  const productPageHref =
    (productItem?.fields?.productDetailPageLink as LinkField | undefined)?.value?.href ?? '';
  const productImage =
    (productItem?.fields?.productImage as ImageField | undefined)?.value?.src ?? '';
  const productDescription =
    (productItem?.fields?.productDescription as Field<string> | undefined)?.value ?? '';

  // Use bazaarvoiceProductId as stable identifier; fall back to Sitecore item ID
  const productSchemaId = bazaarvoiceProductId ?? page.layout.sitecore.route?.itemId ?? 'unknown';

  const product: Product = {
    '@type': 'Product',
    '@id': `${canonicalHostName}/#/schema/Product/${productSchemaId}`,
    name: productName,
    description: productDescription || undefined,
    image: productImage || undefined,
    url: productPageHref ? `${canonicalHostName}${productPageHref}` : undefined,
    aggregateRating,
    brand: {
      '@type': 'Brand',
      name: 'Andersen Windows',
    },
  };

  return [...graph, product];
}
