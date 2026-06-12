'use client';

import { Page } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { OptionItem } from 'lib/generic-form-builder/utils/get-option-items';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type RadioButtonProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.RadioButton.RadioButtonField & {
    options: OptionItem[];
    page: Page;
  };

function RadioButtonField_Default(props: RadioButtonProps): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  const fieldName = page.mode.isEditing ? 'RadioButtonField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isInvalid = touched[fieldName] && errors[fieldName];

  const options = props.options;
  const isInline = options.length == 2;

  return (
    <FieldWrapper {...props}>
      <div className={classNames('mt-xs flex w-full', isInline ? ' flex-row' : 'flex-col')}>
        {options.map((option: OptionItem, index: number) => (
          <div
            key={option.id}
            className={classNames(' items-center text-dark-gray  hover:text-black ', {
              'mr-l inline-flex': isInline,
              'mb-m flex': !isInline,
              'mr-0! mb-0!': index === options.length - 1,
              'pointer-events-none': page.mode.isEditing,
            })}
          >
            <Field
              id={option.id}
              name={fieldName}
              type="radio"
              value={option.value}
              className={classNames(
                'peer h-[20px] w-[20px] cursor-pointer appearance-none border-2 border-dark-gray checked:bg-black! checked:ring-2! hover:border-black focus:bg-gray focus:ring-0 ',
                themeData.classes.radio,
                isInvalid ? themeData.classes.errorOutline : '',
                values[fieldName] ? 'border-2 border-black text-black ' : ''
              )}
            />
            <label
              htmlFor={option.id}
              className={classNames(
                ' ml-xs w-auto cursor-pointer items-center text-body text-dark-gray hover:text-black peer-checked:text-black',
                isInline ? ' flex ' : 'flex'
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(RadioButtonField_Default);
