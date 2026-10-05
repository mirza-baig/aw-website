import { Debugger } from 'debug';
import { NextRequest } from 'next/server';

import { AppRouteHandlerFn, AppRouteHandlerFnContext } from '../../types';
import { Wrapper } from '../wrapper';

/**
 * Wraps an API route handler with start and completion timing logs.
 *
 * @param debug The debugger used to log handler start and completion messages.
 * @returns A wrapper that logs handler start and successful completion duration for the wrapped handler.
 */
export function startStopTimings({ debug }: { debug: Debugger }): Wrapper {
  return function startStopTimingWrap(method: AppRouteHandlerFn): AppRouteHandlerFn {
    return async function StartStopTimingsAppRouteHandlerFn(
      request: NextRequest,
      ctx: AppRouteHandlerFnContext
    ): Promise<void | Response> {
      const startTimestamp = Date.now();
      debug('handler start');
      let result = method(request, ctx);
      if (result instanceof Promise) {
        result = await result;
      }
      debug('handler end in %dms', Date.now() - startTimestamp);
      return result;
    };
  };
}
