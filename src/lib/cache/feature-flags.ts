import { cache } from 'react';

/**
 * Represents the cached feature flags params, including the precomputed values.
 * @public
 */
export type CachedFeatureFlagsParams = {
  /**
   * The precomputed values for the feature flags.
   */
  precomputed: string;
};

/**
 * Internal cache implementation for storing page params.
 *
 * This cache is used to store the precomputed feature flags for the current page.
 *
 * It helps avoid the usage of functions that disable SSG such as `headers()`.
 * @internal
 */
const cacheImpl = cache(() => ({ precomputed: '' }));

/**
 * Gets the cached precomputed feature flags for the current page.
 * @returns An object containing the precomputed feature flags for the current page.
 * @public
 */
export const getCachedFeatureFlagsParams = () => cacheImpl();

/**
 * Sets the cached precomputed feature flags for the current page.
 * @param {CachedFeatureFlagsParams} pageParams An object containing the precomputed feature flags to be set for the current page cache.
 * @public
 */
export function setCachedFeatureFlagsParams(pageParams: CachedFeatureFlagsParams) {
  cacheImpl().precomputed = pageParams.precomputed;
}
