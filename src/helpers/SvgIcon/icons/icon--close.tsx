import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconClose = (props: IconProps): JSX.Element => {
  const { size } = props;

  return (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close Icon</title>
      <path
        d="M12 1.56941L10.7914 0.36084L6 5.15227L1.20857 0.36084L0 1.56941L4.79143 6.36084L0 11.1523L1.20857 12.3608L6 7.56941L10.7914 12.3608L12 11.1523L7.20857 6.36084L12 1.56941Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconClose;
