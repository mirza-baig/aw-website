import classNames from 'classnames';
import { FormikValues, useFormikContext } from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Tooltip from 'helpers/Tooltip/Tooltip';
import { useTheme } from 'lib/context/ThemeContext';
import { FormsContext } from 'lib/custom-forms/FormContext';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import {
  getWidthClass,
  isRuleIncludedInField,
  replacePlaceholders,
} from 'lib/custom-forms/FormFieldUtils';
import { getEnum } from 'lib/utils/get-enum';
import { useContext } from 'react';

import { FieldWrapperTheme } from './FieldWrapper.Theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type FieldWrapperProps = Sitecore.FieldSets.Forms.Input &
  FormFieldProps & {
    isArrayField?: boolean;
    showRequiredIndication?: boolean;
    children?: React.ReactNode | React.ReactNode[];
  };

type Alignment = 'left' | 'center' | 'right';

const FieldWrapper = (props: FieldWrapperProps) => {
  const { themeData } = useTheme(FieldWrapperTheme);

  const { fields, id, isArrayField, children, showRequiredIndication = true } = props;

  const { errors, touched } = useFormikContext<FormikValues>();
  const { formProps } = useContext(FormsContext);

  const errorFieldAlignment: Record<Alignment, string> = {
    left: 'justify-left',
    center: 'justify-center',
    right: 'justify-end',
  };
  const IS_HORIZONTAL_FORM = formProps?.isHorizontalForm ?? false;

  const isInvalid = touched[fields.fieldName?.value] && errors[fields.fieldName?.value];

  const placeholders: Record<string, string> = {
    fieldLabel: fields.label?.value,
    minLength: fields.minLength?.value,
    maxLength: fields.maxLength?.value,
  };

  if (!fields) {
    return <></>;
  }

  return (
    <div className={classNames('relative', getWidthClass(props))}>
      {fields.label?.value && (
        <label
          className={classNames(
            themeData.classes.label,
            isInvalid ? themeData.classes.errorTextColor : '',
            { 'whitespace-nowrap': IS_HORIZONTAL_FORM }
          )}
          htmlFor={id}
        >
          {fields.label.value}
          {showRequiredIndication && isRuleIncludedInField(props, isArrayField ? 'min' : 'required')
            ? ' *'
            : ''}
          <Tooltip {...props} />
        </label>
      )}
      {children}
      {fields.subLabel?.value && (
        <BodyCopy fields={{ body: fields?.subLabel }} classes={themeData.classes.subLabel} />
      )}
      {touched[fields.fieldName?.value] && errors[fields.fieldName?.value] && (
        <span
          className={classNames(
            themeData.classes.errorMessage,
            themeData.classes.errorTextColor,
            errorFieldAlignment[getEnum<Alignment>(props?.fields?.alignment) ?? 'left']
          )}
        >
          {replacePlaceholders(errors[fields.fieldName?.value] as string, placeholders)}
        </span>
      )}
    </div>
  );
};

export default FieldWrapper;
