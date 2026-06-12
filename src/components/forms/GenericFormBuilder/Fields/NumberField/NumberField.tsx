'use client';

import { Field as SitecoreField } from '@sitecore-content-sdk/nextjs';
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

function NumberField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.Number.NumberField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  const fieldName = page.mode.isEditing ? 'NumberField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isInvalid = touched[fieldName] && errors[fieldName];

  const dependsOnNameField = props.fields?.dependsOn?.fields.fieldName as
    | SitecoreField<string>
    | undefined;
  const dependsOnName = dependsOnNameField?.value;
  const showRequiredIndication = dependsOnName == undefined ? false : values[dependsOnName] < 1;

  return (
    <FieldWrapper {...props} showRequiredIndication={showRequiredIndication}>
      <Field
        id={props.rendering.uid}
        name={fieldName}
        type="number"
        placeholder={props.fields?.placeholderText?.value || ''}
        min={props.fields?.minLength?.value}
        max={props.fields?.maxLength?.value}
        className={classNames('text-center', themeData.classes.input, {
          [themeData.classes.errorOutline]: isInvalid,
          'border-black': values[fieldName],
          'pointer-events-none': page.mode.isEditing,
        })}
      />
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(NumberField_Default);
