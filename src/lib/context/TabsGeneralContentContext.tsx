import { createContext, useContext } from 'react';

export type TabsGeneralContextValue = {
  activeTab: number;
  tabIds: string[];
};

export const TabsGeneralContentContext = createContext<TabsGeneralContextValue>({
  activeTab: 0,
  tabIds: [],
});

export const useTabsGeneralContentContext = () => useContext(TabsGeneralContentContext);
