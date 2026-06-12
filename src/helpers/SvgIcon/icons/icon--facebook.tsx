import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

const IconFacebook = (): JSX.Element => {
  const { themeName } = useTheme();
  return themeName === 'aw' ? (
    <svg
      role="img"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Facebook Icon</title>
      <path
        d="M16.2031 8C16.2031 3.584 12.6191 0 8.20312 0C3.78713 0 0.203125 3.584 0.203125 8C0.203125 11.872 2.95513 15.096 6.60313 15.84V10.4H5.00313V8H6.60313V6C6.60313 4.456 7.85912 3.2 9.40312 3.2H11.4031V5.6H9.80313C9.36313 5.6 9.00313 5.96 9.00313 6.4V8H11.4031V10.4H9.00313V15.96C13.0431 15.56 16.2031 12.152 16.2031 8Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg
      role="img"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Facebook Icon</title>
      <path
        d="M32 16C32 7.168 24.832 0 16 0C7.168 0 0 7.168 0 16C0 23.744 5.504 30.192 12.8 31.68V20.8H9.6V16H12.8V12C12.8 8.912 15.312 6.4 18.4 6.4H22.4V11.2H19.2C18.32 11.2 17.6 11.92 17.6 12.8V16H22.4V20.8H17.6V31.92C25.68 31.12 32 24.304 32 16Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconFacebook;
