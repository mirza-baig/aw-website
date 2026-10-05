import { AppRouteHandlerFn } from '../types';
import { Wrapper } from './wrapper';

type WrapReturn = {
  in: (...wrappers: Wrapper[]) => AppRouteHandlerFn;
};

/**
 * Composes route-handler wrappers around a base handler.
 *
 * Wrappers are applied from left to right; the last wrapper passed to `in`
 * becomes the outermost wrapper.
 *
 * @param method The base route handler to wrap.
 * @returns An object used to apply one or more route-handler wrappers.
 */
export function wrap(method: AppRouteHandlerFn): WrapReturn {
  return {
    in: function (...wrappers: Wrapper[]): AppRouteHandlerFn {
      const wrapped = wrappers.reduce((prev, wrapper) => wrapper(prev), method);
      return wrapped;
    },
  };
}
