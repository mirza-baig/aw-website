import { Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getImagePosition } from 'lib/utils/get-image-position';

const getPosition = (pos: Item): string => {
  const imagePosition = getImagePosition('right', pos);
  return imagePosition;
};

const getImageDivCss = (imgPos: string, imgSpan: number): string => {
  const txtSpan = 12 - imgSpan;
  const startCol = imgPos === 'right' ? txtSpan + 1 : 1;
  const imageOrder = imgPos === 'right' ? 'order-first md:order-last' : 'order-first';
  const imageCss = `${imageOrder} col-span-6 cols-start-1 md:col-start-${startCol} md:col-span-${imgSpan}`;
  return imageCss;
};

const getTxtDivCss = (imgPos: string, imgSpan: number): string => {
  const txtSpan = 12 - imgSpan;
  const startSpan = imgPos === 'right' ? 1 : imgSpan + 1;
  const txtOrder = imgPos === 'right' ? 'order-last md:order-first' : 'order-last';
  const txtCss = `${txtOrder} flex items-center pt-2 col-span-6 my-auto md:col-start-${startSpan} md:col-span-${txtSpan}`;
  return txtCss;
};

const getImageInfo = (imageRatio: Item): { span: number; aspect: string } => {
  const ratio = getEnum<string>(imageRatio) ?? '4:3';

  switch (ratio) {
    case '4:3':
      return { span: 6, aspect: 'picture' }; // changed from 7 to 6 to accommodate for extra left out space
    case '16:9':
      return { span: 8, aspect: 'video' };
    case '1:1':
      return { span: 6, aspect: 'square' };
    case '3:2':
      return { span: 6, aspect: 'snapshot' };
    case '2:3':
      return { span: 6, aspect: 'portrait' };
    default:
      return { span: 6, aspect: 'square' };
  }
};

export const PromoGenericTheme = (
  imagePosition: Item,
  imageItem: Item,
  legalFont: boolean
): ThemeFile => {
  const imgPos = getPosition(imagePosition);
  const imgInfo = getImageInfo(imageItem);

  return {
    aw: {
      classes: {
        wrapperClass:
          'grid grid-cols-2 gap-s px-m py-4 md:grid-cols-12 md:gap-s promo-generic-wrapper',
        txtDivClass: classNames(
          getTxtDivCss(imgPos, imgInfo.span),
          `justify-center items-center h-full` // changed from `h-full` to `justify-center items-center h-full`
        ),
        imageDivClass: classNames(
          getImageDivCss(imgPos, imgInfo.span),
          `justify-center items-center h-full` // changed from `h-full` to `justify-center items-center h-full`
        ),
        headlineClass:
          'text-[24px] leading-[30px] lg:text-[36px] lg:leading-[45px] font-heavy mb-4',
        eyebrowClass: 'text-sm-xxs lg:text-base text-dark-gray uppercase font-extralight mb-4', // changed from 'text-xxs' to 'text-base which is equal to '16px'
        bodyClass: 'text-[14px] leading-[22px] text-dark-gray mb-5',
        bottomHeadingClass: 'font-sans! text-sm-xxs lg:text-xxs font-bold mb-2 uppercase',
        bottomDescriptionClass: classNames(
          legalFont ? 'text-legal' : 'text-body',
          'text-dark-gray mb-4'
        ),
        imageClasses: `aspect-${imgInfo.aspect}`,
        captionClass: 'mt-xxs italic text-left mb-s',
        priceLevelWrapper: 'py-xxxs',
        priceTextClasses: 'text-gray font-sans text-xxs font-medium',
        priceLevelClasses: 'text-black font-heavy',
      },
    },
    rba: {
      classes: {
        wrapperClass:
          'grid grid-cols-2 gap-s px-m pt-4 md:grid-cols-12 md:gap-s promo-generic-wrapper',
        txtDivClass: classNames(
          getTxtDivCss(imgPos, imgInfo.span),
          `justify-center items-center h-full border-t border-gray`
        ),
        imageDivClass: classNames(
          getImageDivCss(imgPos, imgInfo.span),
          `justify-center items-center h-full`
        ),
        headlineClass:
          'text-[24px] leading-[30px] lg:text-[36px] lg:leading-[45px] font-extra-light mb-4',
        eyebrowClass: 'text-sm-xxs lg:text-base text-black uppercase font-extralight mb-4',
        bodyClass: 'text-[14px] leading-[22px] text-dark-gray mb-5',
        bottomHeadingClass: 'text-sm-xxs lg:text-xxs font-heavy my-2',
        bottomDescriptionClass: classNames(
          legalFont ? 'text-legal' : 'text-xxs',
          'mb-4 text-dark-gray'
        ),
        imageClasses: `aspect-${imgInfo.aspect}`,
        captionClass: 'mt-xxs md:mt-xxxs italic border-primary border-l-2 pl-xxs text-left mb-s',
        priceLevelWrapper: 'py-xxxs',
        priceTextClasses: 'text-gray font-sans text-xxs font-medium',
        priceLevelClasses: 'text-black font-heavy',
      },
    },
  };
};
