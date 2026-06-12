'use client';
import { RichText } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type HeadlineProps = Sitecore.FieldSets.Headline & {
  useTag?: string;
  classes?: string;
};

const Headline = ({ fields, useTag, classes }: HeadlineProps): JSX.Element => {
  const isEE = useExperienceEditor();
  const defaultTag = 'h2';
  const tag = useTag ?? getHeadingLevel(defaultTag, fields?.headlineLevel);

  if (fields?.headlineText?.value == '' && !isEE) {
    return <></>;
  }

  if (isNullOrWhitespace(classes)) {
    classes = 'text-theme-text text-sm-m md:text-m mb-s font-bold';
  }

  return (
    <div className={classNames(`items-top font-sans [&_a:hover]:underline`, classes)}>
      <RichText tag={tag} field={fields?.headlineText} />
    </div>
  );
};
export default Headline;
