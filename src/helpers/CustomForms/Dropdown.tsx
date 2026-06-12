import classNames from 'classnames';
import { Field, FormikValues, getIn, useFormikContext } from 'formik';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { ChangeEvent, FocusEvent, JSX, useRef, useState } from 'react';

import { CustomErrorMessage } from './CustomErrorMessage';
import { FormFieldsTheme } from './FormFields.Theme';

export type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  name: string;
  options?: Array<Record<'label' | 'value', string>>;
  enableInlineOptionsRendering?: boolean;
  label?: string;
  isRequired?: boolean;
  columnClasses?: string;
  children?: React.ReactNode;
};
const Dropdown = ({
  id,
  name = '',
  options,
  children,
  label,
  enableInlineOptionsRendering = true,
  isRequired,
  columnClasses: _columnClasses,
  value: _ignoredValue,
  defaultValue: _ignoredDefaultValue,
  ...restProps
}: DropdownProps): JSX.Element => {
  const { themeData } = useTheme(FormFieldsTheme);
  const { errors, touched, values, handleChange, handleBlur } = useFormikContext<FormikValues>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const isInvalid = getIn(errors, name) && getIn(touched, name);

  return (
    <div className="">
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
      <div className="relative" ref={dropdownContainerRef}>
        <Field
          id={id}
          name={name}
          as="select"
          value={getIn(values, name) ?? ''}
          onClick={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          onBlur={(e: FocusEvent<HTMLSelectElement>) => {
            setIsDropdownOpen(false);
            handleBlur(e);
          }}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setIsDropdownOpen(false);
            handleChange(e);
          }}
          className={classNames(
            'relative z-9 cursor-pointer bg-transparent bg-none pr-ml',
            themeData.classes.input,
            isInvalid ? themeData.classes.errorOutline : '',
            values[name] ? 'border-black' : ''
          )}
          {...restProps}
        >
          {children}
          {enableInlineOptionsRendering &&
            // Map over options
            options?.map((option: Record<string, string>) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </Field>
        <div
          className={`absolute right-xs top-1/2 -translate-y-1/2 transform transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        >
          <SvgIcon icon="dropdown-arrow" />
        </div>
      </div>
      <CustomErrorMessage fieldName={name} />
    </div>
  );
};
export default Dropdown;
