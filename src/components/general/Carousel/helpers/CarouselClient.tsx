'use client';

import classNames from 'classnames';
import { BackgroundColor } from 'helpers/Carousel/Carousels.helper';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { Subheadline } from 'helpers/Subheadline';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX, ReactNode } from 'react';

import { CarouselTheme } from './Carousel.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type CarouselProps = Sitecore.Components.General.Carousel.Carousel & {
  placeholder: ReactNode;
};

export function CarouselClient(props: CarouselProps): JSX.Element {
  const { themeData } = useTheme(CarouselTheme);

  const containerWidth =
    getEnum<'fullBleed' | 'fullWidth'>(props.fields?.containerWidth) ?? 'fullWidth';

  return (
    <Component
      variant={containerWidth === 'fullBleed' ? 'full' : 'lg'}
      sectionWrapperClasses=""
      backgroundVariant={
        containerWidth === 'fullBleed'
          ? (getEnum<BackgroundColor>(props.fields?.backgroundColor) ?? '')
          : ''
      }
      dataComponent="general/carousel"
      {...props}
    >
      <div className={classNames('carousel-slider col-span-12')}>
        <Headline classes={themeData.classes.headlineClass} {...props} />
        <Subheadline classes={themeData.classes.subHeadlineClass} {...props} />
        <div className="carousel-slider">{props.placeholder}</div>
        <SingleButton classes={themeData.classes.buttonClass} {...props} />
      </div>
    </Component>
  );
}
