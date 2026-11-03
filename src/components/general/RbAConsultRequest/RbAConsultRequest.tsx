import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { Suspense } from 'react';

import { RbAConsultRequestClient } from './helpers/RbAConsultRequestClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type RbAConsultRequestProps = ComponentProps &
  Sitecore.Components.General.RbAConsultRequest.RbAConsultRequest;

function RbAConsultRequest_Default(props: RbAConsultRequestProps) {
  return (
    <Suspense>
      <RbAConsultRequestClient
        fields={props.fields}
        rendering={props.rendering}
        placeholder={
          <AppPlaceholder
            name={`form-${props.params?.DynamicPlaceholderId}`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        }
      />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(RbAConsultRequest_Default);
