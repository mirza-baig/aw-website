import { Debugger } from 'debug';
import { NextRequest } from 'next/server';

import { AppRouteHandlerFn, AppRouteHandlerFnContext } from '../../types';
import { Wrapper } from '../wrapper';

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
