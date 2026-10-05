import { ImageField, SiteInfo } from '@sitecore-content-sdk/nextjs';
import environment from 'lib/environment';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { ImageObject, Thing } from 'schema-dts';

function isImageObjectWithUrl(node: Thing, url: string): boolean {
  if (typeof node !== 'object' || node === null) {
    return false;
  }

  const record = node as Record<string, unknown>;
  const type = record['@type'];
  const isImageObject = Array.isArray(type) ? type.includes('ImageObject') : type === 'ImageObject';

  return isImageObject && (record['@id'] === url || record.contentUrl === url);
}

export function createImageObject(
  image: ImageField | undefined,
  siteInfo: SiteInfo | undefined
): ImageObject | undefined {
  const imageSrc = image?.value?.src?.trim();
  if (!imageSrc || !siteInfo) {
    return undefined;
  }

  const contentUrl = getMediaUrl(imageSrc, MediaUrlType.Canonical, siteInfo, environment);
  if (!contentUrl) {
    return undefined;
  }

  return {
    '@type': 'ImageObject',
    '@id': contentUrl,
    contentUrl,
    creator: 'Andersen Windows',
  };
}

export function appendImageObject(graph: Thing[], imageObject: ImageObject | undefined): Thing[] {
  if (!imageObject) {
    return graph;
  }

  const imageUrl = imageObject.contentUrl;
  if (typeof imageUrl !== 'string' || graph.some((node) => isImageObjectWithUrl(node, imageUrl))) {
    return graph;
  }

  return [...graph, imageObject];
}
