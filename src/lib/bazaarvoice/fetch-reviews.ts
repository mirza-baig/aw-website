import config from 'aw.config.server';

const REVIEW_LIMIT = 10;

export type BazaarvoiceReviewData = {
  Id?: string;
  ProductId?: string;
  Rating?: number;
  RatingRange?: number;
  Title?: string | null;
  ReviewText?: string | null;
  UserNickname?: string | null;
  SubmissionTime?: string;
};

type BazaarvoiceReviewsResponse = {
  Errors?: {
    Code?: string;
    Message?: string;
  }[];
  Results?: BazaarvoiceReviewData[];
};

export async function fetchReviews(bazaarvoiceProductId: string): Promise<BazaarvoiceReviewData[]> {
  const sanitizedId = bazaarvoiceProductId.trim();
  if (!sanitizedId) {
    return [];
  }

  if (!config.bazaarvoice.apiUrl || !config.bazaarvoice.apiKey) {
    console.error('[fetch-reviews] Bazaarvoice API configuration is missing');
    return [];
  }

  const apiUrl = `${config.bazaarvoice.apiUrl}${
    config.bazaarvoice.apiKey
  }&Filter=ProductId:${encodeURIComponent(
    sanitizedId
  )}&Sort=SubmissionTime:desc&Limit=${REVIEW_LIMIT}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error('[fetch-reviews] API error:', response.status, response.statusText);
      return [];
    }

    const data = (await response.json()) as BazaarvoiceReviewsResponse;
    if (data.Errors?.length) {
      console.error('[fetch-reviews] API response errors:', data.Errors);
      return [];
    }

    return Array.isArray(data.Results) ? data.Results : [];
  } catch (error) {
    console.error('[fetch-reviews] Fetch failed:', error);
    return [];
  }
}
