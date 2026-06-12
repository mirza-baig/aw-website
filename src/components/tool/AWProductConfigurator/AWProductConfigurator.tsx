import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, Suspense } from 'react';

import { AWProductConfiguratorClient } from './helpers/AWProductConfiguratorClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type AWProductConfiguratorProps = ComponentProps &
  Sitecore.Components.Tool.AwproductConfigrator.ProductConfigurator;

function AWProductConfigurator_Default(props: AWProductConfiguratorProps): JSX.Element {
  return (
    <Suspense>
      <AWProductConfiguratorClient fields={props.fields} rendering={props.rendering} />
    </Suspense>
  );
}

export const Default = withDatasourceCheck(AWProductConfigurator_Default);
