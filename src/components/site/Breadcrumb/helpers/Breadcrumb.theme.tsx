// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const BreadcrumbTheme = (hasRaqBanner?: boolean): ThemeFile => {
  return {
    aw: {
      classes: {
        breadcrumbContainer: 'text-small text-dark-gray max-ml:relative ',
        breadcrumbMargin: `max-ml:relative max-ml:mb-5 ${
          hasRaqBanner ? 'max-ml:min-h-[110px]' : 'max-ml:min-h-[55px]'
        }`,
      },
    },
    rba: {},
  };
};
