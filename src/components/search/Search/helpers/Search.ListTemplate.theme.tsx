import { ThemeName } from 'lib/context/ThemeContext';

export const getListTemplateTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        resultItem: 'border-b border-gray py-xxs md:pl-s',
        featuredResultItem:
          'border-0 pr-xs -mx-xs pl-xs ring-2 md:mx-0 md:pl-s md:ring-inset ring-primary cursor-pointer mb-xxs group',
        resultEyebrow:
          'text-dark-gray font-sans text-small md:text-xxs font-heavy uppercase mb-xxxs',
        resultHeading:
          'text-sm-xxs md:text-text-link text-darkprimary hover:font-heavy hover:underline md:overflow-visible',
        resultDescription: 'text-small md:text-body mr-xxs md:mr-s',
        // Note: videoPlayer classes are same as RBA style. If required, update to accomodate AW
        videoPlayer: {
          itemWrapper: 'videoItemWrapper relative cursor-pointer',
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
        resultItem: 'border-b border-gray py-s md:pb-m md:pl-s',
        featuredResultItem:
          'border-0 pr-xxs -mx-xs pl-xs ring-[3px] md:mx-0 mb-xxs md:pl-s md:ring-inset ring-primary cursor-pointer mb-xxs !py-xxs',
        resultEyebrow: 'text-secondary text-xxs font-bold uppercase mb-xxs',
        resultHeading:
          'text-base text-darkprimary font-heavy hover:underline underline-offset-4 mb-xs md:mb-0 md:pb-xs',
        resultDescription: 'text-body text-dark-gray mr-xxs md:mr-s',
        videoPlayer: {
          itemWrapper: 'videoItemWrapper relative cursor-pointer',
          videoWrapper: 'col-span-12 ml:col-span-8 px-xxs ml:px-m mt-xxs ml:mt-0 mb-s ml:mb-s',
          videoDetailsWrapper: 'col-span-12 ml:col-span-4 px-xxs ml:px-m',
          videoDescriptionWrapper: 'flex flex-col h-full justify-center',
          eyebrow: 'text-xxs font-bold mb-xxs uppercase',
          headline: 'text-s font-medium mb-xxs',
          body: 'text-body text-dark-gray mb-xxs',
        },
      };
  }
};
