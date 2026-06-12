import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconChatOutline = (props: IconProps): JSX.Element => {
  const { size } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <title>Chat Outline Icon</title>
      <path d="M20 0H0V20L4 16H20V0ZM18 14H4L2 16V2H18V14Z" fill="currentColor" />
    </svg>
  );
};

export default IconChatOutline;
