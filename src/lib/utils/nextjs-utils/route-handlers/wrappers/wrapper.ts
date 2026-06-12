import { AppRouteHandlerFn } from '../types';

export type Wrapper = (method: AppRouteHandlerFn) => AppRouteHandlerFn;
