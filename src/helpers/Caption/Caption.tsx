import { Field } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { useTheme } from 'lib/context/ThemeContext';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import RichTextWrapper from '../RichTextWrapper/RichTextWrapper';
import { CaptionTheme } from './Caption.theme';
export type CaptionProps = {
  caption?: Field<string>;
  classes?: string;
  italic?: boolean;
  isImageCaption?: boolean;
};

const Caption = ({
  caption,
  classes,
  italic = true,
  isImageCaption = true,
}: CaptionProps): JSX.Element => {
  const isEE = useExperienceEditor();
  const { themeData } = useTheme(CaptionTheme(italic, isImageCaption));

  if (caption?.value == '' && !isEE) {
    return <></>;
  }

  classes = classNames(classes, themeData.classes.captionContainer);

  return <RichTextWrapper field={caption} refer="caption" className={classes} />;
};
export default Caption;
