import { useWebsiteContext } from '../WebsiteContext';

export function useFavoriteProducts() {
  const { favoriteProducts, addToFavorites, removeFromFavorites, toggleFavorite } =
    useWebsiteContext();

  return {
    favoriteProducts,
    favoriteProductsCount: favoriteProducts.length,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
}
