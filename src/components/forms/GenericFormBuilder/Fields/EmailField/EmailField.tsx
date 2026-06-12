'use client';

import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getWidthClass } from 'lib/generic-form-builder/utils/get-width-class';
import { replacePlaceholders } from 'lib/generic-form-builder/utils/replace-placeholders';
import { isRuleIncludedInField } from 'lib/generic-form-builder/utils/validation-utils/is-rule-included-in-field';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function EmailField_Default(
  props: ComponentProps & Sitecore.Forms.GenericFormBuilder.Fields.Email.EmailField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const [showError, setShowError] = useState(false);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  const fieldName = page.mode.isEditing ? 'EmailField' : props.fields?.fieldName.value;
  if (props.fields == undefined || isNullOrWhitespace(fieldName)) {
    return null;
  }
  const showConfirmEmail = props.fields.showConfirmEmail?.value === true;

  const isInvalid = touched[fieldName] && errors[fieldName];

  const placeholdersConfirmEmail: Record<string, string> = {
    fieldLabel: props.fields.confirmEmailLabel.value,
  };

  const validations = props.fields
    .validations as unknown as Sitecore.FieldSets.Forms.FieldValidation[];
  const requiredValidation = validations.find(
    (item) => getEnum(item.fields?.validationType) == 'required'
  );
  const errorMessage = requiredValidation?.fields?.errorMessage?.value;
  const nameconfirmEmail = `confirmEmail_${fieldName}`;
  return (
    <>
      <FieldWrapper {...props}>
        <Field
          id={props.rendering.uid}
          name={fieldName}
          placeholder={props.fields?.placeholderText?.value}
          type="email"
          className={classNames(
            themeData.classes.input,
            isInvalid ? themeData.classes.errorOutline : '',
            values[fieldName] ? 'border-black' : '',
            page.mode.isEditing ? 'pointer-events-none' : ''
          )}
        />
      </FieldWrapper>
      {showConfirmEmail && (
        <div className={classNames('relative mb-s', getWidthClass(props))}>
          <label
            className={classNames(
              themeData.classes.label,
              showError && !isInvalid ? themeData.classes.errorTextColor : ''
            )}
            htmlFor={nameconfirmEmail}
          >
            {props.fields?.confirmEmailLabel?.value}{' '}
            {isRuleIncludedInField(props, 'required') ? '*' : ''}
          </label>
          <Field
            id={nameconfirmEmail}
            name={nameconfirmEmail}
            placeholder={props.fields?.confirmEmailPlaceholderText?.value}
            type="email"
            className={classNames(themeData.classes.input, {
              [themeData.classes.errorOutline]: showError && !isInvalid,
              'border-black': values[fieldName],
            })}
            validate={(value: string) => {
              if (requiredValidation && touched[nameconfirmEmail] && !value && values[fieldName]) {
                setShowError(true);
                return errorMessage;
              } else {
                setShowError(false);
              }
              if (values[fieldName] && value !== values[fieldName] && touched[nameconfirmEmail]) {
                setShowError(true);
                return props.fields?.confirmEmailMatchError?.value;
              } else {
                setShowError(false);
              }

              return undefined;
            }}
          />
          {touched[nameconfirmEmail] && errors[nameconfirmEmail] && (
            <span
              className={classNames(
                themeData.classes.errorMessage,
                themeData.classes.errorTextColor
              )}
            >
              {replacePlaceholders(errors[nameconfirmEmail] as string, placeholdersConfirmEmail)}
            </span>
          )}
        </div>
      )}
    </>
  );
}

export const Default = withDatasourceCheck(EmailField_Default);
