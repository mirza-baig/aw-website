import { Item } from '@sitecore-content-sdk/nextjs';
import { Thing } from 'schema-dts';

import { ComponentPluginParams } from '../plugin-types';
import { extractVideoNode } from './video-utils';

export const componentName = 'GenericCard';

type GenericCardFields = { primaryVideo?: Item };

export function plugin({ graph, fields }: ComponentPluginParams<GenericCardFields>): Thing[] {
  const videoNode = extractVideoNode((fields as GenericCardFields | undefined)?.primaryVideo);
  return videoNode ? [...graph, videoNode] : graph;
}
