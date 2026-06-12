import classNames from 'classnames';
import { FormikValues, getIn, useFormikContext } from 'formik';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { FormFieldsTheme } from './FormFields.Theme';

type CustomErrorMessageProps = { fieldName: string };

export const CustomErrorMessage = ({ fieldName }: CustomErrorMessageProps): JSX.Element => {
  const { themeData } = useTheme(FormFieldsTheme);

  const { errors, touched } = useFormikContext<FormikValues>();

  const error = getIn(errors, fieldName);
  const touch = getIn(touched, fieldName);

  if (touch && error) {
    return (
      <span
        className={classNames(themeData.classes.errorMessage, themeData.classes.errorTextColor)}
      >
        {error}
      </span>
    );
  }
  return <></>;
};
