import { ComponentRendering, Field, Item, SiteInfo } from '@sitecore-content-sdk/nextjs';
import { fetchReviews } from 'lib/bazaarvoice/fetch-reviews';
import { Product, Thing } from 'schema-dts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ComponentPluginParams } from '../plugin-types';
import { plugin } from './bazaarvoice-reviews-graph';
import { Sitecore } from '.sitecore/AndersenWindows.model';

vi.mock('lib/bazaarvoice/fetch-reviews', () => ({
  fetchReviews: vi.fn(),
}));

type BazaarvoiceReviewsFields =
  Sitecore.Components.General.BazaarvoiceReviews.BazaarvoiceReviews['fields'];

const siteInfo: SiteInfo = {
  hostName: '*',
  language: 'en',
  name: 'AndersenWindows',
  targetHostName: 'www.andersenwindows.com',
  canonicalHostName: 'https://www.andersenwindows.com',
};

function componentParams(
  fields: BazaarvoiceReviewsFields,
  graph: Thing[]
): ComponentPluginParams<BazaarvoiceReviewsFields> {
  return {
    graph,
    fields,
    rendering: { componentName: 'BazaarvoiceReviews' } as ComponentRendering,
    page: {
      customProps: { siteInfo },
      layout: { sitecore: {} },
    } as unknown as ComponentPluginParams<BazaarvoiceReviewsFields>['page'],
  };
}

function fields(productId: string, override = ''): BazaarvoiceReviewsFields {
  return {
    bazaarvoiceProductIdOverride: { value: override } as Field<string>,
    productItem: {
      fields: {
        bazaarvoiceProductId: { value: productId },
      },
    } as unknown as Item,
  } as BazaarvoiceReviewsFields;
}

describe('schema-org-graph > component-plugins > bazaarvoice-reviews-graph', () => {
  beforeEach(() => {
    vi.mocked(fetchReviews).mockReset();
  });

  it('adds Bazaarvoice reviews to the existing Product without changing aggregate rating', async () => {
    vi.mocked(fetchReviews).mockResolvedValue([
      {
        Id: '26573836',
        Rating: 5,
        RatingRange: 5,
        Title: 'Excellent awning window',
        ReviewText: 'Easy to operate and looks great.',
        UserNickname: 'WindowOwner',
        SubmissionTime: '2026-09-18T14:59:04.000+00:00',
      },
    ]);
    const product: Product = {
      '@type': 'Product',
      '@id': 'https://www.andersenwindows.com/#/schema/Product/100-AWN',
      name: '100 Series Awning Window',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.7,
        reviewCount: 3,
      },
    };

    const result = await plugin(componentParams(fields('100-AWN'), [product]));

    expect(fetchReviews).toHaveBeenCalledWith('100-AWN');
    expect(result).toEqual([
      {
        ...product,
        review: [
          {
            '@type': 'Review',
            '@id': 'https://www.andersenwindows.com/#/schema/Review/Bazaarvoice/26573836',
            name: 'Excellent awning window',
            reviewBody: 'Easy to operate and looks great.',
            datePublished: '2026-09-18T14:59:04.000+00:00',
            author: {
              '@type': 'Person',
              name: 'WindowOwner',
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: 5,
              bestRating: 5,
              worstRating: 1,
            },
          },
        ],
      },
    ]);
  });

  it('uses the component override and omits incomplete review fields', async () => {
    vi.mocked(fetchReviews).mockResolvedValue([
      {
        Id: '22222077',
        Rating: 4,
        RatingRange: 5,
        Title: null,
        ReviewText: null,
        UserNickname: 'Verified owner',
      },
      { Id: 'missing-rating', UserNickname: 'Reviewer' },
      { Id: 'missing-author', Rating: 5 },
    ]);
    const product: Product = {
      '@type': 'Product',
      name: 'Awning Window',
    };

    const result = await plugin(componentParams(fields('product-id', ' override-id '), [product]));

    expect(fetchReviews).toHaveBeenCalledWith('override-id');
    expect(result[0]).toEqual({
      ...product,
      review: [
        {
          '@type': 'Review',
          '@id': 'https://www.andersenwindows.com/#/schema/Review/Bazaarvoice/22222077',
          name: undefined,
          reviewBody: undefined,
          datePublished: undefined,
          author: {
            '@type': 'Person',
            name: 'Verified owner',
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: 4,
            bestRating: 5,
            worstRating: 1,
          },
        },
      ],
    });
  });

  it('does not fetch reviews when the component has no product id or Product graph node', async () => {
    const product: Product = { '@type': 'Product', name: 'Awning Window' };

    expect(await plugin(componentParams(fields(''), [product]))).toEqual([product]);
    expect(await plugin(componentParams(fields('100-AWN'), []))).toEqual([]);
    expect(fetchReviews).not.toHaveBeenCalled();
  });

  it('keeps the graph unchanged when all fetched reviews are invalid', async () => {
    vi.mocked(fetchReviews).mockResolvedValue([
      { Id: 'missing-author', Rating: 5 },
      { Id: 'zero-rating', UserNickname: 'Reviewer', Rating: 0 },
      { Id: 'non-finite-rating', UserNickname: 'Reviewer', Rating: NaN },
      { Id: 'long-author', UserNickname: 'a'.repeat(101), Rating: 5 },
      { UserNickname: 'missing-id', Rating: 5 },
    ]);
    const product: Product = { '@type': 'Product', name: 'Awning Window' };

    await expect(plugin(componentParams(fields('100-AWN'), [product]))).resolves.toEqual([product]);
  });

  it('preserves existing reviews and does not add duplicate Bazaarvoice review ids', async () => {
    vi.mocked(fetchReviews).mockResolvedValue([
      { Id: 'existing-review', Rating: 5, UserNickname: 'New data' },
      { Id: 'new-review', Rating: 4, UserNickname: 'Reviewer' },
    ]);
    const existingReview = {
      '@type': 'Review',
      '@id': 'https://www.andersenwindows.com/#/schema/Review/Bazaarvoice/existing-review',
      author: { '@type': 'Person', name: 'Original data' },
    };
    const product: Product = {
      '@type': 'Product',
      review: existingReview,
    };

    const result = await plugin(componentParams(fields('100-AWN'), [product]));

    expect(result[0]).toMatchObject({
      review: [
        existingReview,
        expect.objectContaining({
          '@id': 'https://www.andersenwindows.com/#/schema/Review/Bazaarvoice/new-review',
        }),
      ],
    });
  });
});
