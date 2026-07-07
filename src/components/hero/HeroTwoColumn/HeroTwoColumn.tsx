import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { HeroTwoColumnClient } from './helpers/HeroTwoColumnClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type HeroTwoColumnProps = ComponentProps & Sitecore.Components.Hero.HeroTwoColumn.HeroTwoColumn;

function HeroTwoColumn_Default(props: HeroTwoColumnProps): JSX.Element {
  const dynamicId = props.params?.DynamicPlaceholderId;

  return (
    <HeroTwoColumnClient
      {...props}
      leftPlaceholder={
        <AppPlaceholder
          name={`herotwocolumn-left-${dynamicId}`}
          rendering={props.rendering}
          page={props.page}
          componentMap={componentMap}
        />
      }
      rightPlaceholder={
        <AppPlaceholder
          name={`herotwocolumn-right-${dynamicId}`}
          rendering={props.rendering}
          page={props.page}
          componentMap={componentMap}
        />
      }
    />
  );
}

export const Default = withDatasourceCheck(HeroTwoColumn_Default);
