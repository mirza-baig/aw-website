import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

export type ComponentSpacingValues = '8' | '4';

export const HeroWithNavigationTheme = (spacing: ComponentSpacingValues): ThemeFile => {
  return {
    aw: {
      classes: {
        headlineContainer: classNames(
          `mt-${spacing}`,
          'grid grid-cols-2 mb-s px-m w-full md:max-w-(--breakpoint-lg) ml:grid-cols-12 ml:mb-m ml:px-12 lg:mx-xl'
        ),
        headline: 'font-sans text-s ml:text-m font-heavy ml:px-3 lg:px-0',
        heroContainer: classNames(`mb-${spacing}`, 'w-full'),
        linkContainer:
          'relative bottom-0 flex flex-col bg-white px-6 pt-xs align-middle ml:bottom-10 ml:mx-m ml:flex-row ml:items-center ml:rounded-full ml:pt-0 ml:shadow-md lg:mx-xl',
        subheadlineStyle: 'align-bottom text-sm-s ml:py-xxs ml:pl-m ml:pr-xxs ml:text-s font-heavy',
        linkStyle:
          'grow border-b border-gray py-xs text-left ml:my-3 ml:mx-2 ml:border-l ml:border-b-0 ml:first:border-l-0 ml:py-0 ml:text-center ml:align-middle',
        linkWrapperStyle:
          'font-sans relative flex w-full grow items-center text-s font-heavy hover:underline hover:decoration-black hover:underline-offset-8 ml:justify-center ml:px-2 ml:text-m',
        svgWrapper: 'flex items-center',
        svgIconStyle:
          'absolute right-0 ml-s flex h-9 w-9 items-center justify-center rounded-full border-4 border-primary hover:bg-primary hover:text-white ml:static',
      },
    },
    rba: {},
  };
};
