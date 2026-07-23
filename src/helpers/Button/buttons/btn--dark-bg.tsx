import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

const ButtonDarkBG = (props: ButtonProps): JSX.Element => {
  const { field, icon, classes, modalId, modalLinkText, ariaLabel, ctaPersonalizeEventName } =
    props;
  const _icon = getEnum<IconTypes>(icon);

  if (field === undefined) {
    return <></>;
  }

  return (
    <LinkWrapper
      modalId={modalId}
      modalLinkText={modalLinkText}
      ctaPersonalizeEventName={ctaPersonalizeEventName}
      field={field}
      className={classNames(
        'flex w-fit items-center whitespace-normal rounded-lg border-4 border-white bg-white px-m py-[9px] font-sans text-button font-heavy text-black hover:border-black hover:bg-black hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
        classes
      )}
      ariaLabel={ariaLabel}
      ctaSection={props.ctaSection}
    >
      {icon && <SvgIcon icon={_icon} className="ml-xxs" />}
    </LinkWrapper>
  );
};

export default ButtonDarkBG;
