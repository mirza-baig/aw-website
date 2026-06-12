import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const IconZoomPinch = (props: IconProps): JSX.Element => {
  const width = props?.size ?? '40';
  const height = props?.size ?? '40';

  return (
    <svg
      role="img"
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Zoom Pinch Icon</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.03415 34.8248L16.0741 21.7849L18.2171 23.9278L5.17712 36.9678L17.1456 36.9785L17.1456 40.0001L0.0018425 40.0001L0.001844 22.8564L3.03415 22.8456L3.03415 34.8248ZM36.9677 5.17518L23.9277 18.2152L21.7848 16.0722L34.8247 3.03221L22.8562 3.02149L22.8562 -9.68662e-05L40 -9.53674e-05L40 17.1437L36.9677 17.1544L36.9677 5.17518Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconZoomPinch;
