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

  result.boostingExpression =
    (await buildBoostExpression(result.fields.boostingExpression?.value)) ?? '';
  result.filterExpression =
    (await buildFilterExpression(result.fields.filterExpression?.value)) ?? '';

  return result;
}

export const Default = withDatasourceCheck(XupCardCollectionDynamic_Default);
