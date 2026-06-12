import classNames from 'classnames';
import { Field } from 'formik';
import { useTheme } from 'lib/context/ThemeContext';
import React from 'react';

import { FormFieldsTheme } from './FormFields.Theme';

export type CustomTileButtonProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isMultiSelectEnabled: boolean;
  subtitle?: string;
  icons?: {
    value: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
};

const CustomTileButton = ({
  isMultiSelectEnabled,
  value,
  title,
  subtitle,
  name,
  icons,
  onClick,
}: CustomTileButtonProps) => {
  const { themeData } = useTheme(FormFieldsTheme);

  return (
    <label>
      <Field
        className={classNames(
          'appearence-none h-0 w-0 border-0 outline-none ring-0 focus:ring-0 [&:focus:checked+.button-card-item]:before:ring-2 [&:focus+.button-card-item]:before:ring-2 [&:checked+.button-card-item]:bg-light-gray!',
          themeData.classes.tileButton.tileButtonCheckboxSelected
        )}
        type={isMultiSelectEnabled ? 'checkbox' : 'radio'}
        name={name}
        value={value}
        onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
          onClick?.(event);
        }}
      />
      <div
        className={classNames(
          themeData.classes.tileButton.tileButtonItem,
          themeData.classes.tileButton.tileButtonItemDesktop,
          themeData.classes.tileButton.tileButtonCheckboxItem,
          icons && subtitle ? 'h-24 bg-white hover:before:border-orange-500!' : ''
        )}
      >
        <div
          className={classNames(
            !isMultiSelectEnabled && themeData.classes.tileButton.tileButtonItemContent,
            'w-[90%] md:w-auto lg:w-auto'
          )}
        >
          {icons && subtitle ? (
            <div className="flex items-center">
              <img
                src={icons?.value?.src}
                alt={icons?.value?.alt}
                width={(icons?.value?.width / icons?.value?.height) * 43} // Calculate proportional width
                className="aspect-square h-[43px] lg:h-[53px]"
              />
              <div className="break-normal px-s text-left font-sans text-button font-heavy md:text-xs">
                {title}

                <div className="text-xss sm:text-xss break-normal text-left font-sans! font-normal! text-dark-gray md:text-xxs lg:text-base">
                  {subtitle}
                </div>
              </div>
            </div>
          ) : (
            <div className={classNames(themeData.classes.tileButton.title, 'text-button!')}>
              {title}
            </div>
          )}
        </div>
      </div>
    </label>
  );
};

export default CustomTileButton;
