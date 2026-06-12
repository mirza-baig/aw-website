import { CategroyBarProps } from './ComparisonTable.Types';

export const CategoryTitle = (props: CategroyBarProps & { isMobile: boolean }) => {
  return (
    <div className="w-full">
      <div className="!font-sans text-[11px] font-heavy uppercase tracking-wider text-[#c45500]">
        Compare
      </div>
      <h2 className="!font-serif text-sm-s font-regular text-black ml:text-sm-m">
        {props.title || ''}
      </h2>
    </div>
  );
};
