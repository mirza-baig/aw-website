import { AppRouteHandlerFn } from '../types';

/** Transforms an app route handler by returning a wrapped route handler. */
export type Wrapper = (method: AppRouteHandlerFn) => AppRouteHandlerFn;
