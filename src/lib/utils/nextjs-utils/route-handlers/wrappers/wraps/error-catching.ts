import { Debugger } from 'debug';
import { getErrorMessage } from 'lib/utils/error-utils/get-error-message';
import { ProblemDetailsResponse } from 'lib/utils/request-response-utils/responses/problem-details-response';
import { NextRequest } from 'next/server';

import { AppRouteHandlerFn, AppRouteHandlerFnContext } from '../../types';
import { Wrapper } from '../wrapper';

export function errorCatching({ debug }: { debug: Debugger }): Wrapper {
  return function errorCatchingWrap(method: AppRouteHandlerFn): AppRouteHandlerFn {
    return async function ErrorCatchingAppRouteHandlerFn(
      request: NextRequest,
      ctx: AppRouteHandlerFnContext
    ): Promise<void | Response> {
      try {
        let result = method(request, ctx);
        if (result instanceof Promise) {
          result = await result;
        }
        return result;
      } catch (err: unknown) {
        debug('error during API execution: %s', getErrorMessage(err));
        return new ProblemDetailsResponse({
          type: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1',
          title: 'Internal Server Error',
          status: 500,
          detail: 'An unexpected error occurred.',
          instance: request.url,
        });
      }
    };
  };
}
