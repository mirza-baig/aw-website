import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { FormContainerClient } from './helpers/FormContainerClient';
import { LeftBar } from './helpers/LeftBar.DesignTool';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type FormContainerProps = ComponentProps & Sitecore.Components.Forms.FormContainer.FormContainer;

function FormContainer_DesignTool(props: FormContainerProps): JSX.Element {
  const phKey = `form-${props.params?.DynamicPlaceholderId}`;

  return (
    <FormContainerClient
      fields={props.fields}
      rendering={props.rendering}
      leftBar={<LeftBar fields={props.fields} />}
      placeholder={
        <AppPlaceholder
          name={phKey}
          rendering={props.rendering}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const DesignTool = withDatasourceCheck(FormContainer_DesignTool);
