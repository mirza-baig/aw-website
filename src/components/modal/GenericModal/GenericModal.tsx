import { AppPlaceholder, RouteData } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { GenericModalClient } from './helpers/GenericModalClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type GenericModalProps = ComponentProps &
  Sitecore.Components.Modal.GenericModal.GenericModal & {
    fields?: {
      children: RouteData[];
    };
  };

function GenericModal_Default(props: GenericModalProps): JSX.Element {
  const phKey = `genericmodal-${props.params?.DynamicPlaceholderId}`;

  return (
    <GenericModalClient
      fields={props.fields}
      page={props.page}
      rendering={props.rendering}
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

export const Default = withDatasourceCheck(GenericModal_Default);
