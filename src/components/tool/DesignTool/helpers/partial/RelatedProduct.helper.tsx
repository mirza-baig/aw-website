// Global
import { Link, Text } from '@sitecore-content-sdk/nextjs';
import Image from 'helpers/Media/Image';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
// Components
import { useAsPath } from 'lib/hooks/use-as-path';
import { useContext } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';

import { DesignToolProductProps } from '../DesignTool.types';
import { DesignToolContext } from '../DesignToolContext.helper';
import { GetUrlParts } from '../js/utils';
import { RelatedProductTheme, RelatedProductThemeSubType } from './RelatedProduct.theme';

export const RelatedProduct = (props: DesignToolProductProps) => {
  const { themeName, themeData } = useTheme(RelatedProductTheme());
  const theme = (themeData as RelatedProductThemeSubType).classes;

  const { designToolRouter } = useContext(DesignToolContext);
  const asPath = useAsPath();

  const handleDesignLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const urlParts = GetUrlParts(asPath);
    globalThis.history.replaceState(null, '', `${urlParts.pathName}#/${props.id}/0`);
  };

  // Computed
  const cost = props?.cost?.fields?.priceLevelText?.value || 0;
  const costOff = () => {
    return '$ '.repeat(5 - cost);
  };

  const costOn = () => {
    return '$ '.repeat(cost);
  };

  const sliderSettings = {
    infinite: false,
    className: theme.imgSliderContainer,
    prevArrow: undefined,
    nextArrow: undefined,
  };

  return (
    <div className={theme.relatedProduct}>
      <div className={theme.row}>
        <div className={theme.imgSlider}>
          <SliderWrapper sliderSettings={sliderSettings} theme={themeName}>
            {props.image1 && (
              <div className={theme.imgSlide}>
                <ImageWrapper
                  image={props.image1}
                  additionalDesktopClasses={theme.imgSlideImage}
                ></ImageWrapper>
              </div>
            )}
            {props.image2 && (
              <div className={theme.imgSlide}>
                <ImageWrapper
                  image={props.image2}
                  additionalDesktopClasses={theme.imgSlideImage}
                ></ImageWrapper>
              </div>
            )}
            {props.image3 && (
              <div className={theme.imgSlide}>
                <ImageWrapper
                  image={props.image3}
                  additionalDesktopClasses={theme.imgSlideImage}
                ></ImageWrapper>
              </div>
            )}
            {props.image4 && (
              <div className={theme.imgSlide}>
                <ImageWrapper
                  image={props.image4}
                  additionalDesktopClasses={theme.imgSlideImage}
                ></ImageWrapper>
              </div>
            )}
            {props.image5 && (
              <div className={theme.imgSlide}>
                <ImageWrapper
                  image={props.image5}
                  additionalDesktopClasses={theme.imgSlideImage}
                ></ImageWrapper>
              </div>
            )}
          </SliderWrapper>
        </div>
        <div className={theme.details}>
          {(props.feature.image || props.feature.text) && (
            <div className={theme.featureCallout}>
              {props.feature.image && (
                <span className={theme.featureImage}>
                  <Image image={props.feature.image} layout="intrinsic"></Image>
                </span>
              )}
              {props.feature.text && (
                <div className="inline">
                  <RichTextWrapper field={props.feature.text} classes={theme.featureText} />
                </div>
              )}
            </div>
          )}
          <div className={theme.title}>
            <h3 className={theme.series}>
              <Text field={props.series} />
            </h3>
            <div className={theme.category}>
              <Text field={props.category} />
            </div>
            <div className={theme.reviewCost}>
              {props.bazaarvoice.productId && (
                <div
                  className={theme.review}
                  data-bv-show="inline_rating"
                  data-bv-product-id={props.bazaarvoice?.productId}
                  data-bv-seo="false"
                ></div>
              )}
              {props.bazaarvoice.productId && <div className="bullet">&bull;</div>}
              <div className={theme.cost}>
                <span className={theme.costOn}>{costOn()}</span>
                <span className={theme.costOff}>{costOff()}</span>
              </div>
            </div>
          </div>
          <ul className={theme.list}>
            <li className={theme.listItem}>
              <RichTextWrapper field={props.bullet1} refer="" />
            </li>
            <li className={theme.listItem}>
              <RichTextWrapper field={props.bullet2} refer="" />
            </li>
            <li className={theme.listItem}>
              <RichTextWrapper field={props.bullet3} refer="" />
            </li>
          </ul>
        </div>
      </div>
      <div className={theme.buttonContainer}>
        <Link
          field={props.links.detail}
          className={theme.detailsLink + theme.secondaryLink}
          target="_blank"
        ></Link>
        <a
          href={designToolRouter.getRouteDataForProduct(props)}
          className={theme.designLink}
          onClick={handleDesignLinkClick}
        >
          <Text field={props.ctaText}></Text>
        </a>
      </div>
    </div>
  );
};
