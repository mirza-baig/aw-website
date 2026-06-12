import { ImageField } from '@sitecore-content-sdk/nextjs';

import { Sitecore } from '.sitecore/AndersenWindows.model';

// Sets the scaled image to the max length for the short side.
// This is used for thumbnails where the thumbnail can float within the bounding box.
export const getScaledImageShortSideUrl = (
  imageUrl: string,
  maxLength: string,
  width: string | unknown,
  height: string | unknown
): string => {
  let returnValue = '';
  if (!imageUrl) {
    return imageUrl;
  }

  try {
    const newURL = new URL(imageUrl, 'https://fakeserver/');
    const parsedHeight = parseInt(String(height));
    const parsedWidth = parseInt(String(width));

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
};

export const getScaledThumbnailFieldFromPhoto = (
  imageItem: Sitecore.BaseTemplates.BasePhoto
): ImageField => {
  const hasThumbnail = !!imageItem.fields?.thumbnailImage?.value?.src;
  const thumbnailImage = hasThumbnail
    ? (imageItem.fields?.thumbnailImage as ImageField)
    : (imageItem.fields?.fullImage as ImageField);

  // If there is a thumbnail then pass back the thumbnail source directly without modification
  const modifiedThumbnailSrc = !hasThumbnail
    ? getScaledImageShortSideUrl(
        thumbnailImage?.value?.src || '',
        '300',
        thumbnailImage?.value?.width,
        thumbnailImage?.value?.height
      )
    : thumbnailImage?.value?.src;

  const modifiedThumbnail = {
    ...thumbnailImage,
    value: {
      ...thumbnailImage?.value,
      src: modifiedThumbnailSrc,
    },
  };

  return modifiedThumbnail;
};

export const getScaledImageField = (image: ImageField, minDimension: number): ImageField => {
  if (
    !image ||
    !image.value ||
    !image.value.src ||
    !image.value.height ||
    !image.value.width ||
    minDimension < 1
  ) {
    return image;
  }

  try {
    const imageHeight = parseFloat(String(image.value.height));
    const imageWidth = parseFloat(String(image.value.width));
    const smallestDimension = Math.min(imageHeight, imageWidth);
    if (smallestDimension < minDimension) {
      const dimensionMultiplier = Math.ceil(minDimension / smallestDimension);

      const modifiedImage: ImageField = {
        ...image,
        value: {
          ...image?.value,
          height: imageHeight * dimensionMultiplier,
          width: imageWidth * dimensionMultiplier,
        },
      };

      return modifiedImage;
    }
  } catch (ex) {
    console.log('getScaledImageField: Exception in trying to parse image height and width');
    console.log(ex);
    return image;
  }

  return image;
};
