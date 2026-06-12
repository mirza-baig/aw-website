import { Dispatch } from 'react';

import { FavoriteProductsActions } from './favorite-products/actions';
import { WebsiteDynamicState } from './website-state';

export type WebsiteContexAction =
  | ((prev: WebsiteDynamicState) => Partial<WebsiteDynamicState>)
  | Partial<WebsiteDynamicState>;

export type WebsiteActions = FavoriteProductsActions & { dispatch: Dispatch<WebsiteContexAction> };
