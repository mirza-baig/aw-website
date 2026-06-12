import { useTheme } from 'lib/context/ThemeContext';
import { JSX } from 'react';

const IconCaret = (): JSX.Element => {
  const { themeName } = useTheme();

  return themeName === 'aw' ? (
    <svg
      role="img"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Caret Icon</title>
      <path d="M5.5 6.75732L9.74264 11L13.9853 6.75732" stroke="black" />
      <circle cx="9.5" cy="9" r="8.5" transform="rotate(-180 9.5 9)" stroke="black" />
    </svg>
  ) : (
    <svg
      role="img"
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Caret Icon</title>
      <path
        d="M11.56 0.000472897L6.87216 4.67806L2.18436 0.000472077L0.744314 1.44051L6.87216 7.56836L13 1.44052L11.56 0.000472897Z"
        fill="black"
      />
    </svg>
  );
};

export default IconCaret;
