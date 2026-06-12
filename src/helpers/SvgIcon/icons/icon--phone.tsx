import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconPhone = (props: IconProps): JSX.Element => {
  const { size } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
    >
      <title>Phone Icon</title>
      <g>
        <path
          d="M13.999 10.3067L10.4856 9.9L8.80563 11.58C6.91896 10.62 5.37229 9.08 4.41229 7.18667L6.09896 5.5L5.69229 2H2.01896C1.63229 8.78667 7.21229 14.3667 13.999 13.98V10.3067Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath>
          <rect width={16} height={16} fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconPhone;
