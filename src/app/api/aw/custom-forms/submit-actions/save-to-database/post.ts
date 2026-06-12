import { randomUUID } from 'node:crypto';

import { Debug } from 'lib/constants/debug';
import externalDbService, { EntForm } from 'lib/external-db';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { bodyAsJson } from 'lib/utils/nextjs-utils/route-handlers/extractors/body-as-json';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';
import { SuccessResponse } from 'lib/utils/request-response-utils/responses/success-response';
import { array, lazy, object, string } from 'yup';

const debug = Debug.api.customForms.submitActions.saveToDatabase;

export const schema = object({
  formId: string().required(),
  sessionId: string().optional(),
  name: string().required(),
  lines: array()
    .of(
      object({
        fieldId: string().required(),
        name: string().required(),
        type: string().required(),
        value: lazy((value) =>
          Array.isArray(value) ? array().of(string().required()) : string().nullable()
        ).optional(),
      })
    )
    .required(),
});

type Body = {
  formId: string;
  sessionId?: string;
  name: string;
  lines: {
    fieldId: string;
    name: string;
    type: string;
    value?: string | string[] | null;
  }[];
};

export async function handler(body: Body): Promise<Response> {
  const sessionId = body.sessionId ?? randomUUID();

  debug('processing request: %o', body);

  const lines =
    body.lines?.map((l) => ({
      fieldId: l.fieldId,
      fieldName: l.name,
      fieldType: l.type,
      fieldValue: Array.isArray(l.value) ? l.value.join(',') : (l.value ?? null),
    })) ?? [];

  const entForm: EntForm = {
    formId: body.formId,
    sessionId,
    formName: body.name,
    lines,
  };

  debug('saving to database: %o', entForm);

  await externalDbService.createOrUpdateEntForm(entForm);

  return SuccessResponse.Ok('Form Saved', 201);
}

const extractor = bodyAsJson;

export const POST = wrap(validating({ schema, handler, extractor })).in(
  errorCatching({ debug }),
  startStopTimings({ debug })
);
