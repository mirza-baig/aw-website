import { normalizeGuid } from './normalize-guid';

/**
 * Compares two guids regardless of the format
 * @param guid1 The first guid
 * @param guid2 The second guid
 * @returns Whether the two are equal
 */
export const guidEquals = (guid1: string | undefined, guid2: string | undefined) => {
  return normalizeGuid(guid1) === normalizeGuid(guid2);
};
