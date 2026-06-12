/** @type {import('tailwindcss').Config} */

module.exports = {
  name: 'aw',
  extend: {
    fontSize: {
      // Desktop font sizes
      xxl: ['7.5rem', '100%'], //120px 120px
      xl: ['3.5rem', '125%'], //56px 70px
      l: ['3rem', '125%'], //48px 60px
      m: ['2.25rem', '125%'], //36px 45px
      s: ['1.5rem', '124%'], //24px 30px
      xs: ['1.125rem', '125%'], //18px 22.5px
      xxs: ['0.875rem', '125%'], //14px 17.5px
      'large-body': ['1.125rem', '140%'], //18px 25.2px
      body: ['0.875rem', '157%'], //14px 22px
      button: ['1rem', '1.125rem'], //16px 18px
      'text-link': ['1rem', '1.125rem'], //16px 18px
      caption: ['1rem', '0.875rem'], //16px 14px
      small: ['0.75rem', '130%'], //12px 15.6px
      legal: ['0.625rem', '160%'], //10px 16px
      base: ['1rem', '1.125rem'], //16px 18px

      // Mobile font sizes
      'sm-xxl': ['5rem', '100%'], //80px 80px
      'sm-xl': ['2.25rem', '125%'], //36px 45px
      'sm-l': ['1.875rem', '125%'], //30px 37.5px
      'sm-m': ['1.5rem', '100%'], //24px 24px
      'sm-s': ['1.25rem', '125%'], //20px 25px
      'sm-xs': ['1rem', '125%'], //16px 20px
      'sm-xxs': ['0.875rem', '120%'], //14px 16.8px
    },
    colors: {
      'light-gray': '#F8F6F4',
      'dark-gray': '#686869',
      gray: '#C4BFB6',
      primary: '#F26924',
      darkprimary: '#CB4C0C',
      secondary: '#000000',
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
    },
    fontWeight: {
      demi: '500',
      heavy: '600',
      bold: '700',
      medium: '450',
      regular: '400',
      light: '300',
      extralight: '200',
    },
    borderRadius: {
      none: '0',
      lg: '4.0625rem',
    },
    fontFamily: {
      sans: ['futura-pt', 'system-ui'],
      serif: ['open-sans', 'system-ui'],
    },
    extend: {
      gap: {
        s: '1rem',
      },
    },
  },
};
