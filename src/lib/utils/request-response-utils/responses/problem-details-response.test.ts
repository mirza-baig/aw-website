import { describe, expect, it } from 'vitest';

import { ProblemDetailsResponse } from './problem-details-response';

describe('lib > utils > request-response-utils > responses > problem-details-response', () => {
  it('returns a problem JSON response with the default status and content type', async () => {
    const response = new ProblemDetailsResponse({ title: 'Bad Request' });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-Type')).toBe('application/problem+json');
    expect(await response.json()).toEqual({ title: 'Bad Request' });
  });

  it('uses the status from the problem details', async () => {
    const problemDetails = {
      status: 422,
      title: 'Validation failed',
      errors: { email: ['Invalid email'] },
    };
    const response = new ProblemDetailsResponse(problemDetails);

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual(problemDetails);
  });

  it('prefers the response init status over the problem details status', async () => {
    const response = new ProblemDetailsResponse({ status: 422 }, { status: 400 });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ status: 422 });
  });

  it('preserves a custom content type', () => {
    const response = new ProblemDetailsResponse(
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );

    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});
