import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { ButtonProps } from '../types';

const ButtonLinkRightIcon = (props: ButtonProps): JSX.Element => {
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
          'space-between relative flex w-full grow items-center py-3 pr-l font-sans text-xs font-heavy leading-6 text-secondary hover:underline hover:decoration-black hover:underline-offset-8',
          classes
        )}
        ariaLabel={ariaLabel}
      >
        {icon && (
          <SvgIcon
            icon={_icon}
            className="absolute right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary hover:bg-primary hover:text-white"
          />
        )}
      </LinkWrapper>
    );
  } else {
    return (
      <LinkWrapper
        modalId={modalId}
        modalLinkText={modalLinkText}
        field={field}
        className={classNames(
          'space-between relative flex w-full grow items-center py-3 pr-l font-serif text-xs font-medium leading-7 text-secondary hover:underline hover:decoration-black hover:underline-offset-8',
          classes
        )}
        ariaLabel={ariaLabel}
      >
        {icon && (
          <SvgIcon
            icon={_icon}
            className="absolute right-0 flex h-10 w-10 items-center justify-center bg-black p-2 text-primary hover:bg-primary hover:text-black"
          />
        )}
      </LinkWrapper>
    );
  }
};

export default ButtonLinkRightIcon;
