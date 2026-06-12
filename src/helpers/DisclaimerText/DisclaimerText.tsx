import classNames from 'classnames';

import { RichTextWrapper } from '../RichTextWrapper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type DisclaimerProps =
  Sitecore.Forms.GenericFormBuilder.Elements.Disclaimer.DisclaimerElement & {
    disclaimerLayoutClasses?: string;
    disclaimerClasses?: string;
  };
const DisclaimerText = (props: Partial<DisclaimerProps>) => {
  if (!props.fields) {
    return <></>;
  }

  return (
    <div className={classNames(props.disclaimerLayoutClasses ?? 'col-span-12')}>
      <RichTextWrapper
        field={props.fields.disclaimerText}
        className={classNames('!legal-copy', props.disclaimerClasses)}
      />
    </div>
  );
};
export default DisclaimerText;
