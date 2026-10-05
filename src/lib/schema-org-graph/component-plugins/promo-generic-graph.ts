import { Item } from '@sitecore-content-sdk/nextjs';
import { Thing } from 'schema-dts';

import { ComponentPluginParams } from '../plugin-types';
import { extractVideoNode } from './video-utils';

export const componentName = 'PromoGeneric';

type PromoGenericFields = {
  primaryVideo?: Item;
};

export function plugin({ graph, fields }: ComponentPluginParams<PromoGenericFields>): Thing[] {
  const f = fields as PromoGenericFields | undefined;

  const videoNode = extractVideoNode(f?.primaryVideo);
  return videoNode ? [...graph, videoNode] : graph;
}
