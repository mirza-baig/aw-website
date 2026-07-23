import classNames from 'classnames';
import useExperienceEditor from 'lib/utils/use-experience-editor';

import { RichTextWrapper } from '../RichTextWrapper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type DisclaimerProps =
  Sitecore.Forms.GenericFormBuilder.Elements.Disclaimer.DisclaimerElement & {
    disclaimerLayoutClasses?: string;
    disclaimerClasses?: string;
    hideIfDisclaimerTextIsEmpty?: boolean;
    isLegalCopy?: boolean;
  };
const DisclaimerText = (props: Partial<DisclaimerProps>) => {
  const isEE = useExperienceEditor();

  if (props?.hideIfDisclaimerTextIsEmpty && props?.fields?.disclaimerText?.value == '' && !isEE) {
    return <></>;
  }

  if (!props.fields) {
    return <></>;
  }

  return (
    <div className={classNames(props.disclaimerLayoutClasses ?? 'col-span-12')}>
      <RichTextWrapper
        field={props.fields.disclaimerText}
        className={classNames(
          props.isLegalCopy ? 'legal-copy' : '!legal-copy',
          props.disclaimerClasses
        )}
      />
    </div>
  );
};
export default DisclaimerText;
