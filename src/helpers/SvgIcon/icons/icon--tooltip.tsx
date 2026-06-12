import { JSX } from 'react';
const Tooltip = (): JSX.Element => {
  return (
    <svg
      role="img"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tooltip Icon"
    >
      <rect width="14" height="14" rx="7" fill="black" />
      <path
        d="M6.20312 3.76607C6.20312 3.25536 6.46979 3 7.00313 3C7.53646 3 7.80313 3.25536 7.80313 3.76607C7.80313 4.00943 7.73566 4.19966 7.60072 4.33676C7.46899 4.47044 7.26979 4.53728 7.00313 4.53728C6.46979 4.53728 6.20312 4.28021 6.20312 3.76607ZM7.73566 11H6.26578V5.25193H7.73566V11Z"
        fill="white"
      />
    </svg>
  );
};

export default Tooltip;
