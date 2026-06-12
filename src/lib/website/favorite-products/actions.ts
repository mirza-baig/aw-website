export enum ToggleFavoriteAction {
  added,
  removed,
}

export interface FavoriteProductsActions {
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (productId: string) => ToggleFavoriteAction;
}
