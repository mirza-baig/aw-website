export function isNullOrWhitespace(
  string: string | undefined | null
): string is null | undefined | '' {
  if (typeof string === 'undefined' || string === null) {
    return true;
  }
  return string.replace(/\s/g, '').length < 1;
}
