import config from 'aw.config.server';
import {
  circuitBreaker,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleAll,
  retry,
  timeout,
  TimeoutStrategy,
  wrap,
} from 'cockatiel';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const getOfferByStoreId = async (storeId: string) => {
  // Create a retry policy that'll try whatever function we execute 3
  // times with a randomized exponential backoff.
  const retryPolicy = retry(handleAll, { maxAttempts: 3, backoff: new ExponentialBackoff() });

  // Create a circuit breaker that'll stop calling the executed function for 2
  // seconds if it fails 5 times in a row.
  const circuitBreakerPolicy = circuitBreaker(handleAll, {
    halfOpenAfter: 2 * 1000,
    breaker: new ConsecutiveBreaker(5),
  });

  // Create a timeout policy that specifies the duration of how long to wait
  // before timing out execute()'d functions
  const timeoutPolicy = timeout(5000, TimeoutStrategy.Cooperative);

  // Create a policy that retries 3 times, calling through the circuit breaker, and timesout after 5 seconds
  const retryWithBreaker = wrap(retryPolicy, circuitBreakerPolicy, timeoutPolicy);

  const requestOptions = { method: 'GET' };
  const baseUrl = config.enterpriseApi.url;
  const offerURL = `${baseUrl}/api/e/rba/vendor/v1/offers/getAffiliateCurrentOffer?storeId=${storeId}&client=aw`;

  const response = await retryWithBreaker.execute(() => fetch(offerURL, requestOptions));

  const data = await response.json();
  return data;
};

type StoreRequestBody = {
  storeId?: string[];
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: StoreRequestBody = await req.json();
    const storeId = body.storeId ? body.storeId : '';
    if (typeof storeId !== 'string') {
      return Response.json(
        { message: 'Invalid payload', error: 'storeId is required' },
        { status: 400 }
      );
    }

    const results = await getOfferByStoreId(storeId);

    return Response.json({ results }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected server error';
    return Response.json({ message: 'Failed to fetch offer', error: msg }, { status: 500 });
  }
}
