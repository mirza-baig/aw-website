import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

export interface IconStarProps {
  children?: React.ReactNode | React.ReactNode[];
  fillId?: string;
  size?: string;
}

const IconStar = ({ children, fillId, size }: IconStarProps): JSX.Element => {
  const { themeName } = useTheme();
  return themeName === 'aw' ? (
    <svg
      role="img"
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!children && children}
      <title>Star Icon</title>
      <path
        d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
        fill={fillId || 'currentColor'}
      />
    </svg>
  ) : (
    <svg
      role="img"
      width={size || '16'}
      height={size || '15'}
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!children && children}
      <title>Star Icon</title>
      <path
        d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
        fill={fillId || 'currentColor'}
      />
    </svg>
  );
};

export default IconStar;
