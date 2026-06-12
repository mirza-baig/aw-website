'use client';
// Lib
import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';
import { ScreenTypes } from 'lib/utils/get-screen-type';

const getTabWidth = (screenType: ScreenTypes, numberOfTabs: number) => {
  switch (screenType) {
    case 'sm':
      if (numberOfTabs > 3) {
        return 'w-[30vw]';
      } else if (numberOfTabs === 3) {
        return 'w-[31vw]';
      } else {
        return 'w-[46vw]';
      }
    case 'md':
      if (numberOfTabs > 3) {
        return 'w-[25vw]';
      } else if (numberOfTabs === 3) {
        return 'w-[31vw]';
      } else {
        return 'w-[46vw]';
      }
    case 'ml':
    case 'lg':
    case 'xl':
      if (numberOfTabs === 4) {
        return 'w-36';
      } else if (numberOfTabs === 3) {
        return 'w-48';
      } else {
        return 'w-[18rem]';
      }
    default:
      return 'w-auto';
  }
};

const getAWTabHeadlineClasses = () => {
  return 'text-base lg:text-sm-s justify-center text-center';
};

const getAWCommonTabClasses = () => {
  return 'justify-center text-center items-center px-xxs py-xs md:px-s border-b-8';
};

const getAWUnselectedTabClasses = () => {
  return 'text-dark-gray border-b-white  ';
};

const getAWSelectedTabClasses = () => {
  return 'border-b-primary ';
};

const getRbATabHeadlineClasses = () => {
  return 'text-body justify-center text-center';
};

const getRbACommonTabClasses = () => {
  return 'justify-center text-center items-center pl-xs pt-xxs';
};

const getRBASelectedTabClasses = () => {
  return 'text-white bg-black';
};

const getRBASelectedHeadlineClasses = () => {
  return 'border-b-primary!';
};

export const HeroProductTabsTheme = (screenType: ScreenTypes, numberOfTabs: number): ThemeFile => {
  return {
    aw: {
      classes: {
        productHeadlineClass:
          'text-sm-s lg:text-s font-heavy font-sans uppercase max-ml:pl-ml max-ml:pb-xxs',
        tabs: {
          headlineClass: classNames(
            'font-heavy font-sans uppercase text-sm-xs ml:text-sm-s text-dark-gray hover:text-black',
            getAWTabHeadlineClasses()
          ),
          selectedHeadlineClass: 'text-black',
          lastHeadLineClass:
            'after:block after:top-0 after:content-[""] after:w-full after:h-full after:absolute',
          commonTabHeadingClass: classNames(
            'react-tabs__tab flex h-full ml:w-fit lg:max-w-[250px]  mr-s last-of-type:mr-0  relative',
            getAWCommonTabClasses(),
            getTabWidth(screenType, numberOfTabs)
          ),
          unselectedTabHeadingClass: classNames(getAWUnselectedTabClasses()),
          selectedTabHeadingClass: classNames(
            'react-tabs__tab--selected',
            getAWSelectedTabClasses()
          ),
        },
      },
    },
    rba: {
      classes: {
        productHeadlineClass: 'text-m font-sans font-medium max-ml:mb-s max-ml:px-xs',
        tabs: {
          headlineClass: classNames(
            'lg:text-xs font-heavy mb-xxxs lg:pb-xxxs uppercase font-serif border-b-2 border-b-white lg:hover:border-b-primary',
            getRbATabHeadlineClasses()
          ),
          selectedHeadlineClass: getRBASelectedHeadlineClasses(),
          commonTabHeadingClass: classNames(
            'react-tabs__tab flex h-full ml:w-fit lg:max-w-[250px]  mr-s last-of-type:mr-0 relative border-b border-b-white pb-xxxs lg:pb-xxs pr-xs lg:pt-xs',
            getRbACommonTabClasses(),
            getTabWidth(screenType, numberOfTabs)
          ),
          unselectedTabHeadingClass: classNames(
            'text-dark-gray lg:after:absolute lg:after:w-2 lg:after:h-2/3 lg:after:right-0 lg:after:bottom-2 lg:after:content-[""] '
          ),
          selectedTabHeadingClass: classNames(
            'react-tabs__tab--selected',
            getRBASelectedTabClasses()
          ),
          nextArrowClass: classNames('right-0!', 'top-1/3!'),
          prevArrowClass: classNames('left-0!', 'top-1/3!'),
        },
      },
    },
  };
};
