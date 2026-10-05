/**
 * Formats an unhyphenated GUID as a lowercase Sitecore GUID.
 *
 * @param input A 32-character hexadecimal GUID without separators.
 * @returns The GUID in lowercase `8-4-4-4-12` format.
 */
export function convertToSitecoreGuid(input: string) {
  // Add curly braces and hyphens to the input string
  const sitecoreGuid = `${input?.slice(0, 8)}-${input?.slice(8, 12)}-${input?.slice(
    12,
    16
  )}-${input?.slice(16, 20)}-${input?.slice(20)}`;
  return `${sitecoreGuid.toLowerCase()}`;
}
