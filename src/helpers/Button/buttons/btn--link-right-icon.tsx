import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

const ButtonLinkRightIcon = (props: ButtonProps): JSX.Element => {
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
        'space-between relative flex w-full grow items-center py-3 pr-l font-sans text-xs font-heavy leading-6 text-secondary hover:underline hover:decoration-black hover:underline-offset-8',
        classes
      )}
      ariaLabel={ariaLabel}
      ctaSection={props.ctaSection}
    >
      {icon && (
        <SvgIcon
          icon={_icon}
          className="absolute right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary hover:bg-primary hover:text-white"
        />
      )}
    </LinkWrapper>
  );
};

export default ButtonLinkRightIcon;
