'use client';

import InputMask from '@mona-health/react-input-mask';
import classNames from 'classnames';
import { Field, FieldProps, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function PhoneField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.Phone.PhoneField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  const fieldName = page.mode.isEditing ? 'PhoneField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isInvalid = touched[fieldName] && errors[fieldName];

  return (
    <FieldWrapper {...props}>
      <Field id={props.rendering.uid} name={fieldName}>
        {({ field }: FieldProps) => (
          <InputMask
            {...field}
            id={props.rendering.uid}
            mask={'(999) 999-9999'}
            maskPlaceholder="_"
            name={fieldName}
            placeholder={props.fields?.placeholderText?.value}
            type="tel"
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: isInvalid,
              'border-black': values[fieldName],
              'pointer-events-none': page.mode.isEditing,
            })}
            value={values[fieldName]}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(event);
            }}
          />
        )}
      </Field>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(PhoneField_Default);
