import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { buildSitecoreItemCacheTag } from 'lib/cache/build-sitecore-item-cache-tag';
import { ComponentProps } from 'lib/component-props';
import { buildBoostExpression } from 'lib/coveo/build-boost-expression';
import { buildFilterExpression } from 'lib/coveo/build-filter-expression';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { cacheTag } from 'next/cache';

import { PageMashupDynamicClient } from './helpers/PageMashupDynamicClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PageMashupDynamicProps = ComponentProps &
  Sitecore.Components.Search.PageMashupDynamic.PageMashupDynamic & {
    fields: {
      children: Sitecore.Components.Search.PageMashupDynamic.ResultItem[];
    };
  };

async function PageMashupDynamic_Default(props: PageMashupDynamicProps) {
  const { fields, boostingExpression, filterExpression } = (await getComponentServerProps(
    props.rendering
  )) as PageMashupDynamicProps;

  return (
    <PageMashupDynamicClient
      fields={fields}
      boostingExpression={boostingExpression}
      filterExpression={filterExpression}
      rendering={props.rendering}
      params={props.params}
    />
  );
}

export const Default = withDatasourceCheck(PageMashupDynamic_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      template: { name: string };
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
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
    boostingExpression: '',
    filterExpression: '',
  };

  const { expression: boostingExpression, fetchedItems: boostingFetchedItems } =
    await buildBoostExpression(result.fields.boostingExpression?.value);
  const { expression: filterExpression, fetchedItems: filterFetchedItems } =
    await buildFilterExpression(result.fields.filterExpression?.value);

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
