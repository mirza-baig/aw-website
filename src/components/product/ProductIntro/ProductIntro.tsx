/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.server';
import { ComponentProps } from 'lib/component-props';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { ProductSwatch } from './helpers/product-swatch';
import { ProductIntroClient } from './helpers/ProductIntroClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ProductIntroProps = ComponentProps &
  Sitecore.Components.Product.ProductIntro.ProductIntro & {
    fields?: {
      children?: ProductSwatch[];
      tabLinkToSelect: Sitecore.FieldSets.ContentAnchor;
    };
  };

async function ProductIntro_Default(props: ProductIntroProps): Promise<JSX.Element> {
  const { fields, productReviewStaticProps } = await getComponentServerProps(props.rendering);

  return (
    <ProductIntroClient
      fields={fields}
      rendering={props.rendering}
      productReviewStaticProps={productReviewStaticProps}
    />
  );
}

export const Default = withDatasourceCheck(ProductIntro_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

async function getComponentServerProps(rendering: ComponentRendering) {
  let result: any = {};
  const productReviewStaticProps: { staticProductReview?: any; awAggregateRating?: any } = {};

  // First part
  if (rendering.fields !== undefined && 'data' in rendering.fields) {
    const fields = rendering.fields as unknown as IntegratedGraphQl;

    result = {
      fields: {
        ...mapItemFieldResultsToObject(fields.data.item.fields),
        children: mapSearchResults(fields.data.item.children, (child) => ({
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        })),
      },
    };
  }

  // Second part
  const datasource = rendering as ProductIntroProps;

  if (datasource) {
    const productItem = datasource?.fields?.data?.item?.fields?.find(
      (field: any) => field.name === 'productItem'
    )?.jsonValue;
    const awAggregateRating = productItem?.fields?.bazaarvoiceProductId?.value?.trim();

    if (awAggregateRating) {
      try {
        const sanitizeProductId = awAggregateRating.replace(/\s/g, '');
        const apiKey = config.bazaarvoice.apiKey;
        const baseUrl = config.bazaarvoice.apiUrl;

        const apiUrl = `${baseUrl}${apiKey}&Filter=ProductId:${sanitizeProductId}&Include=Products,Comments&Stats=Reviews`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Bazaarvoice API error: ${response.status}`);
        }
        const directReview = await response.json();
        const ratingData = directReview?.Includes?.Products?.[sanitizeProductId];
        productReviewStaticProps.awAggregateRating = ratingData !== undefined ? ratingData : null;
      } catch (error) {
        console.error('Error fetching direct Bazaarvoice review:', error);
        productReviewStaticProps.awAggregateRating = null;
      }
    } else {
      console.warn('No valid productId found.');
      productReviewStaticProps.awAggregateRating = null;
    }
  }
  return {
    ...result,
    ...productReviewStaticProps,
  };
}
