'use client';

import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import { BodyCopy } from 'helpers/BodyCopy/BodyCopy';
import { FieldWrapper } from 'helpers/GenericFormBuilder/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import { useGenericFormBuilderContext } from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

function ConsentCheckboxField_Default(
  props: ComponentProps &
    Sitecore.Forms.GenericFormBuilder.Fields.ConsentCheckbox.ConsentCheckboxField
): JSX.Element | null {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched } = useFormikContext<FormikValues>();
  const { isFormInteracted } = useGenericFormBuilderContext();
  const { page } = props;

  if (props.fields == undefined) {
    return null;
  }

  const fieldName = page.mode.isEditing ? 'ConsentCheckboxField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }
  const isInvalid = touched[fieldName] && errors[fieldName];

  if (
    props.fields.hideFieldOnLoad.value &&
    !isFormInteracted &&
    Object.keys(touched)?.length <= 0
  ) {
    return null;
  }

  return (
    <FieldWrapper {...props}>
      <div className="flex w-full gap-xxs">
        <Field
          className={classNames(
            themeData.classes.checkbox.input,
            isInvalid ? themeData.classes.checkbox.invalidInput : '',
            page.mode.isEditing ? 'pointer-events-none' : ''
          )}
          type="checkbox"
          id={props.rendering.uid}
          name={fieldName}
        />
        {/* custom checkbox icon */}
        <svg
          role="img"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className={themeData.classes.checkbox.customTickIcon}
        >
          <title>checkbox</title>
          <g>
            <path
              d="M7.50013 13.5454L4.02513 10.0704L2.8418 11.2454L7.50013 15.9038L17.5001 5.90376L16.3251 4.72876L7.50013 13.5454Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath>
              <rect width="20" height="20" fill="currentColor" transform="translate(0 0.0703125)" />
            </clipPath>
          </defs>
        </svg>
        <label htmlFor={props.rendering.uid}>
          <BodyCopy
            refer={''}
            fields={{ body: props.fields.consentText }}
            classes={themeData.classes.consentText}
          />
        </label>
      </div>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(ConsentCheckboxField_Default);
