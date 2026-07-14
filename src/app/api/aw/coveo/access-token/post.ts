import { Debug } from 'lib/constants/debug';
import searchTokenService from 'lib/coveo/search-token-service';
import { validating } from 'lib/utils/nextjs-utils/route-handlers/enhancers/validating';
import { searchParams } from 'lib/utils/nextjs-utils/route-handlers/extractors/search-params';
import { wrap } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wrap';
import { errorCatching } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/error-catching';
import { startStopTimings } from 'lib/utils/nextjs-utils/route-handlers/wrappers/wraps/start-stop-timing';
import { SuccessResponse } from 'lib/utils/request-response-utils/responses/success-response';
import { object, string } from 'yup';

const debug = Debug.api.coveo.accessToken;

export const schema = object({
  organizationid: string().required(),
});

type Body = {
  organizationid: string;
};

export async function handler(body: Body): Promise<Response> {
  debug('processing request: %o', body);

  const token = await searchTokenService.getSearchToken(body.organizationid);

  debug('received access token from coveo');

  return SuccessResponse.Data({ token }, 'Access Token Created');
}

const extractor = searchParams();

export const POST = wrap(validating({ schema, handler, extractor })).in(
  errorCatching({ debug }),
  startStopTimings({ debug })
);
