import { Field } from '@sitecore-content-sdk/nextjs';
import { BazaarvoiceReviewData, fetchReviews } from 'lib/bazaarvoice/fetch-reviews';
import { Person, Rating, Review, Thing } from 'schema-dts';

import { hasGraphNode, updateGraphNode } from '../graph-utils';
import { ComponentPluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const componentName = 'BazaarvoiceReviews';

type BazaarvoiceReviewsFields =
  Sitecore.Components.General.BazaarvoiceReviews.BazaarvoiceReviews['fields'];

function getBazaarvoiceProductId(fields: BazaarvoiceReviewsFields): string {
  const override = fields?.bazaarvoiceProductIdOverride?.value?.trim();
  if (override) {
    return override;
  }

  return (
    (
      fields?.productItem?.fields?.bazaarvoiceProductId as Field<string> | undefined
    )?.value?.trim() ?? ''
  );
}

function toSchemaReview(review: BazaarvoiceReviewData, canonicalHostName: string): Review | null {
  const id = review.Id?.trim();
  const authorName = review.UserNickname?.trim();
  if (
    !id ||
    !authorName ||
    authorName.length > 100 ||
    !Number.isFinite(review.Rating) ||
    Number(review.Rating) <= 0
  ) {
    return null;
  }

  const author: Person = {
    '@type': 'Person',
    name: authorName,
  };
  const reviewRating: Rating = {
    '@type': 'Rating',
    ratingValue: review.Rating,
    bestRating: Number.isFinite(review.RatingRange) ? review.RatingRange : 5,
    worstRating: 1,
  };

  return {
    '@type': 'Review',
    '@id': `${canonicalHostName}/#/schema/Review/Bazaarvoice/${id}`,
    name: review.Title?.trim() || undefined,
    reviewBody: review.ReviewText?.trim() || undefined,
    datePublished: review.SubmissionTime || undefined,
    author,
    reviewRating,
  };
}

function mergeReviews(existing: unknown, reviews: Review[]): Review[] {
  let existingReviews: unknown[] = [];
  if (Array.isArray(existing)) {
    existingReviews = existing;
  } else if (existing != null) {
    existingReviews = [existing];
  }

  const existingIds = new Set(
    existingReviews
      .map((review) =>
        typeof review === 'object' && review !== null
          ? (review as Record<string, unknown>)['@id']
          : undefined
      )
      .filter((id): id is string => typeof id === 'string')
  );

  return [
    ...(existingReviews as Review[]),
    ...reviews.filter((review) => !review['@id'] || !existingIds.has(review['@id'])),
  ];
}

export async function plugin({
  graph,
  fields,
  page,
}: ComponentPluginParams<BazaarvoiceReviewsFields>): Promise<Thing[]> {
  const bazaarvoiceProductId = getBazaarvoiceProductId(fields);
  if (!bazaarvoiceProductId || !hasGraphNode(graph, 'Product')) {
    return graph;
  }

  const reviewData = await fetchReviews(bazaarvoiceProductId);
  const canonicalHostName = (page.customProps.siteInfo?.canonicalHostName ?? '') as string;
  const reviews = reviewData
    .map((review) => toSchemaReview(review, canonicalHostName))
    .filter((review): review is Review => review !== null);

  return reviews.length
    ? updateGraphNode(graph, 'Product', (node) => ({
        ...node,
        review: mergeReviews(node.review, reviews),
      }))
    : graph;
}
