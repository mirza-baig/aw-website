import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type SubheadlineProps = Sitecore.FieldSets.Subheadline & {
  useTag?: string;
  classes: string;
};

const Subheadline = ({ fields, useTag, classes }: SubheadlineProps): JSX.Element => {
  const isEE = useExperienceEditor();
  const defaultTag = 'h3';
  const tag = useTag ?? getHeadingLevel(defaultTag, fields?.subheadlineLevel);

  if (fields?.subheadlineText?.value == '' && !isEE) {
    return <></>;
  }

  return (
    <div className={classNames('font-sans', classes)}>
      <Text tag={tag} field={fields?.subheadlineText} />
    </div>
  );
};
export default Subheadline;
