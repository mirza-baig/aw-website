'use client';

import { Page } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { Field, FormikValues, useFormikContext } from 'formik';
import FieldWrapper from 'helpers/CustomForms/FieldWrapper';
import { FormFieldsTheme } from 'helpers/GenericFormBuilder/FormFields.Theme';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { OptionItem } from 'lib/generic-form-builder/utils/get-option-items';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { JSX, useRef } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type DropdownProps = ComponentProps &
  Sitecore.Forms.GenericFormBuilder.Fields.Dropdown.DropdownField & {
    options: OptionItem[];
    page: Page;
  };

function DropdownField_Default(props: DropdownProps): JSX.Element | null {
  const { themeName, themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();
  const { page } = props;

  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const fieldName = page.mode.isEditing ? 'DropdownField' : props.fields?.fieldName.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isInvalid = touched[fieldName] && errors[fieldName];

  return (
    <FieldWrapper {...props}>
      <div className="relative" ref={dropdownContainerRef}>
        <Field
          id={props.rendering.uid}
          name={fieldName}
          as="select"
          value={values[fieldName]}
          className={classNames(
            'relative cursor-pointer bg-[white] bg-none pr-ml',
            themeData.classes.input,
            {
              [themeData.classes.errorOutline]: isInvalid,
              'border-black': values[fieldName],
              'pointer-events-none': page.mode.isEditing,
            }
          )}
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
        <div className="pointer-events-none absolute right-xs top-1/2 -translate-y-1/2  ">
          <SvgIcon icon="dropdown-arrow" />
        </div>
      </div>
    </FieldWrapper>
  );
}

export const Default = withDatasourceCheck(DropdownField_Default);
