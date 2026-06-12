import { ThemeFile } from 'lib/context/ThemeContext';

import { cardAlignment } from '../XupCardCollectionDynamic';
import { getGridTemplateTheme } from './XupCardCollectionDynamic.Template.theme';

export const XupCardCollectionDynamicTheme = (alignment: cardAlignment): ThemeFile => {
  return {
    aw: {
      classes: {
        /** Insert Theme classes here **/
        gridTemplateClasses: getGridTemplateTheme('aw', alignment),
        headlineClass: 'text-sm-m md:text-m font-heavy mb-s pt-3',
        bodyClass: 'text-body text-dark-gray font-regular mb-s',
      },
    },
    rba: {},
  };
};
