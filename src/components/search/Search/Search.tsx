// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck: Disable TypeScript checks to suppress unknown type errors
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { buildBoostExpression } from 'lib/coveo/build-boost-expression';
import { buildFilterExpression } from 'lib/coveo/build-filter-expression';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { SearchClient } from './helpers/SearchClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SearchProps = ComponentProps &
  Sitecore.Components.Search.Search.Search & {
    fields: {
      searchBox: Sitecore.Elements.Search.SearchBox;
      pager: Sitecore.Elements.Search.Pager;
      facets: Sitecore.Elements.Search.Facet[];
      searchParameters: Sitecore.Elements.Search.SearchParameters;
      tabs: Sitecore.Elements.Search.Tab[];
      listResultItems: Sitecore.Elements.Search.ListResultItem[];
      gridResultItems: Sitecore.Elements.Search.GridResultItem[];
      columns: Sitecore.Elements.Search.ResultColumn[];
      didYouMean: Sitecore.Elements.Search.DidYouMean;
    };
  };

async function Search_Default(props: SearchProps) {
  const { boostingExpression, filterExpression } = await getComponentServerProps(props.rendering);

  return (
    <SearchClient
      fields={props.fields}
      rendering={props.rendering}
      page={props.page}
      boostingEpxression={boostingExpression}
      filterExpression={filterExpression}
    />
  );
}

export const Default = withDatasourceCheck(Search_Default);

async function getComponentServerProps(rendering: ComponentRendering) {
  'use cache';

  const { expression: boostingExpression, fetchedItems: boostingFetchedItems } =
    await buildBoostExpression(rendering.fields.boostingExpression?.value);
  const { expression: filterExpression, fetchedItems: filterFetchedItems } =
    await buildFilterExpression(rendering.fields.filterExpression?.value);

  boostingFetchedItems.forEach((item) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: item.id, locale: item.language }));
  });
  filterFetchedItems.forEach((item) => {
    cacheTag(buildSitecoreItemCacheTag({ itemId: item.id, locale: item.language }));
  });

  return { boostingExpression, filterExpression };
}
