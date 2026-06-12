'use client';

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

type CurrentTab = {
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
};

const CurrentTabContext = createContext<CurrentTab>({ currentTab: 0, setCurrentTab: () => {} });

export function CurrentTabProvider({
  initialTab,
  children,
}: PropsWithChildren<{ initialTab?: number }>) {
  const [currentTab, setCurrentTab] = useState(initialTab ?? 0);
  return (
    <CurrentTabContext.Provider
      value={useMemo(() => ({ currentTab, setCurrentTab }), [currentTab])}
    >
      {children}
    </CurrentTabContext.Provider>
  );
}

export function useCurrentTab() {
  const context = useContext(CurrentTabContext);
  if (context === undefined) {
    throw new Error('useCurrentTabContext must be used within a CurrentTabProvider');
  }
  return context;
}
