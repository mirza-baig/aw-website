'use client';

import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import DynamicMashup from 'helpers/MashupHelpers/DynamicMashup';
import { ComponentProps } from 'lib/component-props';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type PageMashupDynamicProps = ComponentProps &
  Sitecore.Components.Search.PageMashupDynamic.PageMashupDynamic & {
    fields: {
      children: Sitecore.Components.Search.PageMashupDynamic.ResultItem[];
    };
  };

function PageMashupDynamic_Default(props: PageMashupDynamicProps) {
  const { fields } = getComponentServerProps(props.rendering) as PageMashupDynamicProps;

  return (
    <Component
      variant="full"
      padding="px-0"
      backgroundVariant={getEnum(fields?.backgroundColor)}
      dataComponent="general/pagemashup"
      fields={fields}
      rendering={props.rendering}
      params={props.params}
    >
      <DynamicMashup fields={fields} rendering={props.rendering} params={props.params} />
    </Component>
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

function getComponentServerProps(rendering: ComponentRendering) {
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
  };
  return result;
}
