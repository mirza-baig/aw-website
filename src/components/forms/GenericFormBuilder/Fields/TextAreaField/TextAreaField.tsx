'use client';

import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { ChangeEvent, JSX, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function TextAreaField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.TextArea.TextAreaField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, handleChange } = useFormikContext<FormikValues>();
  const { page } = props;

  const maxLength = props.fields?.maxLength.value;
  const minLength = props.fields?.minLength.value;

  const showRemainingCharactersCount = props.fields?.showRemainingCharactersCount.value ?? false;

  const fieldName = props.fields?.fieldName.value ?? '';

  const [remainingChar, setRemainingChar] = useState(
    showRemainingCharactersCount && maxLength ? maxLength - values[fieldName]?.length : 0
  );

  if (isNullOrWhitespace(fieldName) && !page.mode.isEditing) {
    return null;
  }
  const isInvalid = touched[fieldName] && errors[fieldName];

  return (
    <FieldWrapper {...props}>
      <Field
        id={props.rendering.uid}
        name={fieldName}
        placeholder={props.fields?.placeholderText?.value}
        rows={props.fields?.rows?.value}
        minLength={minLength}
        maxLength={maxLength}
        as="textarea"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          if (showRemainingCharactersCount && maxLength) {
            setRemainingChar(maxLength - e.target.value.length);
          }
          handleChange(e);
        }}
        className={classNames(
          themeData.classes.textarea,
          isInvalid ? themeData.classes.errorOutline : '',
          values[fieldName] ? 'border-black' : 'border-gray',
          page.mode.isEditing ? 'pointer-events-none' : ''
        )}
      />

      {showRemainingCharactersCount && (
        <div className={themeData.classes.textareaCharCount}>
          {remainingChar === maxLength
            ? `${remainingChar} characters allowed`
            : `${remainingChar} characters remaining`}
        </div>
      )}
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(TextAreaField_Default);
