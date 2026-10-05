import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import type { AppRouteHandlerFnContext } from '../types';
import { wrap } from './wrap';
import type { Wrapper } from './wrapper';

const request = new NextRequest('https://example.test/api/test');
const context: AppRouteHandlerFnContext = {
  params: Promise.resolve({ id: '123' }),
};

describe('lib > utils > nextjs-utils > route-handlers > wrappers > wrap', () => {
  it('returns the original handler when no wrappers are provided', () => {
    const method = vi.fn();

    expect(wrap(method).in()).toBe(method);
  });

  it('composes wrappers with the last wrapper as the outermost', async () => {
    const events: string[] = [];
    const response = new Response('ok');
    const method = vi.fn().mockImplementation(async () => {
      events.push('method');
      return response;
    });
    const first: Wrapper = (next) => async (req, ctx) => {
      events.push('first:start');
      const result = await next(req, ctx);
      events.push('first:end');
      return result;
    };
    const second: Wrapper = (next) => async (req, ctx) => {
      events.push('second:start');
      const result = await next(req, ctx);
      events.push('second:end');
      return result;
    };

    const route = wrap(method).in(first, second);
    const result = await route(request, context);

    expect(result).toBe(response);
    expect(events).toEqual(['second:start', 'first:start', 'method', 'first:end', 'second:end']);
  });

  it('passes the request and context to the base handler', async () => {
    const method = vi.fn().mockResolvedValue(undefined);

    await wrap(method).in()(request, context);

    expect(method).toHaveBeenCalledWith(request, context);
  });
});
