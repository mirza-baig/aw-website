import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { ImageObject, Thing } from 'schema-dts';
import { environment } from 'startup/environment';

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
  const imageValue = pageFields?.primaryImage?.value;

  if (!imageValue?.src) {
    return graph;
  }

  const contentUrl = getMediaUrl(imageValue, MediaUrlType.Canonical, siteInfo, environment);

  const imageObject: ImageObject = {
    '@type': 'ImageObject',
    '@id': contentUrl,
    contentUrl,
    creator: 'Andersen Windows',
  };

  return [...graph, imageObject];
}
