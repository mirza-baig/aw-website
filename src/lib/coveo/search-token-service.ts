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
import { Debug } from 'lib/constants/debug';

const debug = Debug.api.coveo.accessToken;

const anonymousUserId = {
  name: 'anonymous',
  provider: 'Email Security Provider',
};

const apiKey = config.coveo.apiKey;

/**
 * Requests an anonymous Coveo search token for the given organization.
 *
 * The call to Coveo is guarded by a retry, circuit breaker and timeout policy
 * so that a slow or failing Coveo endpoint does not hang the page load.
 *
 * @param organizationId the Coveo organization id to request a token for
 * @returns the search token issued by Coveo
 */
async function getSearchToken(organizationId: string): Promise<string> {
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

  if (!apiKey) {
    throw new Error('Coveo API key is not configured (AW_COVEO_API_KEY).');
  }

  const response = await retryWithBreaker.execute(() =>
    fetch(`https://${organizationId}.org.coveo.com/rest/search/v2/token`, requestOptions)
  );

  if (!response.ok) {
    const body = await response.text();
    debug('coveo token request failed: %d %s', response.status, body);
    console.error(
      `[coveo:access-token] request for organization "${organizationId}" failed: ${response.status} ${body}`
    );
    throw new Error(
      `Coveo search token request for organization "${organizationId}" failed with status ${response.status}.`
    );
  }

  const data = await response.json();

  if (!data?.token) {
    debug('coveo token response did not contain a token: %o', data);
    console.error(
      `[coveo:access-token] response for organization "${organizationId}" contained no token: ${JSON.stringify(
        data
      )}`
    );
    throw new Error(
      `Coveo search token response for organization "${organizationId}" did not contain a token.`
    );
  }

  return data.token;
}

export const searchTokenService = {
  getSearchToken,
};

export default searchTokenService;
