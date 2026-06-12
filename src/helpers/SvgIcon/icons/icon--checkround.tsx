import { JSX } from 'react';
const IconCheck = (): JSX.Element => {
  return (
    <svg
      role="img"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Check Icon</title>
      <circle cx="12" cy="12" r="10" fill="white" /> {/* Rounded white background */}
      <path
        d="M6 12L10 16L18 8"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconCheck;
