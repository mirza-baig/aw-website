import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconDropdownArrow = (props: IconProps): JSX.Element => {
  const width = props?.size ?? '13';
  const height = props?.size ?? '8';

  return (
    <svg
      role="img"
      width={width}
      height={height}
      viewBox="0 0 13 8"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Select Dropdown Arrow</title>
      <path d="M11.56 0.216293L6.87216 4.89388L2.18436 0.216292L0.744314 1.65634L6.87216 7.78418L13 1.65634L11.56 0.216293Z" />
    </svg>
  );
};

export default IconDropdownArrow;
