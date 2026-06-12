import { Result } from '@coveo/headless';
import PhotoItemWithDetail, {
  PhotoItemWithDetailProps,
} from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail';
import { getPhotoItemProps } from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail.Utils';
import { extractURLParts } from 'lib/coveo/extract-url-parts';
import { getFieldsToInclude, getResultItemIndex } from 'lib/coveo/utils';
import { getEnum } from 'lib/utils/get-enum';

import GenericResultCardMarkup from './XupCardMarkups/GenericResultCardMarkup.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type XupDynamicResultItem = Sitecore.Components.Listing.XupCardCollectionDynamic.ResultItem;

export type DynamicXupCardStyle =
  | 'photo-gallery'
  | 'result-with-image'
  | 'result-without-image'
  | 'awards';

const XupCardTemplate = (
  resultItems: XupDynamicResultItem[],
  templateClasses: { [property: string]: string },
  dynamicXupCardStyle: DynamicXupCardStyle
) => {
  const fieldsToInclude = getFieldsToInclude(resultItems, 'grid');

  const getImageAttributes = (imageField: string | undefined) => {
    if (imageField) {
      fieldsToInclude.push(`${imageField}_width`);
      fieldsToInclude.push(`${imageField}_height`);
      fieldsToInclude.push(`${imageField}_alt`);
    }
  };

  // Get image attributes
  resultItems?.forEach((item) => {
    if (item.fields?.['thumbnailImageField' as keyof unknown]) {
      getImageAttributes(getEnum<string>(item.fields?.['thumbnailImageField' as keyof unknown]));
    }
    if (item.fields?.['imageField' as keyof unknown]) {
      getImageAttributes(getEnum<string>(item.fields?.['imageField' as keyof unknown]));
    }
  });

  const getRenderingFields = (
    dynamicXupCardStyle: DynamicXupCardStyle,
    _result: Result,
    _resultItemToConsider: XupDynamicResultItem
  ) => {
    const getImageFields = (useFullImageIfNoThumbnail?: boolean) => {
      const thumbnailFocusArea =
        _result.raw[
          getEnum<string>(
            _resultItemToConsider?.fields?.['thumbnailFocusAreaField' as keyof unknown]
          ) ?? ''
        ];

      const thumbnail =
        _result.raw[
          getEnum<string>(
            _resultItemToConsider?.fields?.['thumbnailImageField' as keyof unknown]
          ) ?? ''
        ];

      const useImageFieldForThumbnail = useFullImageIfNoThumbnail && !thumbnail;

      const imageFieldToUseForThumbnail = useImageFieldForThumbnail
        ? 'imageField'
        : 'thumbnailImageField';

      return {
        thumbnailImage:
          _result.raw[
            getEnum<string>(
              _resultItemToConsider?.fields?.[imageFieldToUseForThumbnail as keyof unknown]
            ) ?? ''
          ],
        thumbnailImageWidth:
          _result.raw[
            `${
              getEnum<string>(
                _resultItemToConsider?.fields?.[imageFieldToUseForThumbnail as keyof unknown]
              ) ?? ''
            }_width`
          ],
        thumbnailImageHeight:
          _result.raw[
            `${
              getEnum<string>(
                _resultItemToConsider?.fields?.[imageFieldToUseForThumbnail as keyof unknown]
              ) ?? ''
            }_height`
          ],
        thumbnailImageAlt:
          _result.raw[
            `${
              getEnum<string>(
                _resultItemToConsider?.fields?.[imageFieldToUseForThumbnail as keyof unknown]
              ) ?? ''
            }_alt`
          ],
        thumbnailFocusArea: thumbnailFocusArea,
        useThumbnailFocusArea: useImageFieldForThumbnail,
      };
    };

    const getResultFields = () => ({
      headline: {
        fields: {
          headlineText: {
            value:
              _result.raw[
                getEnum<string>(_resultItemToConsider?.fields?.['headingField' as keyof unknown]) ??
                  ''
              ],
          },
        },
      },
      subheadline: {
        fields: {
          subheadlineText: {
            value:
              _result.raw[
                getEnum<string>(
                  _resultItemToConsider?.fields?.['subHeadingField' as keyof unknown]
                ) ?? ''
              ],
          },
        },
      },
      description: {
        fields: {
          body: {
            value:
              _result.raw[
                getEnum<string>(
                  _resultItemToConsider?.fields?.['descriptionField' as keyof unknown]
                ) ?? ''
              ],
          },
        },
      },
      eyebrow: {
        fields: {
          eyebrowText: {
            value:
              _result.raw[
                getEnum<string>(_resultItemToConsider?.fields?.['eyebrowField' as keyof unknown]) ??
                  ''
              ],
          },
        },
      },
      cta: {
        fields: {
          cta1Link: {
            value: {
              ...extractURLParts(_result.clickUri),
              title: _resultItemToConsider?.fields?.ctaText.value,
              text: _resultItemToConsider?.fields?.ctaText.value,
            },
          },
          cta1Icon: {
            fields: {
              Value: {
                value: 'arrow',
              },
            },
          },
          cta1Style: {
            fields: {
              Value: {
                value: 'link',
              },
            },
          },
        },
      },
    });

    switch (dynamicXupCardStyle) {
      case 'photo-gallery':
        return getImageFields(true);
      case 'result-with-image':
        return { ...getImageFields(), ...getResultFields() };
      case 'result-without-image':
        return getResultFields();
      default:
        return getImageFields();
    }
  };

  const template = {
    priority: 1,
    conditions: [],
    fields: ['sc_templateid', ...fieldsToInclude],
    content: (result: Result) => {
      const resultItemIndex = getResultItemIndex(resultItems, result.raw.sc_templateid as string);

      const resultItemToConsider = resultItems[resultItemIndex];

      // we can ignore below type error, as we are generating required renderingFields props based on Display card style
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderingFields: any = getRenderingFields(
        dynamicXupCardStyle,
        result,
        resultItemToConsider
      );

      return (
        <GenericResultCardMarkup
          dynamicXupCardStyle={dynamicXupCardStyle}
          renderingFields={renderingFields}
          templateClasses={templateClasses}
        />
      );
    },
  };

  if (dynamicXupCardStyle === 'photo-gallery') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (template.content as any).modalTemplate = (result: Result) => {
      const photoObject = getPhotoItemProps(result, true, resultItems) as PhotoItemWithDetailProps;
      return <PhotoItemWithDetail key={result.uniqueId} {...photoObject} />;
    };
  }

  return template;
};

export default XupCardTemplate;
