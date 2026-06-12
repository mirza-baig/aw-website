import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ThemeFile, ThemeName, useTheme } from 'lib/context/ThemeContext';
import { JSX, memo } from 'react';

import { StarRatingTheme } from './StarRating.theme';

export interface StarRatingProps {
  reviewStars: number;
  maxStars?: number;
  containerCSSClass?: string;
  svgCSSClass?: string;
  iconSize?: string;
}

const getGradientDefinition = (
  percent: number,
  frontColor: string,
  backColor: string,
  fillId: string
): JSX.Element => {
  return (
    <defs>
      <linearGradient id={fillId ?? 'grad'}>
        {percent > 0 && <stop offset={percent.toString() + '%'} stopColor={frontColor} />}
        <stop offset="1%" stopColor={backColor ?? 'gray'} />
      </linearGradient>
    </defs>
  );
};

const renderStars = (
  themeData: ThemeFile[ThemeName],
  rating: number,
  maxRating: number,
  gradKey: string,
  themeName: string,
  iconSize?: string
) => {
  const returnValue = [];

  for (let count = 0; count < maxRating; count++) {
    const ratingPercent = rating - count >= 1 ? 100 : Math.max(0, (rating - count) * 100);
    const gradientFillId = (gradKey ?? 'gradient') + count.toString();

    returnValue.push(
      <SvgIcon
        key={gradientFillId}
        icon="star"
        defs={getGradientDefinition(
          ratingPercent,
          themeData.classes.contentClasses.starFillClass,
          '',
          gradientFillId
        )}
        fillId={`url(#${gradientFillId})`}
        className={`${themeName === 'aw' ? 'text-secondary' : 'text-primary'} `}
        size={iconSize}
      />
    );
  }
  return returnValue;
};

const StarRating = ({ ...props }: StarRatingProps): JSX.Element => {
  const { themeName, themeData } = useTheme(StarRatingTheme);
  const maxStars = props?.maxStars ?? 5;
  const gradientKey = 'gradient-' + Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

  // If no content is present, don't print
  if (props?.reviewStars === null) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        themeData.classes.contentClasses.starContainerClass,
        props?.containerCSSClass
      )}
    >
      {renderStars(
        themeData,
        props?.reviewStars,
        maxStars,
        gradientKey,
        themeName,
        props?.iconSize
      )}
    </div>
  );
};

export default memo(StarRating);
