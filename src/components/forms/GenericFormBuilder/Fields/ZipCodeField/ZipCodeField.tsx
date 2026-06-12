'use client';

import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function ZipCodeField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.ZipCode.ZipCodeField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  const fieldName = page.mode.isEditing ? 'ZipCodeField' : props.fields?.fieldName.value;
  if (props.fields == undefined || isNullOrWhitespace(fieldName)) {
    return null;
  }
  const isInvalid = touched[fieldName] && errors[fieldName];

  return (
    <FieldWrapper {...props}>
      <Field
        id={props.rendering.uid}
        name={fieldName}
        type={'text'}
        placeholder={props.fields.placeholderText.value}
        className={classNames(themeData.classes.input, {
          [themeData.classes.errorOutline]: isInvalid,
          'border-black': values[fieldName],
          'pointer-events-none': page.mode.isEditing,
        })}
      />
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(ZipCodeField_Default);
