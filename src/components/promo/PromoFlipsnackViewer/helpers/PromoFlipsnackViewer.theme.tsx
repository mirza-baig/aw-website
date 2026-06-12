// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const PromoFlipsnackViewerTheme = (flipsnackLeftAlign: boolean): ThemeFile => {
  return {
    aw: {
      classes: {
        iframe: 'w-[365px] md:min-h-[500px] md:w-full border-0 overflow-hidden',
        iframeContainer: 'col-span-12 ml:col-span-8 mb-s ml:mb-0',
        headline: 'text-theme-text text-s md:text-m font-heavy mb-s',
        body: 'text-theme-body text-body mb-m ml:mb-l',
        copyContainer: `col-span-12 ml:col-span-4 ${flipsnackLeftAlign ? '' : 'ml:order-first'}`,
        buttonGroupClasses: {
          wrapper: 'flex-col md:flex-col items-start md:items-start! mb-0',
          cta1Classes: 'mb-m ml:mb-s last:mb-0',
          cta2Classes: '!ml-0 whitespace-nowrap',
        },
      },
    },
    rba: {},
  };
};
