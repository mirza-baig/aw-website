'use client';

import { Page } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FormFieldsTheme } from 'helpers/CustomForms/FormFields.Theme';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { OptionItem } from 'lib/generic-form-builder/utils/get-option-items';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type CheckboxGroupProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.CheckboxGroup.CheckboxGroupField & {
    options: OptionItem[];
    page: Page;
  };

function CheckboxGroupField_Default(props: CheckboxGroupProps): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  if (props.fields == undefined) {
    return null;
  }

  const fieldName = page.mode.isEditing ? 'CheckboxGroupField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isInvalid = touched[fieldName] && errors[fieldName];

  const options = props.options;

  const ColumnSpan: Record<number, string> = {
    1: 'col-span-12 md:col-span-12',
    2: 'col-span-12 md:col-span-6',
    3: 'col-span-12 md:col-span-4',
    4: 'col-span-12 md:col-span-3',
  };

  const checkboxesPerRow = getEnum<number>(props.fields.checkboxesPerRows) || 1;

  return (
    <FieldWrapper {...props} isArrayField>
      <div className={classNames('mt-xs grid grid-cols-12')}>
        {options.map((option: OptionItem, index: number) => (
          <div
            key={option.id}
            className={classNames(
              ColumnSpan[checkboxesPerRow],
              'mb-s flex items-center text-dark-gray hover:text-black',
              index === options?.length - 1 ? 'mr-0!' : '',
              page.mode.isEditing ? 'pointer-events-none' : ''
            )}
          >
            <Field
              id={option.id}
              name={fieldName}
              type="checkbox"
              value={option.value}
              className={classNames(
                'peer h-[20px] w-[20px] cursor-pointer appearance-none border border-dark-gray checked:bg-black hover:border-black hover:bg-white checked:hover:bg-black focus:bg-gray focus:ring-0 checked:focus:bg-black',
                themeData.classes.checkbox,
                isInvalid ? themeData.classes.errorOutline : '',
                values[fieldName] ? 'border-black text-black' : ''
              )}
            />
            <label
              htmlFor={option.id}
              className={classNames(
                ' ml-xs flex w-auto cursor-pointer items-center text-body text-dark-gray hover:text-black peer-checked:text-black'
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

export const Default = withDatasourceCheck(CheckboxGroupField_Default);
