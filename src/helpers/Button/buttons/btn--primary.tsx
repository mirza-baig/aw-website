import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

export const ButtonPrimaryClasses = (themeName: string) => {
  if (themeName === 'aw') {
    return {
      btnClass:
        'flex w-fit items-center whitespace-normal rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg px-m py-[9px] font-sans text-button font-heavy text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray disabled:hover:bg-theme-btn-bg disabled:cursor-not-allowed',
      iconClass: 'ml-xxs',
    };
  } else {
    return {
      btnClass:
        'group relative flex w-fit items-center bg-theme-btn-bg p-s font-serif text-button font-bold text-theme-btn-text hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:bg-gray disabled:text-dark-gray disabled:cursor-not-allowed',
      iconClass:
        'ml-[10px] text-theme-btn-primary-icon group-hover:text-theme-btn-primary-icon-hover group-disabled:text-dark-gray',
    };
  }
};

const ButtonPrimary = (props: ButtonProps): JSX.Element => {
  const { themeName } = useTheme();
  const { field, icon, classes, modalId, modalLinkText, ariaLabel } = props;
  const _icon = getEnum<IconTypes>(icon);

  if (field === undefined) {
    return <></>;
  }

  return (
    <LinkWrapper
      field={field}
      modalId={modalId}
      modalLinkText={modalLinkText}
      ariaLabel={ariaLabel}
      className={classNames(ButtonPrimaryClasses(themeName).btnClass, classes)}
    >
      {icon && <SvgIcon icon={_icon} className={ButtonPrimaryClasses(themeName).iconClass} />}
    </LinkWrapper>
  );
};

export default ButtonPrimary;
