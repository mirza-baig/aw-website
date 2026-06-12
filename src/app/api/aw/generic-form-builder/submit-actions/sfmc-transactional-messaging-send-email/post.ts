import { Debug } from 'lib/constants/debug';
import {
  createSfmcTransactionalMessagingSendEmailHandler,
  sfmcTransactionalMessagingSendEmailSchema,
} from 'lib/shared-form-submit-actions/sfmc-transactional-messaging-send-email/sfmc-transactional-messaging-send-email-submit-action';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { bodyAsJson } from 'lib/utils/nextjs-utils/route-handlers/extractors/body-as-json';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';

const debug = Debug.api.genericFormBuilder.submitActions.sfmcTransactionalMessagingSendEmail;

export { sfmcTransactionalMessagingSendEmailSchema as schema } from 'lib/shared-form-submit-actions/sfmc-transactional-messaging-send-email/sfmc-transactional-messaging-send-email-submit-action';

export const handler = createSfmcTransactionalMessagingSendEmailHandler(debug);

export const POST = wrap(
  validating({ schema: sfmcTransactionalMessagingSendEmailSchema, handler, extractor: bodyAsJson })
).in(errorCatching({ debug }), startStopTimings({ debug }));
