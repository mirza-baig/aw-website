'use client';

import classNames from 'classnames';
import { useGenericFormBuilderContext } from 'helpers/GenericFormBuilder/GenericFormBuilderContext';
import { createContext, PropsWithChildren, useContext } from 'react';

type PageIndexWrapperProps = PropsWithChildren<{
  paddingGap: string;
  index: number;
}>;

type PageIndex = {
  currentTab: number;
};

const PageIndex = createContext<number>(-1);

export function usePageIndex() {
  const context = useContext(PageIndex);
  if (context === undefined) {
    throw new Error('usePageIndex must be used within a PageIndexProvider');
  }
  return context;
}

export function PageIndexWrapper({ index, paddingGap, children }: PageIndexWrapperProps) {
  const { currentPage } = useGenericFormBuilderContext();

  if (index != currentPage) {
    return null;
  }

  return (
    <PageIndex.Provider value={index}>
      <div className={classNames('grid grid-cols-12', paddingGap)}>{children}</div>
    </PageIndex.Provider>
  );
}
