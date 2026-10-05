import type { Debugger } from 'debug';
import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import type { AppRouteHandlerFnContext } from '../../types';
import { startStopTimings } from './start-stop-timing';

const request = new NextRequest('https://example.test/api/test');
const context: AppRouteHandlerFnContext = {
  params: Promise.resolve({ id: '123' }),
};

describe('lib > utils > nextjs-utils > route-handlers > wrappers > wraps > start-stop-timing', () => {
  it('returns the response, forwards request context, and logs the duration', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const response = new Response('ok');
    const method = vi.fn().mockReturnValue(response);
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1037);

    const route = startStopTimings({ debug })(method);
    const result = await route(request, context);

    expect(result).toBe(response);
    expect(method).toHaveBeenCalledWith(request, context);
    expect(debug).toHaveBeenNthCalledWith(1, 'handler start');
    expect(debug).toHaveBeenNthCalledWith(2, 'handler end in %dms', 37);
  });

  it('awaits asynchronous handlers before logging completion', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const response = new Response('ok');
    const method = vi.fn().mockResolvedValue(response);
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1010);

    const route = startStopTimings({ debug })(method);
    const result = await route(request, context);

    expect(result).toBe(response);
    expect(debug).toHaveBeenLastCalledWith('handler end in %dms', 10);
  });

  it('propagates handler errors without logging completion', async () => {
    const debug = vi.fn() as unknown as Debugger;
    const error = new Error('handler failed');
    const method = vi.fn().mockRejectedValue(error);

    const route = startStopTimings({ debug })(method);

    await expect(route(request, context)).rejects.toBe(error);
    expect(debug).toHaveBeenCalledWith('handler start');
    expect(debug).not.toHaveBeenCalledWith(expect.stringContaining('handler end'));
  });
});
