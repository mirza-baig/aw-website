import { NextRequest } from 'next/server';

/*
The following are from
https://github.com/vercel/next.js/blob/canary/packages/next/src/server/web/http.ts

Note: The return value was changed to solve this err message:
Type error: Type 'typeof import("[path to file]")' does not satisfy the constraint 'RouteHandlerConfig<"[path for route]">'.
  The types returned by 'POST(...)' are incompatible between these types.
    Type 'unknown' is not assignable to type 'void | Response | Promise<void | Response>'.
*/

/**
 * AppRouteHandlerFnContext is the context that is passed to the handler as the
 * second argument.
 */
export type AppRouteHandlerFnContext = {
  params?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * AppRouteHandlerFnReturn is the expected return type of a AppRouter route handler function.
 */
export type AppRouteHandlerFnReturn = void | Response | Promise<void | Response>;

/**
 * Handler function for app routes. If a non-Response value is returned, an error
 * will be thrown.
 */
export type AppRouteHandlerFn = (
  /**
   * Incoming request object.
   */
  req: NextRequest,
  /**
   * Context properties on the request (including the parameters if this was a
   * dynamic route).
   */
  ctx: AppRouteHandlerFnContext
) => AppRouteHandlerFnReturn;
