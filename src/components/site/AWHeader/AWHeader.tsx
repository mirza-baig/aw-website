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
import { JSX } from 'react';

import { AWHeaderClient } from './helpers/AWHeaderClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type AWHeaderProps = ComponentProps &
  Sitecore.Components.Navigation.Header.Header & {
    filterExpression: string;
    boostingExpression: string;
  };

// ─── Pure helpers (no React context needed) ───────────────────────────────────
function generateId() {
  return crypto.randomUUID();
}

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
      template: { name: string; id: string };
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        template: { name: string; id: string };
        fields: ItemFieldResult[];
        children: ItemSearchResults<{
          template: { name: string; id: string };
          fields: ItemFieldResult[];
          children: ItemSearchResults<{
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
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }
  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child1) => ({
        id: generateId() ?? null,
        templateName: child1?.template?.name ?? null,
        templateId: child1?.template?.id ?? null,
        fields: {
          ...mapItemFieldResultsToObject(child1.fields),
          children: mapSearchResults(child1.children, (child2) => ({
            id: generateId() ?? null,
            templateName: child2?.template?.name ?? null,
            templateId: child2?.template?.id ?? null,
            fields: {
              ...mapItemFieldResultsToObject(child2.fields),
              children: mapSearchResults(child2.children, (child3) => ({
                id: generateId() ?? null,
                templateName: child3?.template?.name ?? null,
                templateId: child3?.template?.id ?? null,
                fields: {
                  ...mapItemFieldResultsToObject(child3.fields),
                  children: mapSearchResults(child3.children, (child4) => ({
                    id: generateId() ?? null,
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

  result.boostingExpression =
    (await buildBoostExpression(
      result.fields?.globalSearchBox?.fields.boostingExpression?.value
    )) ?? '';
  result.filterExpression =
    (await buildFilterExpression(result.fields?.globalSearchBox?.fields.filterExpression?.value)) ??
    '';

  return result;
}
//SQ-NOSCAN-END
