import { Debug } from 'lib/constants/debug';
import {
  createRenoworksGetProductOptionsHandler,
  renoworksGetProductOptionsSchema,
} from 'lib/design-tool-actions/renoworks-get-product-options';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { bodyAsJson } from 'lib/utils/nextjs-utils/route-handlers/extractors/body-as-json';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';

const debug = Debug.api.designTool.renoworksGetProductOptions;

export { renoworksGetProductOptionsSchema as schema } from 'lib/design-tool-actions/renoworks-get-product-options';

export const handler = createRenoworksGetProductOptionsHandler(debug);

export const POST = wrap(
  validating({ schema: renoworksGetProductOptionsSchema, handler, extractor: bodyAsJson })
).in(errorCatching({ debug }), startStopTimings({ debug }));
