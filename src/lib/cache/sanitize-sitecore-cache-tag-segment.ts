/**
 * Sanitizes a single segment for use inside Sitecore cache tags.
 * Colons are reserved as delimiters; slashes and whitespace are normalized for stable keys.
 * @param {string} value - Raw segment (site name, locale, path segment, etc.).
 */
export function sanitizeSitecoreCacheTagSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[/:\s]+/g, '_');
}
