import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconPause = (props: IconProps): JSX.Element => {
  const { size } = props;
  return (
    <svg
      role="img"
      width={size || 40}
      height={size || 40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Pause Icon</title>
      <rect width={40} height={40} rx={20} fill="white" />
      <rect x={13} y={12} width={5} height={16} fill="black" />
      <rect x={22} y={12} width={5} height={16} fill="black" />
    </svg>
  );
};

export default IconPause;
