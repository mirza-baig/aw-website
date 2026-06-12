import { Text } from '@sitecore-content-sdk/nextjs';

import { SubCategroyBarProps } from './ComparisonTable.Types';

export const SubCategoryTitle = (props: SubCategroyBarProps & { isMobile?: boolean }) => {
  return (
    <div
      // style={{ top: props.isMobile ? '208px' : '0' }} //dekstop '284px - 32px'
      className="sticky left-0 right-0 w-full bg-light-gray py-xxs text-center text-black"
    >
      <div className="font-sans text-small font-heavy ml:text-xxs">
        <Text tag="h3" field={{ value: props.subTitle }} />
      </div>
    </div>
  );
};
