import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconPlus = (props: IconProps): JSX.Element => {
  const { size } = props;
  return (
    <svg
      role="img"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <title>Plus Icon</title>
      <path
        d="M24.0156 13.9052L13.7299 13.9052V24.1909H10.3013V13.9052L0.015625 13.9052L0.015625 10.4766L10.3013 10.4766L10.3013 0.190918L13.7299 0.190918L13.7299 10.4766L24.0156 10.4766V13.9052Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconPlus;
