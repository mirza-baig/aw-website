import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconArrowLeft = (props: IconProps): JSX.Element => {
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
      <title>Left Arrow Icon</title>
      <path
        d="M9 17L1 9L9 0.999999"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Left Arrow Icon</title>
      <path
        d="M0.5 7.71094L8 0.210938L9.05 1.26094L2.6 7.71094L9.05 14.1609L8 15.2109L0.5 7.71094Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconArrowLeft;
