import { Item } from '@sitecore-content-sdk/nextjs';
import { Thing } from 'schema-dts';

import { ComponentPluginParams } from '../plugin-types';
import { extractVideoNode } from './video-utils';

export const componentName = 'ContentBlockWithMedia';

type ContentBlockFields = {
  primaryVideo?: Item;
};

export function plugin({ graph, fields }: ComponentPluginParams<ContentBlockFields>): Thing[] {
  const f = fields as ContentBlockFields | undefined;

  const videoNode = extractVideoNode(f?.primaryVideo);
  return videoNode ? [...graph, videoNode] : graph;
}
