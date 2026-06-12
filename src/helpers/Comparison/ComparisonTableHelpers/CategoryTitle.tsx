import { Link, Text } from '@sitecore-content-sdk/nextjs';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';

import { CategroyBarProps } from './ComparisonTable.Types';

export const CategoryTitle = (props: CategroyBarProps & { isMobile: boolean }) => {
  return (
    <div
      // style={{ top: props.isMobile ? '148px' : '0' }} //dekstop '225px - 32'
      className="sticky right-0 left-0 flex min-h-[62px] w-full flex-col items-center justify-center bg-black py-xs text-white"
    >
      <div className="mb-xxxs font-sans text-base font-heavy ml:text-xs">
        <Text tag="h2" field={{ value: props.title }} />
      </div>
      {props.cta?.href && (
        <div className="flex items-center justify-center text-small">
          <Link field={props.cta} />
          <SvgIcon icon="arrow" className="ml-xxxs" />
        </div>
      )}
    </div>
  );
};
