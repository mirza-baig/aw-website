export type ThemeName = 'aw' | 'rba';

export type ThemeFile = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in ThemeName]: any;
};

export function getTheme(themeName: ThemeName, themeFile?: ThemeFile) {
  const themeData = themeFile ? themeFile[themeName] : undefined;
  return themeData;
}
