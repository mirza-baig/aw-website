import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

export const ButtonSecondaryClasses = (themeName: string) => {
  if (themeName === 'aw') {
    return {
      btnClass:
        'flex w-fit items-center whitespace-normal theme-btn-secondary-border rounded-lg border-4 border-black px-m py-[9px] font-sans text-button font-heavy disabled:border-gray disabled:text-gray text-theme-btn-secondary-text bg-theme-btn-secondary-bg hover:bg-theme-btn-secondary-bg-hover hover:text-theme-btn-secondary-text-hover disabled:bg-gray disabled:cursor-not-allowed hover:border-theme-btn-secondary-border-hover',
      iconClass: 'ml-xxs',
    };
  } else {
    return {
      btnClass:
        'group relative flex w-fit items-center border-2 border-theme-btn-secondary-border bg-theme-btn-secondary-bg p-[14px] font-serif text-button font-bold text-theme-btn-secondary-text hover:bg-theme-btn-secondary-bg-hover hover:text-theme-btn-secondary-text-hover disabled:bg-gray disabled:border-gray disabled:text-dark-gray disabled:cursor-not-allowed',
      iconClass: 'ml-[10px] text-primary group-hover:text-primary group-disabled:text-dark-gray',
      // Add a specific class that will be targeted by parent selectors
    };
  }
};

const ButtonSecondary = (props: ButtonProps): JSX.Element => {
  const { themeName } = useTheme();
  const { field, icon, classes, modalId, modalLinkText, ariaLabel } = props;
  const _icon = getEnum<IconTypes>(icon);

  if (field === undefined) {
    return <></>;
  }

  return (
    <LinkWrapper
      field={field}
      className={classNames(ButtonSecondaryClasses(themeName).btnClass, classes)}
      modalId={modalId}
      modalLinkText={modalLinkText}
      ariaLabel={ariaLabel}
    >
      {icon && (
        <SvgIcon icon={_icon} className={classNames(ButtonSecondaryClasses(themeName).iconClass)} />
      )}
    </LinkWrapper>
  );
};

export default ButtonSecondary;
