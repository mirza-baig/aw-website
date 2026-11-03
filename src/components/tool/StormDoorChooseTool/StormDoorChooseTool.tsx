import { AppPlaceholder, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, Suspense } from 'react';

import { StormDoorChooseToolClient } from './helpers/StormDoorChooseToolClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

export type StormDoorChooseToolProps =
  Sitecore.Components.Tool.StormDoorChooseTool.StormDoorChooseTool;
function StormDoorChooseTool_Default(props: StormDoorChooseToolProps): JSX.Element {
  const { fields } = getComponentServerProps(props) as StormDoorChooseToolProps;
  return (
    <Suspense>
      <StormDoorChooseToolClient
        fields={fields}
        rendering={props.rendering}
        placeholder={
          <AppPlaceholder
            name={`stormdoorchoosetool`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        }
      />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(StormDoorChooseTool_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: ItemFieldResult[];
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        fields: ItemFieldResult[];
      }>;
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
      children: mapSearchResults(fields.data.item.children, (child) => {
        return {
          id: child.id,
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        };
      }),
    },
  };
  return result;
}
