/** @type {import('tailwindcss').Config} */
module.exports = {
  name: 'rba',
  extend: {
    fontSize: {
      xxl: ['3.5rem', '120%'], //56px 67.2px
      xl: ['3.5rem', '120%'], //56px 67.2px
      l: ['2rem', '125%'], //32px 40px
      m: ['1.5rem', '2rem'], //24px 32px
      s: ['1.25rem', '1.75rem'], //20px 28px
      xs: ['1rem', '1.25rem'], //16px 20px
      xxs: ['0.75rem', '1rem'], //12px 16px
      body: ['0.875rem', '157%'], //14px 21.98px
      'large-body': ['1.125rem', '133%'], //18px 23.94px
      button: ['0.875rem', '120%'], //14px 16.8px
      'text-link': ['0.875rem', '0.875rem'], //14px 14px
      small: ['0.75rem', '130%'], //12px 15.6px
      legal: ['0.625rem', '130%'], //10px 13px
      base: ['1rem', '1.125rem'], //16px 18px

      // Mobile font sizes
      'sm-xxl': ['2rem', '120%'], //32px 38.4px
      'sm-xl': ['2rem', '120%'], //32px 38.4px
      'sm-l': ['2rem', '120%'], //32px 38.4px
      'sm-m': ['1.5rem', '2rem'], //24px 32px
      'sm-s': ['1.25rem', '1.75rem'], //20px 28px
      'sm-xs': ['1rem', '1.25rem'], //16px 20px
      'sm-xxs': ['0.75rem', '1rem'], //12px 16px
    },
    colors: {
      'light-gray': '#F9F9F9',
      'dark-gray': '#54585A',
      gray: '#D2D1D0',
      primary: '#6CC14C',
      darkprimary: '#326222',
      secondary: '#000000',
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
      'light-black': '#454545',
    },
    fontWeight: {
      bold: '700',
      heavy: '600',
      'semi-bold': '600',
      medium: '500',
      regular: '400',
      'extra-light': '300',
    },
    borderRadius: {
      none: '0',
      lg: '4.0625rem',
    },
    fontFamily: {
      sans: ['franklin-gothic-atf', 'system-ui'],
      serif: ['open-sans', 'system-ui'],
    },
  },
};
