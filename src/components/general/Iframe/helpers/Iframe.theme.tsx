// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const IframeTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        iframeContainerClass: 'col-span-12 w-full lg:mx-auto md:max-w-(--breakpoint-lg) px-m',
      },
    },
    rba: {
      classes: {
        iframeContainerClass: 'col-span-12 w-full lg:mx-auto md:max-w-(--breakpoint-lg) px-m',
      },
    },
  };
};
