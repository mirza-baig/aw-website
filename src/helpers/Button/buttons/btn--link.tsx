import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

const ButtonLink = (props: ButtonProps): JSX.Element => {
  const { field, icon, classes, modalId, modalLinkText, ariaLabel, ctaPersonalizeEventName } =
    props;
  const _icon = getEnum<IconTypes>(icon);

  if (field === undefined) {
    return <></>;
  }

  return (
    <LinkWrapper
      field={field}
      className={classNames(
        'hover:decoration-theme-btn-decoration flex w-fit items-center whitespace-normal font-sans text-text-link font-heavy text-theme-text hover:underline hover:underline-offset-8 disabled:border-gray disabled:text-gray',
        classes
      )}
      modalId={modalId}
      modalLinkText={modalLinkText}
      ctaPersonalizeEventName={ctaPersonalizeEventName}
      ariaLabel={ariaLabel}
      ctaSection={props.ctaSection}
    >
      {icon && <SvgIcon icon={_icon} className="ml-xxs" />}
    </LinkWrapper>
  );
};

export default ButtonLink;
