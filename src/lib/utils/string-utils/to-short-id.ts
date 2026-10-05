/**
 * Normalizes a string GUID into the uppercase alphanumeric format expected by Coveo.
 *
 * @param guid The optional GUID or identifier to normalize.
 * @returns The normalized uppercase identifier, or an empty string when undefined.
 */
export function toShortId(guid?: string): string {
  return guid?.toUpperCase().replace(/[^A-Za-z0-9]+/g, '') ?? '';
}
