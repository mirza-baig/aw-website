import { Result } from '@coveo/headless';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import { extractURLParts, getFieldsToInclude, getResultItemIndex } from 'lib/coveo';
import { EnumField, getEnum } from 'lib/utils/get-enum';
import { convertToDate } from 'lib/utils/string-utils/convert-to-date';

import { ImagePrimaryProps } from '../Media/ImagePrimary';
import { FeaturedCard } from './FeaturedCard';
import { ItemData, MashupStyle } from './Mashup.Types';
import { RegularCard } from './RegularCard';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const getDesktopDimensions = (cardIndex: number, mashupStyle: MashupStyle) => {
  if (cardIndex !== 0) {
    return { width: 389, height: 291 };
  }
  return mashupStyle === 'images-for-all'
    ? { width: 795, height: 448 }
    : { width: 592, height: 395 };
};

const getMobileDimensions = (cardIndex: number, mashupStyle: MashupStyle) => {
  if (cardIndex !== 0) {
    return { width: 155, height: 155 };
  }
  return mashupStyle === 'images-for-all'
    ? { width: 327, height: 184 }
    : { width: 327, height: 218 };
};

const resolveImageUrl = (
  result: Result & { cardIndex: number },
  resultItemToConsider: Sitecore.Components.Search.PageMashupDynamic.ResultItem,
  isDesktopImage: boolean
): string => {
  const featuredVal = resultItemToConsider?.fields?.featuredImageField as EnumField<string>;
  const mobileVal = resultItemToConsider?.fields?.cardImageMobileField as EnumField<string>;
  const cardVal = resultItemToConsider?.fields?.cardImageField as EnumField<string>;

  const featuredImage =
    result.cardIndex === 0
      ? result.raw[featuredVal?.fields?.Value?.value as keyof typeof result.raw]
      : undefined;

  const mobileImage = isDesktopImage
    ? undefined
    : result.raw[mobileVal?.fields?.Value?.value as keyof typeof result.raw];

  const standardImage = result.raw[cardVal?.fields?.Value?.value as keyof typeof result.raw];

  return (featuredImage ?? mobileImage ?? standardImage) as string;
};

const buildImageField = (
  result: Result & { cardIndex: number },
  resultItemToConsider: Sitecore.Components.Search.PageMashupDynamic.ResultItem,
  mashupStyle: MashupStyle,
  placeholderImage: ImageField
): ImagePrimaryProps => {
  const imageSrc = resolveImageUrl(result, resultItemToConsider, true);
  const mobileSrc = resolveImageUrl(result, resultItemToConsider, false);

  const desktopDims = getDesktopDimensions(result.cardIndex, mashupStyle);
  const mobileDims = getMobileDimensions(result.cardIndex, mashupStyle);

  return {
    fields: {
      primaryImageCaption: { value: '' },
      primaryImage: imageSrc
        ? {
            value: {
              src: imageSrc,
              width: desktopDims.width,
              height: desktopDims.height,
            },
          }
        : placeholderImage,
      primaryImageMobile: mobileSrc
        ? {
            value: {
              src: mobileSrc,
              width: mobileDims.width,
              height: mobileDims.height,
            },
          }
        : placeholderImage,
      primaryImageMobileFocusArea: {
        id: 'a181ae3e-750b-4f75-a6bd-7ddcaf8639e7',
        url: 'http://localhost/sitecore/login/sitecore/system/Settings/Feature/EnterpriseWeb/Enums/Image-Focus/Left%27',
        fields: { Value: { value: 'center' } },
        name: '',
      },
    },
  };
};

const buildCTAField = (
  result: Result & { cardIndex: number },
  resultItemToConsider: Sitecore.Components.Search.PageMashupDynamic.ResultItem,
  mashupStyle: MashupStyle
) => {
  const ctaStyleValue =
    mashupStyle !== 'feature-image-only' && result.cardIndex === 0 ? 'primary' : 'link';

  return {
    fields: {
      cta1Link: {
        value: {
          ...extractURLParts(result.clickUri),
          text: resultItemToConsider?.fields?.ctaText.value ?? 'Read More',
          class: '',
          title: '',
          target: '',
          id: '{7FB335D2-8E99-458E-9EF9-562A78CCB821}',
        },
      },
      cta1AriaLabel: { value: '' },
      cta1ModalLinkText: { value: '' },
      cta1PersonalizeEventName: { value: '' },
      cta1Style: {
        id: '49a23327-0397-4cce-a930-e76918d37c42',
        url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/CTA-Styles/Primary%27',
        name: '',
        fields: { Value: { value: ctaStyleValue } },
        templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        templateName: 'Enum',
      },
      cta1Icon: {
        id: '50590edc-7ea7-4436-9a3e-701c87a07db2',
        url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/Icons/Arrow',
        name: 'Arrow',
        displayName: 'Arrow',
        fields: { Value: { value: 'arrow' } },
        templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        templateName: 'Enum',
      },
    },
  };
};

const DynamicMashupTemplate = (
  resultItems: Sitecore.Components.Search.PageMashupDynamic.ResultItem[],
  mashupStyle: MashupStyle,
  placeholderImage: ImageField
) => {
  const fieldsToInclude = getFieldsToInclude(resultItems, 'mashup');

  const template = {
    priority: 1,
    conditions: [],
    fields: ['sc_templateid', ...fieldsToInclude],
    content: (result: Result & { cardIndex: number }) => {
      const resultItemIndex = getResultItemIndex(resultItems, result.raw.sc_templateid as string);
      const resultItemToConsider = resultItems[resultItemIndex];

      const renderingFields: ItemData = {
        eyebrow: result.raw['aw_xmc_articledate']
          ? convertToDate(result.raw['aw_xmc_articledate'])
          : (result.raw[
              getEnum<string>(resultItemToConsider?.fields?.eyebrowField) ?? ''
            ] as string),
        headline: result.raw[
          getEnum<string>(resultItemToConsider?.fields?.headingField) ?? ''
        ] as string,
        description: result.raw[
          getEnum<string>(resultItemToConsider?.fields?.descriptionField) ?? ''
        ] as string,
        image: buildImageField(result, resultItemToConsider, mashupStyle, placeholderImage),
        cta: buildCTAField(result, resultItemToConsider, mashupStyle),
      };

      if (result.cardIndex === 0) {
        return <FeaturedCard resultItem={renderingFields} mashupStyle={mashupStyle} />;
      }

      return (
        <RegularCard
          resultItem={renderingFields}
          mashupStyle={mashupStyle}
          itemIndex={result.cardIndex}
        />
      );
    },
  };

  return template;
};

export default DynamicMashupTemplate;
