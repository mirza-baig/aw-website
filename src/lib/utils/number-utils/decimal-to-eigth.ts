import { Fractions } from './fractions';
import { RoundingDirections } from './rounding-directions';

const OptionDefault = {
  roundingDirection: RoundingDirections.closest,
};

type Options = {
  roundingDirection: RoundingDirections;
};

export const decimalToEigth = (number: number, options: Options) => {
  const decimal = number - Math.floor(number);

  options = {
    ...OptionDefault,
    ...options,
  };

  let eigths = Fractions.eigths;
  if (options.roundingDirection === RoundingDirections.up) {
    eigths = eigths.filter((element) => element.decimal >= decimal);
  } else if (options.roundingDirection === RoundingDirections.down) {
    eigths = eigths.filter((element) => element.decimal <= decimal);
  }

  eigths.sort(function (a, b) {
    const differenceA = Math.abs(decimal - a.decimal);
    const differenceB = Math.abs(decimal - b.decimal);
    return differenceA - differenceB;
  });

  return eigths[0]?.fraction;
};
