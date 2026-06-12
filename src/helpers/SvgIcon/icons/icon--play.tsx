import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconPause = (props: IconProps): JSX.Element => {
  const { size } = props;
  return (
    <svg
      width={size || 42}
      height={size || 42}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 64C14.328 64 0 49.672 0 32C0 14.328 14.328 0 32 0C49.672 0 64 14.328 64 32C64 49.672 49.672 64 32 64ZM24 16.024V47.976L48 32L24 16.024Z"
        fill="white"
      />
    </svg>
  );
};

export default IconPause;
