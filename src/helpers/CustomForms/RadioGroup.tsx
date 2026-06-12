import classNames from 'classnames';
import { Field, FormikValues, getIn, useFormikContext } from 'formik';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX, useEffect } from 'react';

import { CustomErrorMessage } from './CustomErrorMessage';
import { FormFieldsTheme } from './FormFields.Theme';

export type RadioGroupProps = {
  name: string;
  options: Array<Record<'id' | 'value' | 'label', string>>;
  label?: string;
};

const RadioGroup = ({ name = '', options, label }: RadioGroupProps): JSX.Element => {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, setFieldTouched, setFieldValue } =
    useFormikContext<FormikValues>();

  const isInvalid = getIn(errors, name) && getIn(touched, name);

  const aboutValue = values['about'];

  useEffect(() => {
    if (aboutValue !== 'professional') {
      setFieldValue('trades', '');
      setFieldValue('company', '');
      setFieldValue('title', '');
    }
    setFieldTouched('trades', false);
    setFieldTouched('company', false);
    setFieldTouched('title', false);
    setFieldTouched('address1', false);
    setFieldTouched('city', false);
    setFieldTouched('state', false);
  }, [aboutValue, setFieldTouched, setFieldValue]);

  return (
    <div>
      {label && <label className={classNames(themeData.classes.label, 'mb-xxxs')}>{label}</label>}
      {options?.map((item) => {
        return (
          <div key={`radioOption-${item.id}`} className="relative mb-s last:mb-0">
            <label htmlFor={item.id} className="inline-flex">
              <Field
                type="radio"
                id={item.id}
                value={item.value}
                name={name}
                className={classNames(
                  'peer h-[20px] w-[20px] cursor-pointer appearance-none  border-2 border-dark-gray ring-0  checked:h-[18px] checked:w-[18px] checked:border-white checked:bg-primary! checked:bg-none checked:ring-2! checked:ring-black! checked:ring-offset-0 hover:border-black checked:hover:border-white focus:bg-gray focus:ring-0 checked:focus:border-white',
                  isInvalid ? themeData.classes.errorOutline : ''
                )}
              />

              <span
                className={classNames(
                  themeData.classes.label,
                  'ml-xxs cursor-pointer text-dark-gray peer-checked:text-black peer-hover:text-black'
                )}
              >
                {item.label}
              </span>
            </label>
          </div>
        );
      })}
      <CustomErrorMessage fieldName={name} />
    </div>
  );
};

export default RadioGroup;
