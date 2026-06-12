import classNames from 'classnames';

export type PriceLevelProps = {
  priceLevel: number | undefined;
  priceClasses: string;
  priceLevelClasses: string;
};

const PriceLevel = ({ priceLevel, priceClasses, priceLevelClasses }: PriceLevelProps) => {
  if (typeof priceLevel !== 'number') {
    return <></>;
  }
  return (
    <div className={classNames(priceClasses)}>
      {Array(5)
        .fill('')
        .map((_, index) => (
          <span key={index} className={classNames(index < priceLevel && priceLevelClasses)}>
            $
          </span>
        ))}
    </div>
  );
};
export default PriceLevel;
