/**
 * Compares two optional strings without regard to case.
 *
 * @param left The first string to compare.
 * @param right The second string to compare.
 * @returns Whether the values are equal without regard to case; two undefined values are equal.
 */
export function isEqualIgnoreCase(left: string | undefined, right: string | undefined) {
  if (left === undefined && right === undefined) {
    return true;
  }

  if (left === undefined || right === undefined) {
    return false;
  }

  return left.localeCompare(right, undefined, { sensitivity: 'base' }) === 0;
}
