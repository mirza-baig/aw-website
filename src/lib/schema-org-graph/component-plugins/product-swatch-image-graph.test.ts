import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { Thing } from 'schema-dts';
import { describe, expect, it } from 'vitest';

import { ComponentPluginParams } from '../plugin-types';
import { plugin } from './product-swatch-image-graph';

const siteInfo = {
  hostName: '*',
  language: 'en',
  name: 'AndersenWindows',
  targetHostName: 'www.andersenwindows.com',
};

function componentParams(
  children: unknown[],
  graph: Thing[] = []
): ComponentPluginParams<Record<string, never>> {
  return {
    graph,
    rendering: {
      componentName: 'ProductIntro',
      fields: {
        data: {
          item: {
            children: {
              results: children,
            },
          },
        },
      },
    } as unknown as ComponentRendering,
    page: {
      customProps: { siteInfo },
      layout: { sitecore: {} },
    },
  } as unknown as ComponentPluginParams<Record<string, never>>;
}

describe('schema-org-graph > component-plugins > product-intro-graph', () => {
  // Adds Product Swatch Image
  it('adds ImageObject entries for product swatch images', async () => {
    const params = componentParams([
      {
        fields: [
          {
            name: 'productImageSwatch',
            jsonValue: {
              id: '123',
              fields: {
                swatchImage: {
                  value: {
                    src: 'https://www.dev.xmc.andersenwindows.com/-/media/test.jpg',
                    alt: 'Black',
                    width: '80',
                    height: '80',
                  },
                },
              },
            },
          },
        ],
      },
    ]);

    const result = await plugin(params);

    expect(result[0]).toMatchObject({
      '@type': 'ImageObject',
      creator: 'Andersen Windows',
    });

    expect((result[0] as { contentUrl: string }).contentUrl).toContain('test.jpg');
  });

  //No Children
  it('returns existing graph when no children exist', async () => {
    const graph: Thing[] = [];

    const result = await plugin(componentParams([], graph));
    expect(result).toBe(graph);
  });
  // Ignores Missing Product Swatch
  it('ignores child without productImageSwatch field', async () => {
    const result = await plugin(
      componentParams([
        {
          fields: [
            {
              name: 'title',
              jsonValue: {
                value: 'Test',
              },
            },
          ],
        },
      ])
    );
    expect(result).toEqual([]);
  });
  // Multiple Swatch Images
  it('adds image objects for multiple swatch images', async () => {
    const result = await plugin(
      componentParams([
        {
          fields: [
            {
              name: 'productImageSwatch',
              jsonValue: {
                fields: {
                  swatchImage: {
                    value: {
                      src: '/-/media/swatch1.jpg',
                    },
                  },
                },
              },
            },
          ],
        },
        {
          fields: [
            {
              name: 'productImageSwatch',
              jsonValue: {
                fields: {
                  swatchImage: {
                    value: {
                      src: '/-/media/swatch2.jpg',
                    },
                  },
                },
              },
            },
          ],
        },
      ])
    );

    expect(result).toHaveLength(2);
    expect(result.map((node: Thing) => (node as { contentUrl: string }).contentUrl)).toEqual([
      'https://www.andersenwindows.com/-/media/swatch1.jpg',
      'https://www.andersenwindows.com/-/media/swatch2.jpg',
    ]);
  });
});
