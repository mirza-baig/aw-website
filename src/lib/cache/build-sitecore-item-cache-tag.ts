import { normalizeSitecoreItemIdForCacheTag } from './normalize-sitecore-item-id-for-cache-tag';
import { sanitizeSitecoreCacheTagSegment } from './sanitize-sitecore-cache-tag-segment';
/**
 * Stable cache tag strings for Sitecore content (Next.js `cacheTag`, `unstable_cache` tags, `revalidateTag`).
 * Tags are deterministic for the same logical inputs so app code and invalidation webhooks stay aligned.
 */
export const SITECORE_CONTENT_CACHE_TAG_PREFIX = 'sc';

/**
 * Parameters for {@link buildSitecoreItemCacheTag}.
 */
export type BuildSitecoreItemCacheTagParams = {
  itemId: string;
  locale: string;
};

/**
 * Tag for a layout/route item (and anything else keyed the same way). Use for item-level invalidation.
 * @param {BuildSitecoreItemCacheTagParams} params - Item id and locale.
 */
export function buildSitecoreItemCacheTag(params: BuildSitecoreItemCacheTagParams): string {
  const id = normalizeSitecoreItemIdForCacheTag(params.itemId);
  const locale = sanitizeSitecoreCacheTagSegment(params.locale);
  return `${SITECORE_CONTENT_CACHE_TAG_PREFIX}:item:${id}:${locale}`;
}
