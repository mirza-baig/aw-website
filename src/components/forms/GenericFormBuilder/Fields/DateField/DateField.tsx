'use client';

import { Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Field, FieldProps, FormikValues, useFormikContext } from 'formik';
import { getInitialValue } from 'helpers/CustomForms/ZippopotamusZIPCode';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

enum DateOptions {
  Today = 'today',
  Tomorrow = 'tomorrow',
  Yesterday = 'yesterday',
  Custom = 'custom',
}

function getDate(props: { date?: Item; dateCustom: string }): Date | null {
  const date = getEnum<DateOptions>(props.date);
  let result: Date | null = null;

  if (date && date === DateOptions.Today) {
    result = new Date();
  } else if (date && date === DateOptions.Tomorrow) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    result = tomorrow;
  } else if (date && date === DateOptions.Yesterday) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    result = yesterday;
  } else if (date && date === DateOptions.Custom) {
    result = new Date(props.dateCustom);
  }

  return result;
}

function DateField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.Date.DateField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, setFieldValue } = useFormikContext<FormikValues>();
  const [startDate, setStartDate] = useState<string | null>(
    getInitialValue(props) as string | null
  );
  const { page } = props;

  if (props.fields == undefined) {
    return null;
  }

  const fieldName = page.mode.isEditing ? 'DateField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const selectedMinDate = getDate({
    date: props.fields.minDate,
    dateCustom: props.fields.minDateCustom.value,
  });

  const selectedMaxDate = getDate({
    date: props.fields.maxDate,
    dateCustom: props.fields.maxDateCustom.value,
  });

  const isInvalid = touched[fieldName] && errors[fieldName];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let isoDate = '';
    if (e.target.value) {
      const selectedDate = new Date(e.target.value);
      if (!isNaN(selectedDate.getTime())) {
        isoDate = selectedDate.toISOString();
      }
    }
    setStartDate(e.target.value);
    setFieldValue(fieldName, isoDate);
  };

  const placeholder = props.fields.placeholderText.value;

  return (
    <FieldWrapper {...props}>
      <Field name={fieldName} id={props.rendering.uid}>
        {({ field }: FieldProps) => (
          <input
            {...field}
            id={props.rendering.uid}
            type="date"
            placeholder={placeholder}
            min={
              selectedMinDate !== null
                ? new Date(selectedMinDate).toISOString().split('T')[0]
                : undefined
            }
            max={
              selectedMaxDate !== null
                ? new Date(selectedMaxDate).toISOString().split('T')[0]
                : undefined
            }
            value={startDate || undefined}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid,
              'border-black': values[fieldName],
              'pointer-events-none': page.mode.isEditing,
            })}
          />
        )}
      </Field>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(DateField_Default);
