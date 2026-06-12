import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconChat = (props: IconProps): JSX.Element => {
  const { size } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Chat Icon</title>
      <path d="M12 0H0V12L2.4 9.6H12V0Z" fill="currentColor" />
    </svg>
  );
};

export default IconChat;
