'use client';

import { Item, useSitecore } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { ThemeFile, ThemeName, useTheme } from 'lib/context/ThemeContext';
import { useAsPath } from 'lib/hooks/use-as-path';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { useBVScript } from 'lib/utils/use-bv-script';
import { useEffect, useState } from 'react';
import { ProductByBVIdQueryResult } from 'src/app/api/aw/bazaarvoice-product-by-bvid/product-by-bv-id-service';
import { environment } from 'startup/environment';

import styles from './bazaarvoice-review-submission.module.css';
import { BazaarvoiceReviewSubmissionTheme } from './BazaarvoiceReviewSubmission.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BazaarvoiceReviewSubmissionProps =
  Sitecore.Components.General.BazaarvoiceReviewSubmission.BazaarvoiceReviewSubmission;

function RenderReviewButton(
  props: ProductByBVIdQueryResult,
  themeData: ThemeFile[ThemeName] | undefined
) {
  if (props === null) {
    return <></>;
  }
  const imageField = {
    value: props?.productImage
      ? {
          ...props.productImage,
          width: props.productImage.width ? Number(props.productImage.width) : undefined,
          height: props.productImage.height ? Number(props.productImage.height) : undefined,
        }
      : undefined,
  };

  return (
    <>
      <div className={themeData.classes.bazaarvoiceImageWrapper}>
        <ImageWrapper image={imageField}></ImageWrapper>
      </div>
      <div className={themeData.classes.bazaarvoiceProductContent}>
        <h3 className={themeData.classes.bazaarvoiceProductHeadline}>{props.productName?.value}</h3>
        <button
          onClick={() => SubmitReviewClick(props.bazaarvoiceProductId?.value)}
          className={themeData.classes.buttonClass}
          title="Start Rating"
        >
          Start Rating
        </button>
      </div>
    </>
  );
}

function SubmitReviewClick(externalId: string) {
  // @ts-ignore $BV will be available after the page loads.
  $BV.ui('rr', 'submit_review', { productId: externalId });
}

function RenderAllReviewButtons(
  props: ProductByBVIdQueryResult[],
  themeData: ThemeFile[ThemeName] | undefined
) {
  if (props === null || props?.length === 0 || !Array.isArray(props)) {
    console.log('No products found for Bazaarvoice Review Submission', props);
    return <></>;
  }

  return (
    <div className={themeData.classes.bazaarvoiceContainerWrapper}>
      {props.map((_item) => (
        <div key={_item.productName?.value} className={themeData.classes.bazaarvoiceProductWrapper}>
          {RenderReviewButton(_item, themeData)}
        </div>
      ))}
    </div>
  );
}

export function BazaarvoiceReviewSubmissionClient(props: BazaarvoiceReviewSubmissionProps) {
  const { themeName, themeData } = useTheme(BazaarvoiceReviewSubmissionTheme);
  const asPath = useAsPath();
  const { page } = useSitecore();
  const language = page.layout.sitecore.context.language;

  const [searchResults, setSearchResults] = useState<ProductByBVIdQueryResult[]>([]);

  // Add the bazaarvoice script
  useBVScript({ environment, theme: themeName });

  useEffect(() => {
    async function getProductsByBVProductId() {
      const urlSearchParams = new URLSearchParams(asPath.split('?')[1]);
      const productIds = urlSearchParams.get('externalIds');
      const sourceIds = props?.fields?.bazaarvoiceProducts?.map((product: Item) => product.id);
      if (sourceIds && sourceIds.length > 0 && productIds) {
        try {
          const response = await fetch('/api/aw/bazaarvoice-product-by-bvid', {
            method: 'POST',
            body: JSON.stringify({
              sourceIds: sourceIds,
              productIds: productIds.split(','),
              language: language,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('data', data);
            setSearchResults(data.products);
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      }
    }
    getProductsByBVProductId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses={styles.bazaarvoiceReviewSubmission}
      dataComponent="general/bazaarvoicereviewsubmission"
      {...props}
    >
      <div className={themeData.classes.componentWrapperClass}>
        <Headline
          useTag={getHeadingLevel('h2', props.fields?.headlineLevel)}
          classes={themeData.classes.headlineContainer}
          {...props}
        />
        <RichTextWrapper
          field={props?.fields?.thankYouMessaging}
          classes={themeData.classes.thankYouMessaging}
        />
        {RenderAllReviewButtons(searchResults, themeData)}
      </div>
    </Component>
  );
}
