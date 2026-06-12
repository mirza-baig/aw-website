// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const TabsFeaturedPromoTheme: ThemeFile = {
  aw: {
    classes: {
      headline: 'text-s ml:text-m font-bold',
      tabsClasses: {
        tabWrapper: 'flex flex-col ml:flex-row min-h-[542px]',
        tabHeadlineWrapper: 'flex items-center border-t pt-s mb-xxs uppercase',
        tabHeadlineIcon: 'mr-xxxs',
        tabHeadline: 'text-xs font-heavy',
        tabTitlesContainer: 'relative flex order-3 ml:order-none pr-s pl-s',
        leftArrowIcon:
          'absolute right-full top-1/2 -translate-y-1/2 cursor-pointer bg-white before:absolute before:left-full before:inline-block before:h-[30px] before:w-[30px] before:bg-linear-to-r before:from-white before:content-[""] ml:hidden',
        rightArrowIcon:
          'absolute left-full top-1/2 -translate-y-1/2 cursor-pointer bg-white before:absolute before:right-full before:inline-block before:h-[30px] before:w-[30px] before:bg-linear-to-l before:from-white before:content-[""] ml:hidden',
        tabTitlesWrapper: 'order-3 flex ml:inline-block overflow-auto snap-x ml:snap-none',
        tabTitlesList: 'w-full ml:w-1/4 ml:pr-s flex flex-col ml:inline-block',
        tabTitle:
          'text-body ml:text-xs text-dark-gray cursor-pointer mx-xxs ml:mx-0 py-xxxs ml:px-xxs ml:border-l-2 my-s snap-start',
        activeTabTitle: 'text-secondary! font-heavy border-b-2 ml:border-b-0 border-primary',
        tabPanel: 'w-full ml:w-3/4',
        toggleContainer: 'order-2 max-w-[70%]',
      },
      promoClasses: {
        promoContainer:
          'relative bg-theme-bg h-full flex flex-col ml:flex-row items-center justify-between p-m ml:px-xl ml:py-l before:content-[""] before:absolute before:w-screen before:h-full before:bg-theme-bg before:top-0 before:-z-10 ml:before:hidden',
        promoImageWrapper: 'w-full ml:w-3/5 mb-xxs ml:mb-0',
        promoContentWrapper: 'w-full ml:w-2/6',
        promoHeadline: 'text-s ml:text-m text-theme-text font-bold mb-s',
        promoSubheadline: 'text-sm-s ml:text-s text-theme-text font-medium mb-s',
        promoBody: 'text-body text-dark-gray mb-m',
        promoCTA: {
          wrapper: 'flex-col ml:items-center',
          cta1Classes: 'mb-0 ml:mr-2',
        },
      },
    },
  },
  rba: {
    classes: {
      headline: 'text-m ml:text-l font-medium',
      tabsClasses: {
        tabWrapper: 'flex flex-col ml:flex-row ml:min-h-[503px]',
        tabHeadlineWrapper: 'flex items-center pt-s mb-xs ml:mb-xxxs uppercase',
        tabHeadlineIcon: 'mr-xxxs',
        tabHeadline: 'font-serif! text-xxs font-bold',
        tabTitlesContainer: 'relative flex order-3 ml:order-none pr-s pl-s',
        leftArrowIcon:
          'absolute right-full top-[40%] -translate-y-1/2 cursor-pointer bg-white before:absolute before:left-full before:inline-block before:h-[30px] before:w-[30px] before:bg-linear-to-r before:from-white before:content-[""] ml:hidden',
        rightArrowIcon:
          'absolute left-full top-[40%] -translate-y-1/2 cursor-pointer bg-white before:absolute before:right-full before:inline-block before:h-[30px] before:w-[30px] before:bg-linear-to-l before:from-white before:content-[""] ml:hidden',
        tabTitlesWrapper:
          'order-3 mb-xxs ml:order-none flex ml:inline-block overflow-auto snap-x ml:snap-none',
        tabTitlesList: 'w-full ml:w-1/5 ml:pr-s flex flex-col ml:justify-center',
        tabTitle: 'text-body text-dark-gray cursor-pointer mr-m ml:mr-0 my-xxxs snap-start',
        activeTabTitle:
          'text-secondary! font-heavy ml:pl-[26px] border-b-3 ml:border-b-0 border-primary relative before:hidden ml:before:inline-block before:absolute before:content-[""] before:w-[20px] before:h-[3px] before:bg-primary before:top-[50%] before:left-0',
        tabPanel: 'w-full',
        toggleContainer: 'order-2 mb-s',
      },
      promoClasses: {
        promoContainer:
          'relative bg-theme-bg h-full w-full flex flex-col ml:flex-row items-center justify-between p-[32px] before:content-[""] before:absolute before:w-screen before:h-full before:bg-theme-bg before:top-0 before:-z-10 ml:before:hidden',
        promoImageWrapper: 'relative ml:static w-full ml:w-1/2 ml:mr-[32px] mb-xxs',
        promoContentWrapper: 'w-full ml:w-1/2',
        promoEyebrow: 'text-xxs text-theme-text font-bold mb-xxxs',
        promoHeadline: 'text-m text-theme-text font-medium mb-xxxs',
        promoSubheadline: 'text-m text-theme-text font-extra-light mb-xxxs',
        promoBody: 'text-body text-theme-body mb-s',
        promoCTA: {
          wrapper: 'flex-col ml:items-center',
          cta1Classes: 'mr-2',
        },
        promoImageCaptionWrapper: 'ml:absolute top-full left-0 my-xxs',
        promoImageCaption: 'relative text-xxs ml:text-body [&_a]:text-primary!',
      },
    },
  },
};
