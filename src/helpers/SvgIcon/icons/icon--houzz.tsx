import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconHouzz = (props: IconProps): JSX.Element => {
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
      <title>Houzz Icon</title>
      <circle cx="8.20312" cy="8" r="8" fill={props.fillId || 'white'} />
      <g>
        <path
          d="M4.62598 3.875V11.875H7.30931V9.355H9.09598V11.875H11.7793V7.33167L6.40598 5.79167V3.875H4.62598Z"
          fill={props.fillId ? 'white' : 'black'}
        />
      </g>
      <defs>
        <clipPath>
          <rect width="8" height="8" fill="white" transform="translate(4.20312 3.875)" />
        </clipPath>
      </defs>
    </svg>
  ) : (
    <svg
      role="img"
      width="32"
      height="32"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Houzz Icon</title>
      <circle cx="8.20312" cy="8" r="8" fill={props.fillId || 'white'} />
      <g>
        <path
          d="M4.62598 3.875V11.875H7.30931V9.355H9.09598V11.875H11.7793V7.33167L6.40598 5.79167V3.875H4.62598Z"
          fill={props.fillId ? 'white' : 'black'}
        />
      </g>
      <defs>
        <clipPath>
          <rect width="8" height="8" fill="white" transform="translate(4.20312 3.875)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconHouzz;
