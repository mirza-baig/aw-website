import classNames from 'classnames';
import { Field, FormikValues, getIn, useFormikContext } from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { CustomErrorMessage } from './CustomErrorMessage';
import { FormFieldsTheme } from './FormFields.Theme';

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  subLabel?: string;
  isRequired?: boolean;
  columnClasses?: string;
  dependency?: {
    dependentField: string;
    Value: string;
    resetValue: string;
  };
};
export const InputText = ({
  id,
  name,
  label,
  subLabel,
  isRequired,
  columnClasses: _columnClasses,
  dependency: _dependency,
  placeholder,
  ...restProps
}: InputTextProps): JSX.Element => {
  // const { id, name, label, subLabel } = props;
  const { themeData } = useTheme(FormFieldsTheme);

  const { errors, touched, values } = useFormikContext<FormikValues>();

  if (!name) {
    return <></>;
  }

  const isInvalid = getIn(errors, name) && getIn(touched, name);
  const normalizedPlaceholder =
    typeof placeholder === 'string'
      ? placeholder
      : typeof placeholder === 'object' && placeholder !== null
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((placeholder as any).value ?? '')
        : '';

  return (
    <div className={classNames('relative')}>
      {label && (
        <label
          className={classNames(
            themeData.classes.label,
            isInvalid ? themeData.classes.errorTextColor : ''
          )}
          htmlFor={id}
        >
          {label}
          {isRequired ? ' *' : ''}
        </label>
      )}
      <Field
        {...restProps}
        id={id}
        name={name}
        placeholder={normalizedPlaceholder}
        className={classNames(
          themeData.classes.input,
          isInvalid ? themeData.classes.errorOutline : '',
          values[name] ? 'border-black' : ''
        )}
      />
      {subLabel && (
        <BodyCopy fields={{ body: { value: subLabel } }} classes={themeData.classes.subLabel} />
      )}
      <CustomErrorMessage fieldName={name} />
    </div>
  );
};
