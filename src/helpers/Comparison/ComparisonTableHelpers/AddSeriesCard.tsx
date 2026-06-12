import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';

export const AddSeriesCard = ({ isSticked }: { isSticked: boolean }) => {
  return (
    <div
      className={classNames(
        'relative mx-auto flex h-full min-h-[156px] w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-gray text-center font-sans! text-small font-heavy text-darkprimary ml:min-h-[185px] ml:text-xxs',
        isSticked && 'z-20 min-h-[50px]!'
      )}
    >
      <div tabIndex={0} className={classNames(!isSticked && 'mb-xxs')}>
        <SvgIcon
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          icon="plus"
          size={isSticked ? 'md' : 'lg'}
        />
      </div>
      <span className="font-serif! text-body font-regular text-black">Select Series</span>
    </div>
  );
};
