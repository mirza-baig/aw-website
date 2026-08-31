import { Debug } from 'lib/constants/debug';
import { createShareARLinkHandler, shareARLinkSchema } from 'lib/marlimar/share-ar-link-action';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { bodyAsJson } from 'lib/utils/nextjs-utils/route-handlers/extractors/body-as-json';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';

const debug = Debug.api.shareARLink;

const handler = createShareARLinkHandler(debug);
export const POST = wrap(
  validating({
    schema: shareARLinkSchema,
    handler,
    extractor: bodyAsJson,
  })
).in(errorCatching({ debug }), startStopTimings({ debug }));
