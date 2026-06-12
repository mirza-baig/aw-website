import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconMinus = (props: IconProps): JSX.Element => {
  const { themeName } = useTheme();
  const { size } = props;
  return themeName === 'aw' ? (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={size}
      height="4"
      viewBox="0 0 18 4"
      stroke="currentColor"
    >
      <title>Minus Icon</title>
      <path d="M0 2H18" strokeWidth="3" />
    </svg>
  ) : (
    <svg
      role="img"
      width={size}
      height="5"
      viewBox="0 0 27 5"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Minus Icon</title>
      <path
        d="M25.0156 4.11261H25.5156V3.61261V1.61261V1.11261H25.0156L14.7299 1.11261L11.3013 1.11261L1.01562 1.11261L0.515625 1.11261V1.61261L0.515625 3.61261V4.11261H1.01563L11.3013 4.11261H14.7299L25.0156 4.11261Z"
        strokeWidth="4"
      />
    </svg>
  );
};
export default IconMinus;
