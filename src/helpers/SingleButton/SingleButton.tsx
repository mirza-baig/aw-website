import classNames from 'classnames';
import { JSX } from 'react';

import Button from '../Button/Button';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type SingleButtonProps = Sitecore.FieldSets.Cta1 & {
  classes?: {
    wrapper?: string;
    cta1Classes?: string;
  };
};

const SingleButton = ({ fields, classes }: SingleButtonProps): JSX.Element => {
  return (
    <div
      className={classNames('mb-s flex items-start md:flex-row md:items-center', classes?.wrapper)}
    >
      {fields?.cta1Link && (
        <Button
          field={fields?.cta1Link}
          variant={fields?.cta1Style}
          icon={fields?.cta1Icon}
          modalId={
            (fields?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal)
              ?.fields?.modalId?.value
          }
          modalLinkText={fields?.cta1ModalLinkText}
          classes={classNames(classes?.cta1Classes)}
          ariaLabel={fields.cta1AriaLabel}
        />
      )}
    </div>
  );
};

export default SingleButton;
