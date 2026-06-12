import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { paginationStyle } from 'helpers/Carousel/Carousels.helper';
import { SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
import { ComponentProps } from 'lib/component-props';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { CarouselClient } from './helpers/CarouselClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type CarouselProps = ComponentProps & Sitecore.Components.General.Carousel.Carousel;

function Carousel_Default(props: CarouselProps): JSX.Element {
  const paginationStyle = getEnum<paginationStyle>(props.fields?.carouselStyle) ?? 'dots';
  const loop = props.fields?.loop?.value ?? true;
  const autoplay = props.fields?.autoplay?.value ?? false;
  const autoPlayInterval = props.fields?.interval?.value ?? 2000;
  const sliderSettings = {
    dots: true,
    enableNumberedPagination: paginationStyle == 'numbers',
    slidesToShow: 1,
    infinite: loop,
    autoplay: autoplay,
    autoplaySpeed: autoPlayInterval,
    pauseOnFocus: true,
    pauseOnHover: true,
    dotsClass: 'slick-dots static',
    adaptiveHeight: true,
  };

  return (
    <CarouselClient
      fields={props.fields}
      rendering={props.rendering}
      placeholder={
        <AppPlaceholder
          name={`carousel-${props.params?.DynamicPlaceholderId}`}
          rendering={props.rendering}
          render={(childComponents) => (
            <SliderWrapper sliderSettings={sliderSettings}>{childComponents}</SliderWrapper>
          )}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const Default = withDatasourceCheck(Carousel_Default);
