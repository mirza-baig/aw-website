/**
 * Normalizes a guid format so they can be compared as strings.
 */
export const normalizeGuid = (guid?: string): string => {
  return guid?.toLowerCase().replace(/[^A-Za-z0-9]+/g, '') ?? '';
};
