/**
 * Determines whether a value is null, undefined, empty, or whitespace-only.
 *
 * @param string The nullable string value to check.
 * @returns True when the value contains no non-whitespace characters; otherwise, false.
 */
export function isNullOrWhitespace(
  string: string | undefined | null
): string is null | undefined | '' {
  if (string === undefined || string === null) {
    return true;
  }
  return string.replace(/\s/g, '').length < 1;
}
