import { AppPlaceholder, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, Suspense } from 'react';

import { DesignToolClient } from './helpers/DesignToolClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type DesignToolProps = ComponentProps & Sitecore.Components.Tool.DesignTool.DesignTool;

function DesignTool_Default(props: DesignToolProps): JSX.Element {
  const placeholderKey = Object.keys(props.rendering.placeholders ?? {}).find((k) =>
    k.startsWith('designtool-')
  );
  const placeholderRenderings = (
    placeholderKey ? props.rendering.placeholders[placeholderKey] : []
  ) as ComponentRendering[];

  placeholderRenderings.forEach((rendering) => {
    if (rendering.componentName === 'FormContainer') {
      rendering.params = {
        ...(rendering.params ?? {}),
        FieldNames: 'DesignTool',
      };

      const formKey = Object.keys(rendering.placeholders ?? {}).find((k) => k.startsWith('form-'));
      const formRenderings = (
        formKey ? rendering.placeholders?.[formKey] : []
      ) as ComponentRendering[];

      formRenderings.forEach((rendering) => {
        if (rendering.componentName === 'RequestQuote') {
          rendering.params = {
            ...(rendering.params ?? {}),
            FieldNames: 'DesignTool',
            IsDesignToolRAQ: 'true',
          };
        }
      });
    }
  });

  const { fields } = getComponentServerProps(props.rendering);

  return (
    <Suspense>
      <DesignToolClient
        fields={fields}
        rendering={props.rendering}
        placeholder={
          <AppPlaceholder
            name={`designtool-${props.params?.DynamicPlaceholderId}`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        }
      />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(DesignTool_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

function StringToGuid(value: string) {
  return encodeURIComponent(value?.toLowerCase().replaceAll(/[}{-]/g, '')).replace(
    /([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-5][0-9a-fA-F]{3})([089abAB][0-9a-fA-F]{3})([0-9a-fA-F]{12})/g,
    '$1-$2-$3-$4-$5'
  );
}

function getComponentServerProps(rendering: ComponentRendering) {
  const fields = rendering?.fields as unknown as IntegratedGraphQl;
  const results = {
    fields: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children: mapSearchResults(fields.data?.item?.children, (child: any) => ({
        id: StringToGuid(child?.id),
        fields: {
          ...mapItemFieldResultsToObject(child?.fields),
        },
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: StringToGuid((fields.data?.item as unknown as any)?.id),
      ...mapItemFieldResultsToObject(fields.data?.item?.fields),
    },
  };

  if (!results) {
    return rendering;
  }

  return { ...rendering, fields: results?.fields };
}
