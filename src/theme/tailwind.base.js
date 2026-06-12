/** @type {import('tailwindcss').Config} */

module.exports = {
  extend: {
    name: 'base',
    fontFamily: {
      'futura-pt': 'Futura-pt',
    },
    colors: {
      'theme-bg': 'var(--theme-bg)',
      'theme-btn-bg-hover': 'var(--theme-btn-bg-hover)',
      'theme-btn-bg': 'var(--theme-btn-bg)',
      'theme-btn-text': 'var(--theme-btn-text)',
      'theme-body': 'var(--theme-body)',
      'theme-text': 'var(--theme-text)',
      'theme-btn-text-hover': 'var(--theme-btn-text-hover)',
      'theme-btn-border': 'var(--theme-btn-border)',
      'theme-btn-border-hover': 'var(--theme-btn-border-hover)',
      'theme-btn-icon': 'var(--theme-btn-icon)',
      'theme-btn-icon-hover': 'var(--theme-btn-icon-hover)',
      'theme-btn-primary-icon': 'var(--theme-btn-primary-icon)',
      'theme-btn-primary-icon-hover': 'var(--theme-btn-primary-icon-hover)',
      'theme-btn-secondary-bg': 'var(--theme-btn-secondary-bg)',
      'theme-btn-secondary-bg-hover': 'var(--theme-btn-secondary-bg-hover)',
      'theme-btn-secondary-text': 'var(--theme-btn-secondary-text)',
      'theme-btn-secondary-text-hover': 'var(--theme-btn-secondary-text-hover)',
      'theme-btn-secondary-border': 'var(--theme-btn-secondary-border)',
      'theme-btn-secondary-border-hover': 'var(--theme-btn-secondary-border-hover)',
      'error-outline': '#F14343',
      error: '#B91515',
    },
    screens: {
      xl: '1488px', // 1440 + 48 padding
      lg: '1248px', // 1200 + 48 padding
      mml: '1024px', // 960 + 48 padding
      ml: '1008px', // 960 + 48 padding
      mmd: '800px', // Calculator forms
      md: '672px',
      sm: '375px',
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    spacing: {
      xxl: '7.5rem',
      xl: '5rem',
      l: '2.5rem',
      ml: '2rem',
      m: '1.5rem',
      s: '1rem',
      xs: '0.75rem',
      xxs: '0.5rem',
      xxxs: '0.25rem',
      0: '0px',
    },
    aspectRatio: {
      hero: '21 / 9',
      video: '16 / 9',
      picture: '4 / 3',
      snapshot: '3 / 2',
      portrait: '2 / 3',
      square: '1 / 1',
    },
    objectPosition: {
      bottom: 'bottom',
      left: 'left',
      right: 'right',
      top: 'top',
      'left-bottom': 'left bottom',
      'right-bottom': 'right bottom',
      'left-top': 'left top',
      'right-top': 'right top',
    },
    extend: {
      gap: {
        s: '1rem',
      },
    },
  },
};
