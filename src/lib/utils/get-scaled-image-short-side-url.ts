/**
 * Scales an image URL so its shorter dimension matches the requested length.
 * Removes conflicting image-sizing parameters and converts media URLs to JSS media paths.
 *
 * @param imageUrl The image URL to scale.
 * @param maxLength The target length for the image's shorter dimension.
 * @param width The source image width.
 * @param height The source image height.
 * @returns The scaled image URL, or the original URL when it cannot be parsed.
 */
export function getScaledImageShortSideUrl(
  imageUrl: string,
  maxLength: string,
  width: string | unknown,
  height: string | unknown
): string {
  let returnValue = '';
  if (!imageUrl) {
    return imageUrl;
  }

  try {
    const newURL = new URL(imageUrl, 'https://fakeserver/');
    const parsedHeight = Number.parseInt(String(height));
    const parsedWidth = Number.parseInt(String(width));

    if (parsedHeight > parsedWidth) {
      newURL.searchParams.set('mw', maxLength);
      newURL.searchParams.delete('mh');
    } else {
      newURL.searchParams.delete('mw');
      newURL.searchParams.set('mh', maxLength);
    }

    // Remove height, width, iar, and hash parameters.  These are tied together
    // and prevents dynamic image scaling for thumbnails.
    newURL.searchParams.delete('h');
    newURL.searchParams.delete('w');
    newURL.searchParams.delete('iar');
    newURL.searchParams.delete('hash');

    returnValue = newURL.toString();
  } catch (ex) {
    console.log(imageUrl);
    console.log(ex);
    return imageUrl;
  }

  returnValue = (returnValue ?? '')
    .replace('/-/media/', '/-/jssmedia/')
    .replace('https://fakeserver/', '/');

  return returnValue;
}
