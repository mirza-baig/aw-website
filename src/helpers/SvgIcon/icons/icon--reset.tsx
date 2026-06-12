import { IconProps } from '../SvgIcon';

const IconReset = (props: IconProps) => {
  const width = props?.size ?? '14';
  const height = props?.size ?? '16';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9425 3.05314C10.6729 1.7836 8.93058 0.995605 6.99562 0.995605C3.1257 0.995605 0 4.13006 0 7.99998C0 11.8699 3.1257 15.0044 6.99562 15.0044C10.2614 15.0044 12.9844 12.7717 13.7636 9.75108H11.9425C11.2245 11.7911 9.2808 13.2533 6.99562 13.2533C4.09756 13.2533 1.74234 10.898 1.74234 7.99998C1.74234 5.10192 4.09756 2.7467 6.99562 2.7467C8.44903 2.7467 9.74484 3.35083 10.6904 4.30517L7.87117 7.12444H14V0.995605L11.9425 3.05314Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconReset;
