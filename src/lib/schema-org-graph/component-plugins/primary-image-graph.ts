import { ImageField } from '@sitecore-content-sdk/nextjs';
import { Thing } from 'schema-dts';

import { appendImageObject, createImageObject } from '../image-graph-utils';
import { ComponentPluginParams } from '../plugin-types';

export type PrimaryImageFields = {
  primaryImage?: ImageField;
};

export function plugin({
  graph,
  fields,
  page,
}: ComponentPluginParams<PrimaryImageFields>): Thing[] {
  const imageObject = createImageObject(fields?.primaryImage, page.customProps.siteInfo);
  return appendImageObject(graph, imageObject);
}
