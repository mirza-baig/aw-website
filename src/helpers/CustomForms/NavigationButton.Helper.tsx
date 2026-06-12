import classNames from 'classnames';
import { Spinner } from 'helpers/Spinner';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import React from 'react';

import { getNavigationButtonTheme } from './NavigationButton.theme';

type NavigationButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconTypes;
  startWithIcon?: boolean;
  hideIcon?: boolean;
  children: React.ReactNode;
};

const NavigationButton = ({
  children,
  icon,
  startWithIcon = false,
  hideIcon = false,
  className,
  ...props
}: NavigationButtonProps) => {
  const { themeData } = useTheme(getNavigationButtonTheme(startWithIcon, hideIcon));

  const renderIcon = () => {
    if (!icon || hideIcon) {
      return null;
    }

    return (
      <SvgIcon
        icon={icon}
        className={classNames(themeData.classes.icon, {
          'rotate-180': startWithIcon && icon === 'arrow',
          'opacity-0': props.disabled,
        })}
      />
    );
  };

  return (
    <button
      {...props}
      className={classNames(
        themeData.classes.button,
        { 'min-w-m relative': props.disabled },
        className
      )}
    >
      {startWithIcon && renderIcon()}
      <span className={classNames({ 'opacity-0': props.disabled }, 'w-full')}>{children}</span>
      {!startWithIcon && renderIcon()}
      {props.disabled && (
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center">
          <Spinner size={26} />
        </div>
      )}
    </button>
  );
};

export default NavigationButton;
