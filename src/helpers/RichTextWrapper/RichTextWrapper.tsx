'use client';
import { RichText, RichTextProps, useSitecore } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { JSX } from 'react';

type RichTextWrapperProps = RichTextProps & {
  classes?: string;
  refer?: string;
};
const RichTextWrapper = ({
  field,
  classes,
  refer = 'body-copy',
  ...props
}: RichTextWrapperProps): JSX.Element => {
  const { page } = useSitecore();

  // Just pass as normal if in Experience Editor
  if (page.mode.isEditing) {
    return (
      <div className={classNames(refer, classes)}>
        <RichText field={field} {...props} />
      </div>
    );
  }

  // Bail if we don't have any field data
  if (!field?.value) {
    return <></>;
  }
  return (
    <div className={classNames(classes, refer)}>
      <RichText field={{ value: field?.value }} {...props} />
    </div>
  );
};

export default RichTextWrapper;
