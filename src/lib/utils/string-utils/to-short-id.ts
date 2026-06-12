/**
 * Normalizes a string guid into the format expected by Coveo.
 */
export const toShortId = (guid?: string): string => {
  return guid?.toUpperCase().replace(/[^A-Za-z0-9]+/g, '') ?? '';
};
