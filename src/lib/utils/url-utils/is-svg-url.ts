/**
 * Determines whether a relative or absolute URL points to an SVG resource.
 *
 * @param src The URL to inspect.
 * @returns True when the URL pathname ends with `.svg`; otherwise, false.
 */
export function isSvgUrl(src: string | undefined) {
  if (src == undefined) {
    return false;
  }

  try {
    return new URL(src, 'https://server').pathname.endsWith('.svg');
  } catch (error) {
    console.error('Invalid image src `' + src + '` - ' + error);
    return false;
  }
}
