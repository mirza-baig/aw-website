'use client';

import { PropsWithChildren } from 'react';
import { TabPanel } from 'react-tabs';

import styles from './_react-tabs.module.scss';
import { useCurrentTab } from './CurrentTab';

type TabPanelClientProps = PropsWithChildren<{
  index: number;
}>;

export function TabPanelClient(props: TabPanelClientProps) {
  const { currentTab } = useCurrentTab();
  const tabId = `react-tabs-${props.index}`;
  const ariaLabelledby = `${tabId}-label`;

  return (
    <TabPanel
      id={tabId}
      aria-labelledby={ariaLabelledby}
      forceRender
      className={styles['react-tabs__tab-panel']}
      selectedClassName={styles['react-tabs__tab-panel--selected']}
      selected={currentTab === props.index}
    >
      <div className="col-span-12">{props.children}</div>
    </TabPanel>
  );
}
