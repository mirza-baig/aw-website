/**
 * Removes the Sitecore CDN hostname from the given image URL if it matches the expected pattern.
 *
 * If the URL starts with "https://edge.sitecorecloud.io/andersencorporation-<env>/", it replaces
 * that prefix with "/-/" to create a relative path. Otherwise, the original URL is returned unchanged.
 *
 * @param url - The image URL to process.
 * @returns The URL with the CDN hostname removed, or the original URL if no match is found.
 *
 * @example
 * // Returns "/-/media/image.jpg"
 * removeCdnHostName("https://edge.sitecorecloud.io/andersencorporation-prod/-/media/image.jpg");
 *
 * // Returns the original URL
 * removeCdnHostName("https://othercdn.com/media/image.jpg");
 */

export function removeCdnHostName(url: string | undefined): string {
  if (url == undefined) {
    return '';
  }
  if (url.startsWith('https://edge.sitecorecloud.io')) {
    url = url.replace(/^https:\/\/edge\.sitecorecloud\.io\/[^/]+\//, '/-/');
  }
  return String(url);
}
