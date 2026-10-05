import { describe, expect, it } from 'vitest';

import { SuccessResponse } from './success-response';

describe('lib > utils > request-response-utils > responses > success-response', () => {
  it('returns a JSON response with the default status and content type', async () => {
    const response = new SuccessResponse({ title: 'Success' });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await response.json()).toEqual({ title: 'Success' });
  });

  it('uses the status from the success details', async () => {
    const response = new SuccessResponse({ status: 201, title: 'Created' });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ status: 201, title: 'Created' });
  });

  it('prefers the response init status over the success details status', async () => {
    const response = new SuccessResponse({ status: 201 }, { status: 202 });

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ status: 201 });
  });

  it('preserves a custom content type', () => {
    const response = new SuccessResponse({}, { headers: { 'Content-Type': 'text/plain' } });

    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });

  it('creates an OK response with the supplied title and status', async () => {
    const response = SuccessResponse.Ok('Completed', 201);

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ title: 'Completed', status: 201 });
  });

  it('creates a data response with the supplied data', async () => {
    const data = { id: '123' };
    const response = SuccessResponse.Data(data, 'Loaded');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ title: 'Loaded', status: 200, data });
  });
});
