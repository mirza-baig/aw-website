import { AppPlaceholder, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Tab } from './helpers/HeroProductTabs.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type HeroProductTabItemProps = {
  fields: {
    data: {
      item: { id: string } & Sitecore.Components.Hero.HeroProductTabs.HeroProductTabItemJson;
    };
  };
};

function HeroProductTabItem_Default(props: HeroProductTabItemProps & ComponentProps): JSX.Element {
  return (
    <div className={classNames('col-span-12')}>
      <AppPlaceholder
        name={`heropanel-${props.params?.DynamicPlaceholderId}`}
        rendering={props.rendering}
        page={props.page}
        componentMap={componentMap}
      />
    </div>
  );
}

export const Default = withDatasourceCheck(HeroProductTabItem_Default);

export async function getStaticTabProps(
  rendering: ComponentRendering<HeroProductTabItemProps['fields']>
): Promise<Tab> {
  return {
    id: rendering.fields?.data.item.id ?? '',
    contentId: rendering.fields?.data.item.contentId.jsonValue ?? { value: '' },
    title: rendering.fields?.data.item.title.jsonValue ?? { value: '' },
  };
}
