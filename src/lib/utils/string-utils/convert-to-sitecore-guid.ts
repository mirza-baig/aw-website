export function convertToSitecoreGuid(input: string) {
  // Add curly braces and hyphens to the input string
  const sitecoreGuid = `${input?.slice(0, 8)}-${input?.slice(8, 12)}-${input?.slice(
    12,
    16
  )}-${input?.slice(16, 20)}-${input?.slice(20)}`;
  return `${sitecoreGuid.toLowerCase()}`;
}
