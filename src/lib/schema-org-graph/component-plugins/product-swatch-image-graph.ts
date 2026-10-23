import { Thing } from 'schema-dts';

import { appendImageObject, createImageObject } from '../image-graph-utils';
import { ComponentPluginParams } from '../plugin-types';

export const componentName = 'ProductIntro';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function plugin({ graph, rendering, page }: ComponentPluginParams<any>): Thing[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = (rendering as any)?.fields?.data?.item?.children?.results ?? [];
  if (!children.length) {
    return graph;
  }
  return children.reduce<Thing[]>((currentGraph, child) => {
    const productSwatchImage = child.fields?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (field: any) => field.name === 'productImageSwatch'
    )?.jsonValue;
    const imageObject = createImageObject(
      productSwatchImage?.fields?.swatchImage,
      page.customProps.siteInfo
    );
    return appendImageObject(currentGraph, imageObject);
  }, graph);
}
