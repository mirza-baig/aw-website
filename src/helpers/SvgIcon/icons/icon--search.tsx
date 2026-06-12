import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconSearch = (props: IconProps): JSX.Element => {
  const { size } = props;

  return (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Search Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5274 4.57599C13.7069 6.75552 13.7069 10.2892 11.5274 12.4688C9.34789 14.6483 5.81418 14.6483 3.63465 12.4688C1.45512 10.2892 1.45512 6.75552 3.63465 4.57599C5.81418 2.39646 9.34789 2.39646 11.5274 4.57599ZM13.6019 13.1305C15.8828 10.158 15.6628 5.8829 12.9416 3.16178C9.98106 0.201201 5.18101 0.201201 2.22043 3.16178C-0.740144 6.12236 -0.740144 10.9224 2.22043 13.883C4.94106 16.6036 9.21506 16.8241 12.1875 14.5445L16.7017 19.0587L18.1159 17.6445L13.6019 13.1305Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconSearch;
