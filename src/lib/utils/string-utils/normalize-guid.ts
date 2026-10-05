/**
 * Normalizes a GUID so it can be compared as a string.
 *
 * @param guid The optional GUID string to normalize.
 * @returns The lowercased alphanumeric GUID, or an empty string when omitted.
 */
export function normalizeGuid(guid?: string): string {
  return guid?.toLowerCase().replace(/[^A-Za-z0-9]+/g, '') ?? '';
}
