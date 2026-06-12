'use client';

import Component from 'helpers/Component/Component';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { ContentBlockWithMediaAW, ContentBlockWithMediaProps } from './ContentBlockWithMediaAW';

export const ContentBlockWithMediaClient = (props: ContentBlockWithMediaProps): JSX.Element => {
  const { themeName } = useTheme();
  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/contentblockwithmedia"
      {...props}
    >
      {themeName === 'aw' && <ContentBlockWithMediaAW {...props} />}
    </Component>
  );
};
