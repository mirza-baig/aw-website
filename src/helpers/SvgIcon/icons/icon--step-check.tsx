import { JSX } from 'react';

interface IconStepCheckProps {
  size?: number;
  variant?: 'completed' | 'active' | 'inactive';
}

const IconStepCheck = ({ size = 40, variant = 'completed' }: IconStepCheckProps): JSX.Element => {
  const isCompleted = variant === 'completed';
  const isInactive = variant === 'inactive';

  const circleStroke = isInactive ? '#C4BFB6' : '#f26924';
  const circleFill = isCompleted ? '#f26924' : 'white';

  let checkStroke: string;
  if (isCompleted) {
    checkStroke = 'white';
  } else if (isInactive) {
    checkStroke = '#C4BFB6';
  } else {
    checkStroke = '#f26924';
  }

  return (
    <svg
      aria-label="description of the image"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{isCompleted ? 'Step Complete' : 'Step Active'}</title>
      {/* Circle */}
      <circle cx="20" cy="20" r="18" stroke={circleStroke} strokeWidth="2.5" fill={circleFill} />
      {/* Checkmark */}
      <path
        d="M12 20.5L17.5 26L28 14.5"
        stroke={checkStroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default IconStepCheck;
