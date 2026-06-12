import { JSX } from 'react';

import { IconProps } from '../SvgIcon';

const Cube = (props: IconProps): JSX.Element => {
  const width = props?.size ?? '20';
  const height = props?.size ?? '20';

  return (
    <svg
      role="img"
      width={width}
      height={height}
      viewBox="0 0 1200 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Cube</title>
      <path
        fill="currentColor"
        d="m912.21 375.49-312.21-114.79-312.47 114.7-11.531 4.2266v442.13l312 113.2 12 4.3555 12-4.3555 312-113.2v-441.94zm-324.21 533.91-288-104.48v-399.45l205.15 74.426 82.848 30.059zm12-420.64-147.56-53.531-129.89-47.137 277.45-101.82 277.2 101.91zm300 316.16-288 104.48v-399.46l288-104.06z"
      />
    </svg>
  );
};

export default Cube;
