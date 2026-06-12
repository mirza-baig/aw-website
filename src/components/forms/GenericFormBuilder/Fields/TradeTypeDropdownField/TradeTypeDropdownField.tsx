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
import { JSX, useRef } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type TradeTypeDropDownProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.TradeTypeDropDown.TradeTypeDropDownField & {
    options: OptionItem[];
    page: Page;
  };

function TradeTypeDropdownField_Default(props: TradeTypeDropDownProps): JSX.Element | null {
  const { themeName, themeData } = useTheme(FormFieldsTheme);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const { page } = props;
  const formikContext = useFormikContext<FormikValues>();

  const fieldName = page.mode.isEditing ? 'TradeTypeDropdownField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const userType = formikContext.values['user-type'];

  const { errors, touched, values } = formikContext;

  const isInvalid = touched[fieldName] && errors[fieldName];

  if ((userType === 'Homeowner' || isNullOrWhitespace(userType)) && !page.mode.isEditing) {
    return null; // Hide component if user-type is not "Trade Professional"
  }

  return (
    <FieldWrapper {...props}>
      <div className="relative" ref={dropdownContainerRef}>
        <Field
          id={props.rendering.uid}
          name={fieldName}
          as="select"
          value={values[fieldName]}
          className={classNames('relative pr-ml', themeData.classes.input, {
            [themeData.classes.errorOutline]: isInvalid,
            'border-black': values[fieldName],
            'pointer-events-none': page.mode.isEditing,
          })}
        >
          {props.options.map((option: OptionItem) => (
            <option
              key={option.value}
              value={option.value}
              disabled={themeName === 'aw' && option.value === ''}
            >
              {option.label}
            </option>
          ))}
        </Field>
      </div>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(TradeTypeDropdownField_Default);
