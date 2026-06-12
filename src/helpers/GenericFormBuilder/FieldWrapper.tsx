import { Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import { BodyCopy } from 'helpers/BodyCopy/BodyCopy';
import { Tooltip } from 'helpers/Tooltip/Tooltip';
import { useTheme } from 'lib/context/ThemeContext';
import { getWidthClass } from 'lib/generic-form-builder/utils/get-width-class';
import { replacePlaceholders } from 'lib/generic-form-builder/utils/replace-placeholders';
import { isRuleIncludedInField } from 'lib/generic-form-builder/utils/validation-utils/is-rule-included-in-field';
import { getEnum } from 'lib/utils/get-enum';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { PartialFields } from 'lib/utils/type-utils/partial-fields';
import { JSX } from 'react';

import { FieldWrapperTheme } from './FieldWrapper.Theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type FieldWrapperProps = Sitecore.FieldSets.Forms.FieldNameSettings &
  PartialFields<Sitecore.FieldSets.Forms.ValidationSettings> &
  PartialFields<Sitecore.FieldSets.Forms.Input> &
  PartialFields<Sitecore.FieldSets.Forms.MinMaxLengthSettings> & {
    alignment?: Item;
    isArrayField?: boolean;
    showRequiredIndication?: boolean;
    children?: React.ReactNode | React.ReactNode[];
  };

type Alignment = 'left' | 'center' | 'right';

export const FieldWrapper = (props: FieldWrapperProps): JSX.Element | null => {
  const { themeData } = useTheme(FieldWrapperTheme);

  const { fields, children, showRequiredIndication = true } = props;

  const { errors, touched } = useFormikContext<FormikValues>();

  if (!fields) {
    return null;
  }

  const errorFieldAlignment: Record<Alignment, string> = {
    left: 'justify-left',
    center: 'justify-center',
    right: 'justify-end',
  };

  const fieldName = fields.fieldName?.value;
  if (isNullOrWhitespace(fieldName)) {
    return null;
  }

  const isInvalid = touched[fieldName] && errors[fieldName];

  const placeholders: Record<string, string | number | undefined> = {
    fieldLabel: fields.label?.value,
    minLength: fields.minLength?.value,
    maxLength: fields.maxLength?.value,
  };

  const hasRequiredValidation = isRuleIncludedInField(props, 'required');

  return (
    <div className={classNames('relative', getWidthClass(props))}>
      {fields.label?.value && (
        <label
          className={classNames(
            themeData.classes.label,
            isInvalid ? themeData.classes.errorTextColor : ''
          )}
          htmlFor={fieldName}
        >
          {fields.label.value}
          {showRequiredIndication && hasRequiredValidation ? ' *' : ''}
          <Tooltip {...props} />
        </label>
      )}
      {children}
      {fields.subLabel?.value && (
        <BodyCopy fields={{ body: fields.subLabel }} classes={themeData.classes.subLabel} />
      )}
      {touched[fields.fieldName?.value] && errors[fields.fieldName.value] && (
        <span
          className={classNames(
            themeData.classes.errorMessage,
            themeData.classes.errorTextColor,
            errorFieldAlignment[getEnum<Alignment>(props.alignment) || 'left']
          )}
        >
          {replacePlaceholders(errors[fields.fieldName?.value] as string, placeholders)}
        </span>
      )}
    </div>
  );
};
