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
import { JSX } from 'react';

import { AWHeaderClient } from './helpers/AWHeaderClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type AWHeaderProps = ComponentProps &
  Sitecore.Components.Navigation.Header.Header & {
    filterExpression: string;
    boostingExpression: string;
  };

// ─── Pure helpers (no React context needed) ───────────────────────────────────
async function AWHeader_Default(props: AWHeaderProps): Promise<JSX.Element> {
  const { fields, boostingExpression, filterExpression } = (await getComponentServerProps(
    props.rendering
  )) as AWHeaderProps;

  return (
    <AWHeaderClient
      fields={fields}
      rendering={props.rendering}
      boostingExpression={boostingExpression}
      filterExpression={filterExpression}
    />
  );
}

export const Default = withDatasourceCheck(AWHeader_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      template: { name: string; id: string };
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        id: string;
        template: { name: string; id: string };
        fields: ItemFieldResult[];
        children: ItemSearchResults<{
          id: string;
          template: { name: string; id: string };
          fields: ItemFieldResult[];
          children: ItemSearchResults<{
            id: string;
            template: { name: string; id: string };
            fields: ItemFieldResult[];
          }>;
        }>;
      }>;
    }>;
  };
}>;

//SQ-NOSCAN-START - Nesting is necessary to retrieve child items
async function getComponentServerProps(rendering: ComponentRendering) {
  'use cache';
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }
  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child1) => ({
        id: child1.id,
        templateName: child1?.template?.name ?? null,
        templateId: child1?.template?.id ?? null,
        fields: {
          ...mapItemFieldResultsToObject(child1.fields),
          children: mapSearchResults(child1.children, (child2) => ({
            id: child2.id,
            templateName: child2?.template?.name ?? null,
            templateId: child2?.template?.id ?? null,
            fields: {
              ...mapItemFieldResultsToObject(child2.fields),
              children: mapSearchResults(child2.children, (child3) => ({
                id: child3.id,
                templateName: child3?.template?.name ?? null,
                templateId: child3?.template?.id ?? null,
                fields: {
                  ...mapItemFieldResultsToObject(child3.fields),
                  children: mapSearchResults(child3.children, (child4) => ({
                    id: child4.id,
                    templateName: child4?.template?.name ?? null,
                    templateId: child4?.template?.id ?? null,
                    fields: {
                      ...mapItemFieldResultsToObject(child4.fields),
                    },
                  })),
                },
              })),
            },
          })),
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
//SQ-NOSCAN-END
