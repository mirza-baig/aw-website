import classNames from 'classnames';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import RichTextWrapper from '../RichTextWrapper/RichTextWrapper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type BodyCopyProps = Sitecore.FieldSets.BodyCopy & {
  classes?: string;
  refer?: string;
};

export const BodyCopy = ({ fields, classes, refer }: BodyCopyProps): JSX.Element => {
  const isEE = useExperienceEditor();

  if (fields?.body?.value == '' && !isEE) {
    return <></>;
  }

  classes ??= classNames(classes, 'text-theme-body text-body mb-s');

  return (
    <div className={classes}>
      <RichTextWrapper refer={refer} field={fields?.body} />
    </div>
  );
};

export default BodyCopy;
