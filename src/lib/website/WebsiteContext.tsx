'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { useFavoriteDesignsBootstrap } from './favorite-designs/bootstrap';
import { useFavoriteProductsBootstrap } from './favorite-products/bootstrap';
import { WebsiteActions, WebsiteContexAction } from './website-actions';
import { WebsiteDynamicState, WebsiteState, WebsiteStaticState } from './website-state';

type WebsiteContextType = WebsiteState & WebsiteActions;

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export type WebsiteContextProps = PropsWithChildren<{
  staticState: WebsiteStaticState;
  initialDynamicState: WebsiteDynamicState;
}>;

function stateReducer(
  state: WebsiteDynamicState,
  action: WebsiteContexAction
): WebsiteDynamicState {
  const newState = {
    ...state,
    ...(typeof action === 'function' ? action(state) : action),
  };
  return newState;
}

export function WebsiteContextProvider({
  children,
  staticState,
  initialDynamicState,
}: WebsiteContextProps) {
  const [dynamicState, dispatch] = useReducer(stateReducer, initialDynamicState);

  const favoriteProductsActions = useFavoriteProductsBootstrap(
    dispatch,
    dynamicState.favoriteProducts
  );
  const favoriteDesignsActions = useFavoriteDesignsBootstrap(
    dispatch,
    Array.isArray(dynamicState.favoriteDesigns) ? dynamicState.favoriteDesigns : []
  );

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      dispatch({
        mobileBannerList: [],
        desktopBannerList: [],
      });
    };
  }, []);

  return (
    <WebsiteContext.Provider
      value={useMemo(
        () => ({
          ...staticState,
          ...dynamicState,
          dispatch,
          ...favoriteProductsActions,
          ...favoriteDesignsActions,
        }),
        [dynamicState, favoriteProductsActions, favoriteDesignsActions, staticState]
      )}
    >
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsiteContext(): WebsiteContextType {
  const context = useContext(WebsiteContext);
  if (context === undefined) {
    throw new Error('useWebsiteContext must be used within a WebsiteContextProvider');
  }
  return context;
}
