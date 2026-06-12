import { AppPlaceholder, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { ProductDesignToolClient } from './helpers/ProductDesignToolClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type ProductDesignToolProps = ComponentProps &
  Sitecore.Components.Tool.ProductDesignTool.ProductDesignTool;

// Define the ProductDesignTool component
function ProductDesignTool_Defualt(props: ProductDesignToolProps) {
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
        FieldNames: 'ProductDesignTool',
      };

      const formKey = Object.keys(rendering.placeholders ?? {}).find((k) => k.startsWith('form-'));
      const formRenderings = (
        formKey ? rendering.placeholders?.[formKey] : []
      ) as ComponentRendering[];

      formRenderings.forEach((rendering) => {
        if (rendering.componentName === 'RequestQuote') {
          rendering.params = {
            ...(rendering.params ?? {}),
            FieldNames: 'ProductDesignTool',
          };
        }
      });
    }
  });

  return (
    <Suspense>
      <ProductDesignToolClient
        fields={props.fields}
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

export const Default = withDatasourceCheck(ProductDesignTool_Defualt);
