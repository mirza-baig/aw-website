// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

export const AccordionTheme: ThemeFile = {
  aw: {
    classes: {
      accordionWrapper: 'md:max-w-(--breakpoint-lg) md:mx-auto',
      headline: 'px-m text-sm-m md:text-m font-heavy mb-s text-left',

      bodyCopy: 'mb-s w-full text-theme-body px-m text-left',

      sectionTitleWrapper:
        'sectionTitleWrapper border-t py-m border-gray w-full px-m flex items-center justify-between hover:underline hover:underline-offset-4 group',

      sectiontitle: 'text-sm-s md:text-s font-heavy text-left max-w-[80%]',

      sectionIcon:
        'border-2 border-primary rounded-full h-ml w-ml flex items-center justify-center group-hover:bg-primary group-hover:text-white',

      accordionSection:
        '[&:last-child_.accordion-content]:after:w-full [&:last-child_.accordion-content]:after:border-t [&:last-child_.accordion-content]:after:border-gray [&:last-child_.accordion-content]:after:block',
    },
  },
  rba: {
    classes: {},
  },
};
