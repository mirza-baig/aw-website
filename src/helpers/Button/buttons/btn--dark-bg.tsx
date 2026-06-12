import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

const ButtonDarkBG = (props: ButtonProps): JSX.Element => {
  const { themeName } = useTheme();
  const { field, icon, classes, modalId, modalLinkText, ariaLabel } = props;
  const _icon = getEnum<IconTypes>(icon);

  if (field === undefined) {
    return <></>;
  }

  if (themeName === 'aw') {
    return (
      <LinkWrapper
        modalId={modalId}
        modalLinkText={modalLinkText}
        field={field}
        className={classNames(
          'flex w-fit items-center whitespace-normal rounded-lg border-4 border-white bg-white px-m py-[9px] font-sans text-button font-heavy text-black hover:border-black hover:bg-black hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
          classes
        )}
        ariaLabel={ariaLabel}
      >
        {icon && <SvgIcon icon={_icon} className="ml-xxs" />}
      </LinkWrapper>
    );
  } else {
    return (
      <LinkWrapper
        modalId={modalId}
        modalLinkText={modalLinkText}
        field={field}
        className={classNames(
          'group relative flex w-fit items-center bg-theme-btn-bg p-s font-serif text-button font-bold text-theme-btn-text hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:border-gray disabled:text-gray',
          classes
        )}
        ariaLabel={ariaLabel}
      >
        {icon && (
          <SvgIcon icon={_icon} className="ml-[10px] text-primary group-hover:text-secondary" />
        )}
      </LinkWrapper>
    );
  }
};

export default ButtonDarkBG;
