// Lib
import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';
import { ScreenTypes } from 'lib/utils/get-screen-type';

const getSmallScreenTabWidth = (tabLabelView: string, numberOfTabs: number) => {
  if (numberOfTabs <= 2 && tabLabelView !== 'long') {
    return 'w-full';
  }
  return tabLabelView === 'long' ? 'w-[90vw]' : 'w-[45vw]';
};

const getMediumScreenTabWidth = (numberOfTabs: number) => {
  if (numberOfTabs > 3) {
    return 'w-[23vw]';
  }
  return 'w-full';
};

const getExtraLargeScreenTabWidth = (numberOfTabs: number) => {
  if (numberOfTabs > 5) {
    return 'w-[12.4rem]';
  } else if (numberOfTabs === 5) {
    return 'w-[14.4rem]';
  } else if (numberOfTabs === 4) {
    return 'w-[18rem]';
  }
  return 'w-full';
};

const getTabWidth = (screenType: ScreenTypes, numberOfTabs: number, tabLabelView: string) => {
  switch (screenType) {
    case 'sm':
      return getSmallScreenTabWidth(tabLabelView, numberOfTabs);
    case 'md':
      return getMediumScreenTabWidth(numberOfTabs);
    case 'mmd':
      return numberOfTabs > 3 ? 'w-[19vw]' : 'w-full';
    case 'mml':
      return numberOfTabs > 3 ? 'w-[16vw]' : 'w-full';
    case 'ml':
      return numberOfTabs > 3 ? undefined : 'w-full';
    case 'lg':
      return numberOfTabs > 3 ? 'w-[15.6vw]' : 'w-full';
    case 'xl':
      return getExtraLargeScreenTabWidth(numberOfTabs);
    default:
      return numberOfTabs <= 3 ? 'w-full' : 'w-auto';
  }
};

const isLongLabelView = (screenType: ScreenTypes, tabLabelView: string) => {
  return tabLabelView === 'long' && screenType === 'sm';
};

const getAWTabHeadlineClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'text-sm-s';
  } else {
    return 'text-base lg:text-xs justify-center text-center';
  }
};

const getAWCommonTabClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'mr-s';
  } else {
    return 'h-full justify-center text-center items-center pb-s pr-s pl-s pt-m border-t-8';
  }
};

const getAWUnselectedTabClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return '';
  } else {
    return 'text-gray border-t-light-gray bg-light-gray hover:border-t-primary hover:bg-white hover:text-black';
  }
};

const getAWSelectedTabClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'border-b-4 border-b-primary';
  } else {
    return 'border-t-primary border-r-gray';
  }
};

const getAWArrowClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'top-[20%]!';
  } else {
    return 'top-[45%]!';
  }
};

const getRbATabHeadlineClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'text-s font-medium';
  } else {
    return 'text-body justify-center text-center';
  }
};

const getRbACommonTabClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'mr-s';
  } else {
    return 'h-full justify-center text-center items-center pl-xs pt-xxs';
  }
};

const getRBASelectedTabClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'border-b-4! border-b-primary!';
  } else {
    return 'text-white bg-black';
  }
};

const getRBASelectedHeadlineClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return '';
  } else {
    return 'border-b-primary!';
  }
};

const getRbAArrowClasses = (screenType: ScreenTypes, tabLabelView: string) => {
  if (isLongLabelView(screenType, tabLabelView)) {
    return 'top-1/4!';
  } else {
    return 'top-1/2!';
  }
};

export const TabsGeneralContentTheme = (
  screenType: ScreenTypes,
  numberOfTabs: number,
  tabLabelView: string
): ThemeFile => {
  return {
    aw: {
      classes: {
        componentClass: 'theme-white col-span-12 my-8',
        headlineClass:
          'text-s lg:text-m font-heavy pb-s px-m md:max-w-(--breakpoint-lg) lg:mx-auto',
        tabs: {
          tabListClass: 'react-tabs__tab-list px-m md:max-w-(--breakpoint-lg) lg:mx-auto',
          headlineClass: classNames(
            'font-heavy mb-xxs',
            getAWTabHeadlineClasses(screenType, tabLabelView)
          ),
          selectedHeadlineClass: '',
          outerTabHeadingClass: classNames(
            isLongLabelView(screenType, tabLabelView) ? '' : 'border-r-2 border-r-gray h-full'
          ),
          commonTabHeadingClass: classNames(
            'react-tabs__tab flex',
            getAWCommonTabClasses(screenType, tabLabelView),
            getTabWidth(screenType, numberOfTabs, tabLabelView)
          ),
          unselectedTabHeadingClass: classNames(
            getAWUnselectedTabClasses(screenType, tabLabelView)
          ),
          selectedTabHeadingClass: classNames(
            'react-tabs__tab--selected',
            getAWSelectedTabClasses(screenType, tabLabelView)
          ),
          lastTab: 'border-r-0',
        },
        numberedPaginationClass: 'text-right font-sm-xs font-medium font-sans pt-xxs',
        nextArrowClass: classNames('-right-4!', getAWArrowClasses(screenType, tabLabelView)),
        prevArrowClass: classNames('-left-4!', getAWArrowClasses(screenType, tabLabelView)),
      },
    },
    rba: {
      classes: {
        componentClass: 'theme-white col-span-12 my-8',
        headlineClass:
          'text-m lg:text-l font-extra-light pb-s px-m md:max-w-(--breakpoint-lg) lg:mx-auto',
        tabs: {
          tabListClass: 'react-tabs__tab-list px-m md:max-w-(--breakpoint-lg) lg:mx-auto',
          headlineClass: classNames(
            'lg:text-xs font-bold mb-xxxs lg:pb-xxxs font-serif! border-b-2 border-b-white lg:hover:border-b-primary',
            getRbATabHeadlineClasses(screenType, tabLabelView)
          ),
          selectedHeadlineClass: getRBASelectedHeadlineClasses(screenType, tabLabelView),
          outerTabHeadingClass: 'h-full',
          commonTabHeadingClass: classNames(
            'react-tabs__tab flex relative border-b-gray border-b pb-xxxs lg:pb-xxs pr-xs lg:pt-xs',
            getRbACommonTabClasses(screenType, tabLabelView),
            getTabWidth(screenType, numberOfTabs, tabLabelView)
          ),
          unselectedTabHeadingClass: classNames(
            'text-light-black lg:after:absolute lg:after:w-2 lg:after:h-2/3 lg:after:right-0 lg:after:bottom-2 lg:after:content-[""] lg:after:border-r-gray lg:after:border-r'
          ),
          selectedTabHeadingClass: classNames(
            'react-tabs__tab--selected',
            getRBASelectedTabClasses(screenType, tabLabelView)
          ),
          lastTab: 'lg:after:border-r-0',
        },
        numberedPaginationClass: 'text-right font-xs font-semi-bold pt-xxs',
        nextArrowClass: classNames('-right-4!', getRbAArrowClasses(screenType, tabLabelView)),
        prevArrowClass: classNames('-left-4!', getRbAArrowClasses(screenType, tabLabelView)),
      },
    },
  };
};
