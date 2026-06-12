import { ThemeFile } from 'lib/context/ThemeContext';

export const AWProductConfiguratorTheme = (): ThemeFile => {
  return {
    aw: {
      classes: {
        activeButtonStyle:
          'cursor-pointer text-regular inline-block rounded-full border-2 border-primary px-4 py-[8px] text-small font-heavy uppercase leading-tight text-secondary md:px-l',
        inactiveButtonStyle:
          'cursor-pointer inline-block rounded-full px-4 py-[8px] text-small font-heavy uppercase leading-tight text-dark-gray md:px-l',
        bodyContainer: 'col-span-12 mb-8 w-full',
        headerContainer: 'flex items-center justify-between py-4 px-5 ml:px-12 ml:pt-10 ml:pb-8',
        sectionContainer: 'flex flex-col  px-5 ml:grid ml:grid-cols-12 ml:px-12',
        logoWrapper: 'h-6 w-40 ml:h-9 ml:w-64',
        stepsDiv:
          'sticky top-0 z-10 mb-5 h-16 border border-gray bg-white max-ml:border-l-0 ml:rounded-[6rem] ml:shadow-[0_3px_5px_3px_rgba(0,0,0,0.08)]',
        stepsSection: 'order-2 ml:order-1 ml:col-span-12',
        visualizerSection: 'order-1 ml:order-2 ml:col-span-6 ml:mt-0',
        questionsSection: 'order-3 ml:col-span-6',
      },
    },
    rba: {
      classes: {},
    },
  };
};
