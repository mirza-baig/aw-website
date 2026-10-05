import {
  ComponentRendering,
  ImageField,
  Item,
  PlaceholdersData,
  SiteInfo,
} from '@sitecore-content-sdk/nextjs';
import { describe, expect, it } from 'vitest';

import { componentFactory } from '../component-registry';
import { getAllRenderings } from '../get-all-renderings';
import { ComponentPluginParams, PluginParams } from '../plugin-types';
import { plugin as pagePrimaryImagePlugin } from '../plugins/page-primary-image-graph';
import { PrimaryImageFields } from './primary-image-graph';

type TestFields = PrimaryImageFields & {
  productImage?: ImageField;
  primaryVideo?: Item;
};

const siteInfo: SiteInfo = {
  hostName: '*',
  language: 'en',
  name: 'AndersenWindows',
  targetHostName: 'www.andersenwindows.com',
};

function image(src: string): ImageField {
  return {
    value: {
      src,
      alt: 'Test image',
      width: 1200,
      height: 800,
    },
  };
}

function componentParams(
  componentName: string,
  fields: TestFields,
  graph: ComponentPluginParams<TestFields>['graph'] = []
): ComponentPluginParams<TestFields> {
  return {
    graph,
    fields,
    rendering: { componentName } as ComponentRendering,
    page: {
      customProps: { siteInfo },
      layout: { sitecore: {} },
    } as unknown as ComponentPluginParams<TestFields>['page'],
  };
}

describe('schema-org-graph > component-plugins > primary-image-graph', () => {
  it('adds a canonical ImageObject for an unregistered component', async () => {
    const result = await componentFactory<TestFields>('UnregisteredComponent')(
      componentParams('UnregisteredComponent', {
        primaryImage: image('https://edge.sitecorecloud.io/sitecore/media-library/hero.jpg'),
      })
    );

    expect(result).toEqual([
      {
        '@type': 'ImageObject',
        '@id': 'https://www.andersenwindows.com/-/media-library/hero.jpg',
        contentUrl: 'https://www.andersenwindows.com/-/media-library/hero.jpg',
        creator: 'Andersen Windows',
      },
    ]);
  });

  it('ignores empty and non-standard image fields', async () => {
    const plugin = componentFactory<TestFields>('UnregisteredComponent');

    const emptyResult = await plugin(
      componentParams('UnregisteredComponent', { primaryImage: image('  ') })
    );
    const nonStandardResult = await plugin(
      componentParams('UnregisteredComponent', {
        productImage: image('/-/media/product.jpg'),
      })
    );

    expect(emptyResult).toEqual([]);
    expect(nonStandardResult).toEqual([]);
  });

  it('deduplicates repeated component images by canonical URL', async () => {
    const plugin = componentFactory<TestFields>('UnregisteredComponent');
    const params = componentParams('UnregisteredComponent', {
      primaryImage: image('/-/media/duplicate.jpg'),
    });

    const firstResult = await plugin(params);
    const secondResult = await plugin({ ...params, graph: firstResult });

    expect(secondResult).toBe(firstResult);
    expect(secondResult).toHaveLength(1);
  });

  it('deduplicates a component image already contributed by the page', async () => {
    const sharedImage = image('/-/media/shared.jpg');
    const page = {
      customProps: { siteInfo },
      layout: {
        sitecore: {
          route: {
            fields: { primaryImage: sharedImage },
          },
        },
      },
    } as unknown as PluginParams<unknown>['page'];

    const pageGraph = pagePrimaryImagePlugin({ graph: [], data: undefined, page });
    const componentGraph = await componentFactory<TestFields>('UnregisteredComponent')({
      ...componentParams('UnregisteredComponent', { primaryImage: sharedImage }, pageGraph),
      page,
    });

    expect(componentGraph).toBe(pageGraph);
    expect(componentGraph).toHaveLength(1);
  });

  it('composes a standard primary image with a registered component video plugin', async () => {
    const primaryVideo = {
      fields: {
        videoId: { value: '12345' },
        videoName: { value: 'Product overview' },
        vimeoVideoHash: { value: 'private-hash' },
      },
    } as unknown as Item;

    const result = await componentFactory<TestFields>('PromoGeneric')(
      componentParams('PromoGeneric', {
        primaryImage: image('/-/media/promo.jpg'),
        primaryVideo,
      })
    );

    expect(result.map((node) => (node as { '@type': string })['@type'])).toEqual([
      'ImageObject',
      'VideoObject',
    ]);
    expect(result[1]).toMatchObject({
      '@id': 'https://vimeo.com/12345',
      contentUrl: 'https://vimeo.com/12345',
    });
  });

  it('processes primary images from renderings in nested placeholders', async () => {
    const placeholders = {
      main: [
        {
          componentName: 'ParentComponent',
          fields: { primaryImage: image('/-/media/parent.jpg') },
          placeholders: {
            nested: [
              {
                componentName: 'ChildComponent',
                fields: { primaryImage: image('/-/media/child.jpg') },
              },
            ],
          },
        },
      ],
    } as unknown as PlaceholdersData;

    let graph: ComponentPluginParams<TestFields>['graph'] = [];
    for (const rendering of getAllRenderings(placeholders)) {
      graph = await componentFactory<TestFields>(rendering.componentName)({
        ...componentParams(rendering.componentName, rendering.fields as TestFields, graph),
        rendering,
      });
    }

    expect(graph.map((node) => (node as { contentUrl: string }).contentUrl)).toEqual([
      'https://www.andersenwindows.com/-/media/parent.jpg',
      'https://www.andersenwindows.com/-/media/child.jpg',
    ]);
  });
});
