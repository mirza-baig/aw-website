import classNames from 'classnames';

export type Theme =
  | 'theme-white'
  | 'theme-blue--light'
  | 'theme-blue--navy'
  | 'theme-gold'
  | 'theme-inherit';

export const ThemeOptionsDefault: Theme = 'theme-white';

export const getThemeClasses = (theme: Theme | undefined): string =>
  theme === 'theme-inherit' || !theme ? '' : classNames(theme, 'bg-theme-bg', 'text-theme-text');
