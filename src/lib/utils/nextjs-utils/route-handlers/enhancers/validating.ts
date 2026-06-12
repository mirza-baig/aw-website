import { ProblemDetailsResponse } from 'lib/utils/request-response-utils/responses/problem-details-response';
import { NextRequest } from 'next/server';
import { Schema, ValidationError } from 'yup';

import { Extractor } from '../extractors/extractor';
import { AppRouteHandlerFn, AppRouteHandlerFnContext, AppRouteHandlerFnReturn } from '../types';

export type ValidatedAppRouteHandlerFn<T> = (
  body: T,
  request: NextRequest,
  ctx: AppRouteHandlerFnContext
) => AppRouteHandlerFnReturn;

export function validating<T>({
  handler,
  schema,
  extractor,
}: {
  handler: ValidatedAppRouteHandlerFn<T>;
  schema: Schema;
  extractor: Extractor;
}): AppRouteHandlerFn {
  return async function ValidatingAppRouteHandlerFn(
    request: NextRequest,
    ctx: AppRouteHandlerFnContext
  ): Promise<void | Response> {
    const body = await extractor(request);

    try {
      const validatedBody = await schema.validate(body, { abortEarly: false });

      let result = handler(validatedBody, request, ctx);
      if (result instanceof Promise) {
        result = await result;
      }

      return result;
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const errors = err.inner.reduce(
          (prev: Record<string, string[]>, error: ValidationError) => {
            if (error.path) {
              prev[error.path] = error.errors;
            }
            return prev;
          },
          {}
        );
        return new ProblemDetailsResponse({
          type: 'https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1',
          title: 'One or more validation errors occurred',
          status: 400,
          errors,
        });
      }

      throw err;
    }
  };
}
