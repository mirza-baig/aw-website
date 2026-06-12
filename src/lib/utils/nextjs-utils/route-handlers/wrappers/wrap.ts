import { AppRouteHandlerFn } from '../types';
import { Wrapper } from './wrapper';

type WrapReturn = {
  in: (...wrappers: Wrapper[]) => AppRouteHandlerFn;
};

export function wrap(method: AppRouteHandlerFn): WrapReturn {
  return {
    in: function (...wrappers: Wrapper[]): AppRouteHandlerFn {
      const wrapped = wrappers.reduce((prev, wrapper) => wrapper(prev), method);
      return wrapped;
    },
  };
}
