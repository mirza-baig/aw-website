import Image from 'next/image';
import { JSX } from 'react';

import spinner from '../../assets/img/spinner.png';

const Spinner = ({ size }: { size: number }): JSX.Element => {
  return (
    <Image
      src={spinner}
      width={size || 56}
      height={size || 56}
      layout="fixed"
      className="animate-spin"
      alt="loading spinner"
    />
  );
};
export default Spinner;
