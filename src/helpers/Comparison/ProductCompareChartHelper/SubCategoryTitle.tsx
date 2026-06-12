import { SubCategroyBarProps } from './ComparisonTable.Types';

export const SubCategoryTitle = (props: SubCategroyBarProps & { isMobile?: boolean }) => {
  if (!props.subTitle) {
    return null;
  }
  return (
    <div className="w-full border-b border-[#e0e0e0] bg-white py-xxs pl-xxs">
      <span className="!font-sans text-small font-heavy text-black">{props.subTitle}</span>
    </div>
  );
};
