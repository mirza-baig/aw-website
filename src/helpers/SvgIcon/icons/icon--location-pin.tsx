import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconLocationPin = (props: IconProps): JSX.Element => {
  const { themeName } = useTheme();
  return themeName === 'aw' ? (
    <svg
      role="img"
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Location Pin Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.1848 16.365C4.7748 18.715 7.1798 21.26 10.3998 24C13.6198 21.26 16.0248 18.715 17.6148 16.365C19.2048 14.015 19.9998 11.84 19.9998 9.84C19.9998 6.84 19.0348 4.45 17.1048 2.67C15.1748 0.89 12.9398 0 10.3998 0C7.85981 0 5.6248 0.89 3.6948 2.67C1.7648 4.45 0.799805 6.84 0.799805 9.84C0.799805 11.84 1.5948 14.015 3.1848 16.365ZM10.2998 14C12.7851 14 14.7998 11.9853 14.7998 9.5C14.7998 7.01472 12.7851 5 10.2998 5C7.81452 5 5.7998 7.01472 5.7998 9.5C5.7998 11.9853 7.81452 14 10.2998 14Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props?.size === 'any' ? 7 : props?.size}
      height={props?.size === 'any' ? 10 : props?.size}
      viewBox="0 0 7 10"
      fill="none"
    >
      <path
        d="M3.5 0C1.565 0 0 1.565 0 3.5C0 6.125 3.5 10 3.5 10C3.5 10 7 6.125 7 3.5C7 1.565 5.435 0 3.5 0ZM3.5 4.75C2.81 4.75 2.25 4.19 2.25 3.5C2.25 2.81 2.81 2.25 3.5 2.25C4.19 2.25 4.75 2.81 4.75 3.5C4.75 4.19 4.19 4.75 3.5 4.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconLocationPin;
