/**
 * Converts a 32-character hexadecimal string to GUID format.
 *
 * @param guidString The hexadecimal string or GUID to format.
 * @returns The string with GUID separators inserted when applicable.
 */
export function convertHexToGUID(guidString: string) {
  return guidString.replace(
    /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/,
    '$1-$2-$3-$4-$5'
  );
}
