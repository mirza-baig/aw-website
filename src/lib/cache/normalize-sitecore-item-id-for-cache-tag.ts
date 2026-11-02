/**
 * Normalizes a Sitecore item GUID for use in cache tags.
 * Lowercases, strips braces, and canonicalizes 32-character hex GUIDs to hyphenated form
 * so layout-service ids (`{guid}`) and Experience Edge identifiers (`GUID` without hyphens)
 * produce the same `sc:item:` tag.
 * @param {string} itemId - Sitecore item id or GUID string.
 * @internal
 */
export function normalizeSitecoreItemIdForCacheTag(itemId: string): string {
  const cleaned = itemId.trim().toLowerCase().replace(/[{}]/g, '');
  const hex = cleaned.replaceAll('-', '');
  if (/^[0-9a-f]{32}$/.test(hex)) {
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return cleaned;
}
