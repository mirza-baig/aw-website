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

const anonymousUserId = {
  name: 'anonymous',
  provider: 'Email Security Provider',
};

const apiKey = config.coveo.apiKey;

async function getAccessToken(organizationId: string): Promise<string> {
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

  const payload = JSON.stringify({
    userIds: [anonymousUserId],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: payload,
  };

  const response = await retryWithBreaker.execute(() =>
    fetch(`https://${organizationId}.org.coveo.com/rest/search/v2/token`, requestOptions)
  );

  const data = await response.json();
  return data.token;
}

export async function POST(req: NextRequest): Promise<Response> {
  const organizationid = req.nextUrl.searchParams.get('organizationid');

  if (organizationid === null || Array.isArray(organizationid)) {
    return new Response('Bad Request', { status: 400 });
  }

  const token = await getAccessToken(organizationid);

  return Response.json({ token });
}
