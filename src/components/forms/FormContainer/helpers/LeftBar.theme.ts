type ThemeName = 'aw' | 'rba';

const LeftBarClasses = (themeName: ThemeName) => {
  if (themeName === 'aw') {
    return {
      list: 'flex flex-col gap-l py-xl list-none',
      item: 'flex items-start gap-s max-w-[360px] mx-auto',
      iconWrapper: 'flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full',
      text: 'font-sans text-sm leading-relaxed text-black',
      link: 'text-brand-primary underline',
    };
  }

  return {
    list: 'flex flex-col gap-l py-xl list-none',
    item: 'flex items-start gap-s max-w-[360px] mx-auto',
    iconWrapper: 'flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full',
    text: 'font-sans text-sm leading-relaxed text-black',
    link: 'text-accent underline',
  };
};

export const getLeftBarTheme = () => {
  return {
    aw: {
      classes: LeftBarClasses('aw'),
    },
    rba: {
      classes: LeftBarClasses('rba'),
    },
  };
};
