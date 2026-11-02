import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { buildBoostExpression } from 'lib/coveo/build-boost-expression';
import { buildFilterExpression } from 'lib/coveo/build-filter-expression';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { XupCardCollectionDynamicClient } from './helpers/XupCardCollectionDynamicClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import { cacheTag } from 'next/cache';
import { buildSitecoreItemCacheTag } from 'lib/cache/build-sitecore-item-cache-tag';

type XupCardCollectionDynamicProps = ComponentProps &
  Sitecore.Components.Listing.XupCardCollectionDynamic.XupCardCollectionDynamic & {
    fields?: {
      children: Sitecore.Components.Listing.XupCardCollectionDynamic.ResultItem[];
    };
    boostingExpression: string;
    filterExpression: string;
  };

export type cardAlignment = 'left' | 'center';

async function XupCardCollectionDynamic_Default(props: XupCardCollectionDynamicProps) {
  const { fields, boostingExpression, filterExpression } = (await getComponentServerProps(
    props.rendering
  )) as XupCardCollectionDynamicProps;
  return (
    <XupCardCollectionDynamicClient
      fields={fields}
      rendering={props.rendering}
      page={props.page}
      boostingExpression={boostingExpression}
      filterExpression={filterExpression}
    />
  );
}

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    id: string;
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      fields: ItemFieldResult[];
    }>;
  };
}>;

async function getComponentServerProps(rendering: ComponentRendering) {
  'use cache';

  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      id: fields.data.item.id,
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => {
        return {
          id: child.id,
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        };
      }),
    },
    boostingExpression: '',
    filterExpression: '',
  };

  const { expression: boostingExpression, fetchedItems: boostingFetchedItems } = await buildBoostExpression(result.fields.boostingExpression?.value);
  const { expression: filterExpression, fetchedItems: filterFetchedItems } = await buildFilterExpression(result.fields.filterExpression?.value);

  boostingFetchedItems.forEach((item) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: item.id, locale: item.language }));
  });
  filterFetchedItems.forEach((item) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: item.id, locale: item.language }));
  });

  result.boostingExpression = boostingExpression ?? '';
  result.filterExpression = filterExpression ?? '';

  return result;
}

export const Default = withDatasourceCheck(XupCardCollectionDynamic_Default);
