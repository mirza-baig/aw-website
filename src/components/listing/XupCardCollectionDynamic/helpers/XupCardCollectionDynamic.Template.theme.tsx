import classNames from 'classnames';
import { cardAlignment } from 'components/listing/XupCardCollectionDynamic/XupCardCollectionDynamic';
import { ThemeName } from 'lib/context/ThemeContext';

export const getGridTemplateTheme = (themeName: ThemeName, alignment: cardAlignment = 'left') => {
  switch (themeName) {
    case 'aw':
      return {
        gridItem: classNames(
          'border-b border-gray flex h-full flex-col',
          alignment === 'center' ? 'text-center' : 'text-left'
        ),
        imageWrapper: 'imageWrapper mb-s',
        eyebrow: 'font-heavy text-xxs leading-none text-dark-gray uppercase mb-xs',
        headline: 'font-heavy font-serif! text-base leading-[22px] mb-xxxs',
        subheadline: 'font-regular font-serif! text-body mb-xs',
        body: 'text-body text-dark-gray font-regular mb-s',
        // update classes if showroomHours are used in AW
        showroomHours: {
          showrooms: {
            title: '',
            listWrapper: '',
            listItem: '',
          },
          events: {
            title: '',
            listWrapper: '',
            listItem: '',
          },
        },
        buttonGroup: {
          wrapper: classNames(
            alignment === 'center' ? 'justify-center' : 'justify-start',
            'mt-auto'
          ),
          cta1Classes: '',
        },
      };
    case 'rba':
      return {
        gridItem: classNames(
          'border-b border-gray flex h-full flex-col',
          alignment === 'center' ? 'text-center' : 'text-left'
        ),
        imageWrapper: 'imageWrapper mb-s',
        eyebrow: 'font-bold font-serif! text-xxs uppercase mb-xxs',
        headline: 'font-medium text-sm-s mb-xxs',
        subheadline: 'font-bold font-serif! text-body text-dark-gray mb-xxs',
        body: 'text-body text-dark-gray font-regular mb-s',
        showroomHours: {
          showrooms: {
            title: 'text-xxs font-bold font-serif!',
            listWrapper: 'mb-s',
            listItem: 'text-body text-dark-gray font-regular font-serif!',
          },
          events: {
            title: '',
            listWrapper: 'mb-xxs',
            listItem: 'text-small font-bold mb-xxxs',
          },
        },
        buttonGroup: {
          wrapper: classNames(
            alignment === 'center' ? 'justify-center' : 'justify-start',
            'mt-auto'
          ),
          cta1Classes: '',
        },
      };
  }
};
