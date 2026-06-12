import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconExternalLink = (props: IconProps): JSX.Element => {
  const width = props?.size || '17';
  const height = props?.size || '18';

  return (
    <svg
      role="img"
      width={width}
      height={height}
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>External Link Icon</title>
      <path d="M6.15674 4.40379H13.2278V11.4749" stroke="currentColor" strokeWidth="2" />
      <path d="M13.228 4.4038L4.03564 13.5962" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default IconExternalLink;
