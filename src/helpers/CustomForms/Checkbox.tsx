import classNames from 'classnames';
import { Field, FormikValues, getIn, useFormikContext } from 'formik';
import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { CustomErrorMessage } from './CustomErrorMessage';
import { FormFieldsTheme } from './FormFields.Theme';

export type CheckboxProps = {
  name: string;
  options: Array<Partial<Record<'id' | 'value' | 'label', string>>>;
  label?: string;
};

const Checkbox = ({ name, options, label }: CheckboxProps): JSX.Element => {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched } = useFormikContext<FormikValues>();

  if (!name || !options) {
    return <></>;
  }

  const isInvalid = getIn(errors, name) && getIn(touched, name);

  return (
    <>
      {label && <label className={classNames(themeData.classes.label, 'mb-xxxs')}>{label}</label>}
      {options?.map((item) => {
        return (
          <div key={`checkboxOption-${item.id}`} className="relative mb-m flex">
            <label htmlFor={item.id} className="inline-flex">
              <Field
                type="checkbox"
                id={item.id}
                value={item.value}
                name={name}
                className={classNames(
                  'peer h-[20px] w-[20px] cursor-pointer appearance-none border border-dark-gray checked:bg-black! hover:border-black focus:bg-gray focus:ring-0!',
                  themeData.classes.checkbox,
                  isInvalid ? themeData.classes.errorOutline : ''
                )}
              />

              <span
                className={classNames(themeData.classes.label, 'ml-xxs cursor-pointer text-black!')}
              >
                {item.label}
              </span>
            </label>
          </div>
        );
      })}
      <CustomErrorMessage fieldName={name} />
    </>
  );
};

export default Checkbox;
