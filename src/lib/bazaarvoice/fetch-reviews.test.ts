import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchReviews } from './fetch-reviews';

vi.mock('aw.config.server', () => ({
  default: {
    bazaarvoice: {
      apiUrl: 'https://stg.api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=',
      apiKey: 'test-passkey',
    },
  },
}));

describe('fetchReviews', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests the latest reviews for the Bazaarvoice product', async () => {
    const reviews = [{ Id: 'review-id', Rating: 5 }];
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Results: reviews }),
    } as Response);

    await expect(fetchReviews(' 100-AWN ')).resolves.toEqual(reviews);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://stg.api.bazaarvoice.com/data/reviews.json?apiversion=5.4&passkey=test-passkey&Filter=ProductId:100-AWN&Sort=SubmissionTime:desc&Limit=10'
    );
  });

  it('does not request reviews for an empty product id', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    await expect(fetchReviews('   ')).resolves.toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('reports Bazaarvoice API errors returned in a successful response', async () => {
    const error = { Code: 'ERROR_PARAM_INVALID_FILTER_ATTRIBUTE', Message: 'Invalid filter' };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Errors: [error] }),
    } as Response);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchReviews('100-AWN')).resolves.toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('[fetch-reviews] API response errors:', [error]);
  });

  it('reports HTTP errors without exposing a failed response as reviews', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    } as Response);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchReviews('100-AWN')).resolves.toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[fetch-reviews] API error:',
      503,
      'Service Unavailable'
    );
  });

  it('returns an empty list when the API response has no results array', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Results: { Id: 'not-an-array' } }),
    } as Response);

    await expect(fetchReviews('100/AWN')).resolves.toEqual([]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('Filter=ProductId:100%2FAWN')
    );
  });

  it('reports network and response parsing failures', async () => {
    const error = new Error('network unavailable');
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchReviews('100-AWN')).resolves.toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('[fetch-reviews] Fetch failed:', error);
  });
});
