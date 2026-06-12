import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconArrowRight = (props: IconProps): JSX.Element => {
  const { size } = props;
  const { themeName } = useTheme();
  return themeName === 'aw' ? (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Right Arrow Icon</title>
      <path
        d="M1 1L9 9L1 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Right Arrow Icon</title>
      <path
        d="M9.50019 7.71094L2.00019 15.2109L0.950195 14.1609L7.4002 7.71094L0.950195 1.26094L2.00019 0.210938L9.50019 7.71094Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconArrowRight;
