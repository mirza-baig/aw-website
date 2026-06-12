import { ThemeName } from 'lib/context/ThemeContext';

export const getTableTemplateTheme = (themeName: ThemeName) => {
  switch (themeName) {
    case 'aw':
      return {
        itemTitle:
          'font-sans text-sm-xs ml:text-xs font-heavy uppercase text-black mr-[2px] ml:mr-0',
        itemLink: 'flex items-center text-darkprimary font-sans font-heavy leading-none',
      };
    case 'rba':
      return {
        itemTitle: 'text-body ml:text-xs font-bold uppercase text-black mr-[2px] ml:mr-0',
        itemLink: 'flex items-center text-darkprimary font-bold',
      };
  }
};
