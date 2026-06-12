import classNames from 'classnames';
import { Field, FieldProps, FormikValues, getIn, useFormikContext } from 'formik';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';
import { MaskedInput } from 'react-text-mask-modern'; // Correct import

import { CustomErrorMessage } from './CustomErrorMessage';
import { FormFieldsTheme } from './FormFields.Theme';

type InputPhoneProps = Partial<HTMLInputElement> & {
  label?: string;
  subLabel?: string;
};

export const InputPhone = (props: InputPhoneProps): JSX.Element => {
  const { id, name, label, subLabel } = props;
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values } = useFormikContext<FormikValues>();

  if (!name) {
    return <></>;
  }

  const isInvalid = getIn(errors, name) && getIn(touched, name);

  // Define the phone number mask as an array of regex patterns
  const phoneMask = [
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

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
          {props.required ? ' *' : ''}
        </label>
      )}

      <Field name={name}>
        {({ field }: FieldProps) => (
          <MaskedInput
            {...field}
            id={id}
            mask={phoneMask} // Use the array-based mask
            placeholder={'(###) ###-####'}
            type="tel"
            className={classNames(
              themeData.classes.input,
              isInvalid ? themeData.classes.errorOutline : '',
              values[name] ? 'border-black' : ''
            )}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(event);
            }}
          />
        )}
      </Field>

      {subLabel && (
        <BodyCopy fields={{ body: { value: subLabel } }} classes={themeData.classes.subLabel} />
      )}
      <CustomErrorMessage fieldName={name} />
    </div>
  );
};
