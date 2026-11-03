import config from 'aw.config.server';

export type BazaarvoiceRatingData = {
  ReviewStatistics?: {
    AverageOverallRating?: number;
    TotalReviewCount?: number;
  };
};

export async function fetchAggregateRating(
  bazaarvoiceProductId: string
): Promise<BazaarvoiceRatingData | null> {
  const sanitizedId = bazaarvoiceProductId.replaceAll(/\s/g, '');
  if (!sanitizedId) {
    return null;
  }

  const apiUrl = `${config.bazaarvoice.apiUrl}${config.bazaarvoice.apiKey}&Filter=ProductId:${sanitizedId}&Include=Products,Comments&Stats=Reviews`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(
        '[fetch-aggregate-rating] API error:',
        response.status,
        response.statusText,
        apiUrl
      );
      return null;
    }
    const data = await response.json();
    const result = (data?.Includes?.Products?.[sanitizedId] as BazaarvoiceRatingData) ?? null;
    if (!result) {
      console.warn('[fetch-aggregate-rating] No product data for id:', sanitizedId);
    }
    return result;
  } catch (error) {
    console.error('[fetch-aggregate-rating] Fetch failed:', error, apiUrl);
    return null;
  }
}
