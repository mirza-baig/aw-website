import classNames from 'classnames';
import { ButtonProps } from 'helpers/Button/types';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';
type HelperButtonProps = Omit<ButtonProps, 'variant'>;

export const HelperButtonClasses = (themeName: string) => {
  if (themeName === 'aw') {
    return {
      btnClass:
        'flex w-fit min-w-[280px] items-center justify-center whitespace-nowrap rounded-lg border-4 border-theme-btn-border bg-theme-btn-bg py-[8px] pr-xxs font-sans text-button font-heavy',
      iconClass: 'ml-xxs',
    };
  } else {
    return {
      btnClass: '',
      iconClass: '',
    };
  }
};

const HelperButton = (props: HelperButtonProps): JSX.Element => {
  const { themeName } = useTheme();
  const { field, icon, classes, ariaLabel } = props;
  const _icon = getEnum<IconTypes>(icon);

  if (field) {
    return (
      <LinkWrapper
        onClick={(event) => {
          if (!field?.value?.href) {
            event.preventDefault(); // Prevent default if ctaLink does not exist
          }
        }}
        field={field}
        ariaLabel={ariaLabel}
        className={classNames(HelperButtonClasses(themeName).btnClass, classes)}
      >
        {icon && <SvgIcon icon={_icon} className={HelperButtonClasses(themeName).iconClass} />}
      </LinkWrapper>
    );
  }

  return <></>;
};

export default HelperButton;
