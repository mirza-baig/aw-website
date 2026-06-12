import { useWebsiteContext } from '../WebsiteContext';

export function useFavoriteDesigns() {
  const {
    favoriteDesigns,
    addFavoriteDesign,
    removeFavoriteDesign,
    toggleFavoriteDesign,
    toggleFavoriteDesignByProductId,
    isLoading,
    error,
  } = useWebsiteContext();

  return {
    favoriteDesigns,
    favoriteDesignsCount: Array.isArray(favoriteDesigns) ? favoriteDesigns.length : 0,
    addFavoriteDesign,
    removeFavoriteDesign,
    toggleFavoriteDesign,
    toggleFavoriteDesignByProductId,
    isLoading,
    error,
  };
}
