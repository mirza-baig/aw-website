import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { object, string } from 'yup';

import type { AppRouteHandlerFnContext } from '../types';
import { validating } from './validating';

const request = new NextRequest('https://example.test/api/test');
const context: AppRouteHandlerFnContext = {
  params: Promise.resolve({ id: '123' }),
};

describe('lib > utils > nextjs-utils > route-handlers > enhancers > validating', () => {
  it('passes validated data, request, and context to the handler', async () => {
    const body = { name: 'Ada' };
    const extractor = vi.fn().mockResolvedValue(body);
    const schema = object({ name: string().required() });
    const response = new Response('ok');
    const handler = vi.fn().mockResolvedValue(response);

    const route = validating({ extractor, schema, handler });
    const result = await route(request, context);

    expect(result).toBe(response);
    expect(handler).toHaveBeenCalledWith(body, request, context);
  });

  it('returns all validation errors as a 400 problem details response', async () => {
    const extractor = vi.fn().mockResolvedValue({ name: '', email: 'invalid' });
    const schema = object({
      name: string().required('Name is required'),
      email: string().email('Email is invalid').required('Email is required'),
    });
    const handler = vi.fn();

    const route = validating({ extractor, schema, handler });
    const result = await route(request, context);

    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(400);
    expect(result?.headers.get('Content-Type')).toBe('application/problem+json');
    expect(await result?.json()).toEqual({
      type: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1',
      title: 'One or more validation errors occurred',
      status: 400,
      errors: {
        name: ['Name is required'],
        email: ['Email is invalid'],
      },
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('rethrows extractor errors', async () => {
    const error = new Error('cannot read request');
    const extractor = vi.fn().mockRejectedValue(error);
    const route = validating({ extractor, schema: object(), handler: vi.fn() });

    await expect(route(request, context)).rejects.toBe(error);
  });

  it('rethrows non-validation handler errors', async () => {
    const error = new Error('handler failed');
    const route = validating({
      extractor: vi.fn().mockResolvedValue({}),
      schema: object(),
      handler: vi.fn().mockRejectedValue(error),
    });

    await expect(route(request, context)).rejects.toBe(error);
  });
});
