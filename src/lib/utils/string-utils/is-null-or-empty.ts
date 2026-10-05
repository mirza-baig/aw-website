/**
 * Determines whether a value is null, undefined, or an empty string.
 *
 * @param value The nullable string value to check.
 * @returns True when the value is null, undefined, or empty; otherwise, false.
 */
export function isNullOrEmpty(value: string | null | undefined): value is null | undefined | '' {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  return false;
}
