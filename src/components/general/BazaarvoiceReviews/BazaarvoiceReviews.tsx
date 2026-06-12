'use client';

import { Field } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useBVScript } from 'lib/utils/use-bv-script';
import { useEffect, useState } from 'react';
import { environment } from 'startup/environment';

import styles from './helpers/bazaarvoice-reviews.module.css';
import { BazaarvoiceReviewsTheme } from './helpers/BazaarvoiceReviews.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BazaarvoiceReviewsProps = ComponentProps &
  Sitecore.Components.General.BazaarvoiceReviews.BazaarvoiceReviews;

function isEmpty(value: string) {
  return value == null || (typeof value === 'string' && value.trim().length === 0);
}

function BazaarvoiceReviews_Default(props: BazaarvoiceReviewsProps) {
  const { themeName, themeData } = useTheme(BazaarvoiceReviewsTheme);

  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  const productItem = props?.fields?.productItem;
  const bazaarvoiceProductIdOverride = props?.fields?.bazaarvoiceProductIdOverride?.value;
  let bazaarvoiceProductId = (
    productItem?.fields?.bazaarvoiceProductId as Field<string> | undefined
  )?.value;

  if (!isEmpty(bazaarvoiceProductIdOverride)) {
    bazaarvoiceProductId = bazaarvoiceProductIdOverride;
  }

  const componentId = 'bazaarvoiceReview-' + bazaarvoiceProductId;
  const [isOpen, setIsOpen] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses={styles.bvReviews}
      dataComponent="general/bazaarvoicereviews"
      {...props}
    >
      <Headline classes={themeData.classes.headline} {...props} />
      <div className={themeData.classes.wrapperClass}>
        <div
          className={themeData.classes.accordionToggleContainer}
          data-anchor-name={'#' + componentId}
        >
          <button
            className={themeData.classes.accordionHeadline}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={themeData.classes.readMore}>Read Reviews</div>
            <div
              className={themeData.classes.accordionRatingContainer}
              data-bv-show="rating_summary"
              data-bv-product-id={bazaarvoiceProductId}
            ></div>
            <div className={themeData.classes.accordionToggleIndicator}>
              <SvgIcon
                icon={isOpen ? 'minus' : 'plus'}
                size="18"
                className={themeData.classes.iconClass}
              />
            </div>
          </button>
        </div>
        <div
          className={`content-container ${
            isOpen ? themeData.classes.contentOpen : themeData.classes.contentClosed
          }`}
          id={componentId}
        >
          <div className="content">
            <div data-bv-show="reviews" data-bv-product-id={bazaarvoiceProductId}></div>
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(BazaarvoiceReviews_Default);
