'use client';

import classNames from 'classnames';
import { useTabsGeneralContentContext } from 'lib/context/TabsGeneralContentContext';
import { PropsWithChildren } from 'react';
import { TabPanel } from 'react-tabs';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type TabsGeneralTabItemClientProps = PropsWithChildren<{
  fields: {
    data: {
      item: { id: string } & Sitecore.Components.Tabs.TabsGeneralContent.TabItemJson;
    };
  };
}>;

export function TabsGeneralTabItemClient(props: TabsGeneralTabItemClientProps) {
  const { activeTab, tabIds } = useTabsGeneralContentContext();
  const currentTabId = props.fields.data.item.id;
  const index = tabIds.findIndex((id) => id === currentTabId);
  return (
    <TabPanel forceRender={true} selected={activeTab === index}>
      <div className={classNames('col-span-12')}>{props.children}</div>
    </TabPanel>
  );
}
