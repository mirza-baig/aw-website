'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import Image from 'helpers/Media/Image';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { PromoImageGridTheme } from './helpers/PromoImageGrid.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoImageGridImageProps = Sitecore.Components.Promo.PromoImageGrid.PromoImageGridImage;

type PromoImageGridProps = ComponentProps &
  Sitecore.Components.Promo.PromoImageGrid.PromoImageGrid & {
    fields: {
      children: [PromoImageGridImageProps];
    };
  };

type MobileStyle = 'carousel' | 'grid';

function PromoImageGrid_Default(props: PromoImageGridProps): JSX.Element {
  const { fields } = getComponentServerProps(props) as PromoImageGridProps;
  const mobileStyle = getEnum<MobileStyle>(fields?.mobileStyle) ?? 'carousel';
  const copyAlignRight = fields?.copyAlignRight?.value;
  const isMobileCarousel = mobileStyle === 'carousel';
  const { themeName, themeData } = useTheme(PromoImageGridTheme(copyAlignRight, isMobileCarousel));
  const imageCount = fields?.children?.length;
  const { currentScreenWidth } = useCurrentScreenType();

  const isEE = useExperienceEditor();

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const renderImages = () => {
    if (currentScreenWidth < getBreakpoint('md')) {
      // Renderings for mobile devices
      if (isMobileCarousel) {
        //display a carousel swiper
        return (
          <SliderWrapper sliderSettings={sliderSettings} theme={themeName}>
            {fields?.children?.map((_item: PromoImageGridImageProps, i: number) => {
              return (
                <div key={i} className="text-center">
                  <Image key={i} image={_item.fields?.primaryImage} layout="intrinsic" />
                </div>
              );
            })}
          </SliderWrapper>
        );
      } else if (imageCount <= 3) {
        // display grid with large top image
        return (
          <div className="container mx-auto">
            <div className={themeData.classes.mobileThreeImageGrid}>
              {fields?.children?.map((_item: PromoImageGridImageProps, i: number) => {
                if (i === 0) {
                  return (
                    <div key={i} className="col-span-2">
                      <ImageWrapper
                        image={_item.fields?.primaryImage}
                        imageLayout="responsive"
                        ratio="square"
                      ></ImageWrapper>
                    </div>
                  );
                } else {
                  return (
                    <div key={i}>
                      <ImageWrapper
                        image={_item.fields?.primaryImage}
                        imageLayout="responsive"
                        ratio="square"
                      ></ImageWrapper>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      } else {
        //display a grid of images
        return (
          <div className="container mx-auto">
            <div className="grid grid-cols-2 gap-s">
              {fields?.children?.map((_item: PromoImageGridImageProps, i: number) => {
                return (
                  <ImageWrapper
                    key={i}
                    image={_item.fields?.primaryImage}
                    imageLayout="responsive"
                    ratio="square"
                  ></ImageWrapper>
                );
              })}
            </div>
          </div>
        );
      }
    } else if (
      currentScreenWidth >= getBreakpoint('md') &&
      currentScreenWidth < getBreakpoint('ml') &&
      imageCount <= 3
    ) {
      // display grid with large top image to the side of the copy
      return (
        <div className="container mx-auto flex md:w-1/2">
          <div className="grid w-full grid-cols-2 gap-s">
            {fields?.children?.map((_item: PromoImageGridImageProps, i: number) => {
              if (i === 0) {
                return (
                  <div key={i} className="col-span-2">
                    <ImageWrapper
                      image={_item.fields?.primaryImage}
                      imageLayout="responsive"
                      ratio="square"
                    ></ImageWrapper>
                  </div>
                );
              } else {
                return (
                  <div key={i}>
                    <ImageWrapper
                      image={_item.fields?.primaryImage}
                      imageLayout="responsive"
                      ratio="square"
                    ></ImageWrapper>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    } else {
      // Renderings for large screen devices
      return (
        <div className="flex w-full md:w-2/3 ml:w-3/4">
          <div className="container mx-auto">
            <div className="grid gap-s md:grid-cols-2 ml:grid-cols-3">
              {fields?.children?.map((_item: PromoImageGridImageProps, i: number) => {
                return (
                  <ImageWrapper
                    key={i}
                    image={_item.fields?.primaryImage}
                    imageLayout="responsive"
                    ratio="square"
                  ></ImageWrapper>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Component variant="lg" dataComponent="promo/promoimagegrid" {...props} fields={fields}>
      <div className={themeData.classes.componentWrapper}>
        <div className={themeData.classes.copyStyle}>
          <div className="w-full">
            <Eyebrow
              useTag={getHeadingLevel('h2', fields?.eyebrowLevel)}
              classes={themeData.classes.eyebrowClass}
              {...props}
              fields={fields}
            />
            <Headline classes={themeData.classes.headlineClass} {...props} fields={fields} />
            <BodyCopy classes={themeData.classes.bodyClass} {...props} fields={fields} />
            {(fields?.cta1Link?.value?.href || isEE) && (
              <div className={themeData.classes.buttonClasses}>
                <SingleButton {...props} fields={fields} />
              </div>
            )}
          </div>
        </div>
        {renderImages()}
      </div>
    </Component>
  );
}

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      template: { name: string };
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

export const Default = withDatasourceCheck(PromoImageGrid_Default);
