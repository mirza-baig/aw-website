import { JSX } from 'react';

type IconTickProps = {
  className?: string;
};
const IconTick = ({ className }: IconTickProps): JSX.Element => {
  return (
    <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
      <path
        d="M5.2 12.7L9.6 17.1L18.2 7.2"
        stroke="white"
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconTick;
