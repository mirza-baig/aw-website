import { Debug } from 'lib/constants/debug';
import {
  createSendEmailHandler,
  sendEmailSchema,
} from 'lib/shared-form-submit-actions/send-email/send-email-submit-action';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { bodyAsJson } from 'lib/utils/nextjs-utils/route-handlers/extractors/body-as-json';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';

const debug = Debug.api.customForms.submitActions.sendEmail;

const handler = createSendEmailHandler(debug);

export const POST = wrap(
  validating({ schema: sendEmailSchema, handler, extractor: bodyAsJson })
).in(errorCatching({ debug }), startStopTimings({ debug }));
