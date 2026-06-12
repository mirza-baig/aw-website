'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, KeyboardEvent, KeyboardEventHandler, useState } from 'react';
import { CustomArrowProps } from 'react-slick';

import { ProductCarouselTheme } from './helpers/ProductCarousel.theme';
import { RenderSlider } from './helpers/RenderProductSlider.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function ArrowPrev(props: Readonly<CustomArrowProps>) {
  const { onClick } = props;
  const { themeData } = useTheme(ProductCarouselTheme);

  return (
    <div className={themeData.classes.arrowPrevWrapperClass}>
      <div className={themeData.classes.arrowPrevButtonWrapperClass}>
        <button
          className={themeData.classes.arrowButtonClass}
          onClick={onClick}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.code === 'Enter' || e.code === 'Space') {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick && (onClick as unknown as KeyboardEventHandler<HTMLButtonElement>)(e);
            }
          }}
          tabIndex={0}
        >
          <SvgIcon icon="arrow-left" size="lg" />
        </button>
      </div>
    </div>
  );
}

function ArrowNext(props: Readonly<CustomArrowProps>) {
  const { onClick } = props;
  const { themeData } = useTheme(ProductCarouselTheme);

  return (
    <div className={themeData.classes.arrowNextWrapperClass}>
      <div className={themeData.classes.arrowPrevButtonWrapperClass}>
        <button
          className={themeData.classes.arrowButtonClass}
          onClick={onClick}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.code === 'Enter' || e.code === 'Space') {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onClick && (onClick as unknown as KeyboardEventHandler<HTMLButtonElement>)(e);
            }
          }}
          tabIndex={0}
        >
          <SvgIcon icon="arrow-right" size="lg" />
        </button>
      </div>
    </div>
  );
}

type ProductCarouselProps = ComponentProps &
  Sitecore.Components.Product.ProductCarousel.ProductCarousel & {
    fields?: {
      children?: Sitecore.Components.Product.ProductCarousel.ProductCarouselSlide;
    };
  };

function ProductCarousel_Default(props: ProductCarouselProps): JSX.Element {
  const { themeData } = useTheme(ProductCarouselTheme);
  props = {
    ...props,
    ...getComponentServerProps(props),
  };
  const slidesData = props.fields.children;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const sliderSettings = {
    className: 'center product-carousel',
    centerMode: true,
    infinite: true,
    dots: true,
    arrows: true,
    slidesToScroll: 1,
    variableWidth: true,
    enableNumberedPagination: false,
    pauseOnFocus: true,
    pauseOnHover: true,
    dotsClass: 'slick-dots static',
    useTransform: false,
    prevArrow: <ArrowPrev />,
    nextArrow: <ArrowNext />,
    speed: 400,
    beforeChange: (_currentSlide: number, nextSlide: number) => {
      setCurrentSlideIndex(nextSlide);
    },
  };

  return (
    <Component variant="full" padding={'px-0'} dataComponent="general/productcarousel" {...props}>
      <div className="col-span-12">
        <div className="px-m md:max-w-(--breakpoint-lg) lg:mx-auto">
          <Headline defaultTag="h2" {...props} />
          <BodyCopy {...props} />
        </div>
      </div>
      <div className={themeData.classes.columnClass}>
        <div className="product-carousel z-0">
          <RenderSlider
            currentSlideIndex={currentSlideIndex}
            slidesData={slidesData}
            sliderSettings={sliderSettings}
          />
        </div>
        <div className={themeData.classes.exploreButtonClass}>
          <div>
            <Button
              field={props?.fields.cta1Link}
              variant={props?.fields.cta1Style}
              icon={props?.fields.cta1Icon}
              classes={props?.fields.cta1Style}
              modalId={
                (
                  props.fields
                    ?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                )?.fields?.modalId?.value
              }
              modalLinkText={props.fields?.cta1ModalLinkText}
            ></Button>
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ProductCarousel_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };

  return result;
}
