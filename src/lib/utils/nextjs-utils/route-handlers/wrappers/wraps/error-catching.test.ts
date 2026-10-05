import type { Debugger } from 'debug';
import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import type { AppRouteHandlerFnContext } from '../../types';
import { errorCatching } from './error-catching';

const request = new NextRequest('https://example.test/api/test');
const context: AppRouteHandlerFnContext = {
  params: Promise.resolve({ id: '123' }),
};

describe('lib > utils > nextjs-utils > route-handlers > wrappers > wraps > error-catching', () => {
  it('preserves a successful response and forwards request context', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const response = new Response('ok');
    const method = vi.fn().mockResolvedValue(response);

    const route = errorCatching({ debug })(method);
    const result = await route(request, context);

    expect(result).toBe(response);
    expect(method).toHaveBeenCalledWith(request, context);
    expect(debug).not.toHaveBeenCalled();
  });

  it('converts synchronous handler errors to a 500 problem response', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const error = new Error('handler failed');
    const method = vi.fn(() => {
      throw error;
    });

    const route = errorCatching({ debug })(method);
    const result = (await route(request, context)) as Response;

    expect(result.status).toBe(500);
    expect(result.headers.get('Content-Type')).toBe('application/problem+json');
    expect(await result.json()).toEqual({
      type: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred.',
      instance: request.url,
    });
    expect(debug).toHaveBeenCalledWith('error during API execution: %s', 'handler failed');
  });

  it('converts rejected handler promises to a 500 problem response', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const error = new Error('async failure');
    const method = vi.fn().mockRejectedValue(error);

    const route = errorCatching({ debug })(method);
    const result = (await route(request, context)) as Response;

    expect(result.status).toBe(500);
    expect(await result.json()).toMatchObject({ status: 500 });
    expect(debug).toHaveBeenCalledWith('error during API execution: %s', 'async failure');
  });

  it('logs serialized messages for non-Error failures', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const method = vi.fn().mockRejectedValue({ code: 'E_TEST' });

    const route = errorCatching({ debug })(method);

    await route(request, context);

    expect(debug).toHaveBeenCalledWith('error during API execution: %s', '{"code":"E_TEST"}');
  });
});
