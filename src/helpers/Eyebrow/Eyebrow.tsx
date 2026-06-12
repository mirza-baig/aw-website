import { Text } from '@sitecore-content-sdk/nextjs';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type EyebrowProps = Sitecore.FieldSets.Eyebrow & {
  useTag?: string;
  classes: string;
};

const Eyebrow = ({ fields, useTag, classes }: EyebrowProps): JSX.Element => {
  const isEE = useExperienceEditor();
  const defaultTag = 'h2';
  const tag = useTag ?? getHeadingLevel(defaultTag, fields?.eyebrowLevel);

  if (!fields?.eyebrowText?.value && !isEE) {
    return <></>;
  }

  return (
    <div className={classes}>
      <Text tag={tag} field={fields?.eyebrowText} />
    </div>
  );
};
export default Eyebrow;
