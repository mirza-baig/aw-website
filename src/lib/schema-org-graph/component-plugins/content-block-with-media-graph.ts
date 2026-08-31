import { ImageField, Item } from '@sitecore-content-sdk/nextjs';
import { ImageObject, Thing } from 'schema-dts';

import { ComponentPluginParams } from '../plugin-types';
import { extractVideoNode } from './video-utils';

export const componentName = 'ContentBlockWithMedia';

type ContentBlockFields = {
  primaryVideo?: Item;
  primaryImage?: ImageField;
};

export function plugin({ graph, fields }: ComponentPluginParams<ContentBlockFields>): Thing[] {
  const f = fields as ContentBlockFields | undefined;

  const videoNode = extractVideoNode(f?.primaryVideo);
  if (videoNode) {
    return [...graph, videoNode];
  }

  const imageSrc = f?.primaryImage?.value?.src;
  if (imageSrc) {
    const imageObject: ImageObject = {
      '@type': 'ImageObject',
      '@id': imageSrc,
      contentUrl: imageSrc,
      creator: 'Andersen Windows',
    };
    return [...graph, imageObject];
  }

  return graph;
}
