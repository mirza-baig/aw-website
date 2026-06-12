import classNames from 'classnames';
export const ProductCardDot = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={classNames(
        'mx-[6px] mb-s h-xxs w-xxs rounded-full bg-gray',
        isActive && '!bg-black'
      )}
    ></div>
  );
};
