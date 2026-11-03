import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { Brand, Organization, Product, Thing } from 'schema-dts';

import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const pluginId =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.SchemaOrgGraph.Product.Id;

export function plugin({
  graph,
  data,
  page,
}: PluginParams<Sitecore.Components.Seo.ProductSchema.ProductSchema['fields']>): Thing[] {
  if (!data) {
    return graph;
  }

  const canonicalHostName =
    (page.customProps.siteInfo?.canonicalHostName as string | undefined) ?? '';
  const requestedPath = page.customProps.requestedPath ?? '';

  const productName =
    (data.productItem?.fields?.productName as Field<string> | undefined)?.value ?? '';
  const productImage =
    (data.productItem?.fields?.productImage as ImageField | undefined)?.value?.src ?? '';
  const productDescription =
    (data.productItem?.fields?.productDescription as Field<string> | undefined)?.value ?? '';

  // Use the product datasource item ID as the stable product identifier
  const productItemId =
    data.productItem?.fields?.productId?.value ??
    data.productItem?.fields?.productName?.value ??
    data.productItem?.fields?.productDetailPageLink?.value?.href ??
    data.productItem?.id ??
    page.layout.sitecore.route?.itemId ??
    requestedPath;

  const product: Product = {
    '@type': 'Product',
    '@id': `${canonicalHostName}/#/schema/Product/${productItemId}`,
    name: productName,
    image: productImage,
    description: productDescription,
    brand: {
      '@id': `${canonicalHostName}/#/schema/Brand/Andersen_Windows`,
    } as unknown as Brand,
    manufacturer: {
      '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    } as unknown as Organization,
  };

  return [...graph, product];
}
