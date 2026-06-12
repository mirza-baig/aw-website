import classNames from 'classnames';
import { cardAlignment } from 'components/listing/XupCardCollectionDynamic/XupCardCollectionDynamic';
import { ThemeName } from 'lib/context/ThemeContext';

export const getGridTemplateTheme = (themeName: ThemeName, alignment: cardAlignment = 'left') => {
  switch (themeName) {
    case 'aw':
      return {
        gridItem: classNames(
          'border-b border-gray flex h-full flex-col',
          alignment === 'center' ? 'text-center' : 'text-left'
        ),
        imageWrapper: 'imageWrapper mb-s',
        eyebrow: 'font-heavy text-xxs leading-none text-dark-gray uppercase mb-xs',
        headline: 'font-heavy font-serif! text-base leading-[22px] mb-xxxs',
        subheadline: 'font-regular font-serif! text-body mb-xs',
        body: 'text-body text-dark-gray font-regular mb-s',
        buttonGroup: {
          wrapper: classNames(
            alignment === 'center' ? 'justify-center' : 'justify-start',
            'mt-auto'
          ),
          cta1Classes: '',
        },
        modalCta: {
          buttonClasses:
            'mb-s mt-auto justify-start hover:decoration-theme-btn-decoration flex w-fit items-center whitespace-nowrap font-sans text-text-link font-heavy text-theme-text hover:underline hover:underline-offset-8 disabled:border-gray disabled:text-gray',
          iconClasses: 'ml-xxs',
        },
        // Note: videoPlayer classes are RBA style specific. If required, update to accomodate AW theme
        videoPlayer: {
          itemWrapper: 'videoItemWrapper relative mb-s cursor-pointer',
          videoWrapper: 'col-span-12 ml:col-span-8 px-xxs ml:px-m mt-xxs ml:mt-0 mb-s ml:mb-s',
          videoDetailsWrapper: 'col-span-12 ml:col-span-4 px-xxs ml:px-m',
          videoDescriptionWrapper: 'flex flex-col h-full justify-center',
          eyebrow: 'text-xxs font-bold mb-xxs uppercase',
          headline: 'text-s font-medium mb-xxs',
          body: 'text-body text-dark-gray mb-xxs',
        },
      };
    case 'rba':
      return {
        gridItem: classNames(
          'border-b border-gray flex h-full flex-col',
          alignment === 'center' ? 'text-center' : 'text-left'
        ),
        imageWrapper: 'imageWrapper mb-s',
        eyebrow: 'font-bold font-serif! text-xxs uppercase mb-xxs',
        headline: 'font-medium text-sm-s mb-xxs',
        subheadline: 'font-bold font-serif! text-body text-dark-gray mb-xxs',
        body: 'text-body text-dark-gray font-regular mb-s',
        buttonGroup: {
          wrapper: classNames(
            alignment === 'center' ? 'justify-center' : 'justify-start',
            'mt-auto'
          ),
          cta1Classes: '',
        },
        videoPlayer: {
          itemWrapper: 'videoItemWrapper relative mb-s cursor-pointer',
          videoWrapper: 'col-span-12 ml:col-span-8 px-xxs ml:px-m mt-xxs ml:mt-0 mb-s ml:mb-s',
          videoDetailsWrapper: 'col-span-12 ml:col-span-4 px-xxs ml:px-m',
          videoDescriptionWrapper: 'flex flex-col h-full justify-center',
          eyebrow: 'text-xxs font-bold mb-xxs uppercase',
          headline: 'text-s font-medium mb-xxs',
          body: 'text-body text-dark-gray mb-xxs',
        },
        modalCta: {
          buttonClasses:
            'mb-s mt-auto justify-start group relative flex w-fit items-center text-text-link font-bold font-serif text-theme-text hover:underline decoration-[3px] hover:theme-btn-decoration hover:underline-offset-8 disabled:text-gray',
          iconClasses:
            'hover:decoration-theme-btn-decoration ml-[10px] text-theme-btn-bg-hover hover:underline hover:underline-offset-8',
        },
      };
  }
};
