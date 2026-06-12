import { AppPlaceholder, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { Tab } from './helpers/tab';
import { TabsGeneralTabItemClient } from './helpers/TabsGeneralTabItemClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';
import componentMap from '.sitecore/component-map';

type TabItemProps = ComponentProps & {
  fields: {
    data: {
      item: { id: string } & Sitecore.Components.Tabs.TabsGeneralContent.TabItemJson;
    };
  };
};

function TabsGeneralTabItem_Default(props: TabItemProps): JSX.Element {
  return (
    <TabsGeneralTabItemClient fields={props.fields}>
      <AppPlaceholder
        name={`panel-${props.params?.DynamicPlaceholderId}`}
        rendering={props.rendering}
        page={props.page}
        componentMap={componentMap}
      />
    </TabsGeneralTabItemClient>
  );
}

export const Default = withDatasourceCheck(TabsGeneralTabItem_Default);

export async function getStaticTabProps(
  rendering: ComponentRendering<TabItemProps['fields']>
): Promise<Tab> {
  return {
    id: rendering.fields?.data.item.id ?? '',
    contentId: rendering.fields?.data.item.contentId.jsonValue ?? { value: '' },
    headlineText: rendering.fields?.data.item.headlineText.jsonValue ?? { value: '' },
    headlineLevel: rendering.fields?.data.item.headlineLevel?.jsonValue,
  };
}
