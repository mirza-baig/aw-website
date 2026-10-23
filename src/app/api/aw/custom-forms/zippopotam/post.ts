import { Debug } from 'lib/constants/debug';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { bodyAsJson } from 'lib/utils/nextjs-utils/route-handlers/extractors/body-as-json';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';
import { createZippopotamHandler, zippopotamSchema } from 'lib/zippopotam/zippopotam-action';

const debug = Debug.api.zippopotam;

const handler = createZippopotamHandler(debug);

export const POST = wrap(
  validating({
    schema: zippopotamSchema,
    handler,
    extractor: bodyAsJson,
  })
).in(errorCatching({ debug }), startStopTimings({ debug }));
