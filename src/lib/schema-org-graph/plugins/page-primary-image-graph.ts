import { Thing } from 'schema-dts';

import { appendImageObject, createImageObject } from '../image-graph-utils';
import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export function plugin({ graph, page }: PluginParams<unknown>): Thing[] {
  const route = page.layout.sitecore.route;
  if (!route) {
    return graph;
  }

  const siteInfo = page.customProps.siteInfo;
  if (!siteInfo) {
    return graph;
  }

  const pageFields = route.fields as Sitecore.FieldSets.Routes.ImageProperties['fields'];
  const imageObject = createImageObject(pageFields?.primaryImage, siteInfo);
  return appendImageObject(graph, imageObject);
}
