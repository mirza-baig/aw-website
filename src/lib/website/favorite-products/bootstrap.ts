import { Dispatch, useCallback, useEffect } from 'react';

import { WebsiteContexAction } from '../website-actions';
import { ToggleFavoriteAction } from './actions';

export function useFavoriteProductsBootstrap(
  dispatch: Dispatch<WebsiteContexAction>,
  favoriteProducts: string[]
) {
  const loadFromLocalStorage = useCallback(() => {
    const favoriteProductsString = localStorage.getItem('aw_favorites_products');
    if (favoriteProductsString == null) {
      return;
    }
    let favoriteProudctsData = JSON.parse(favoriteProductsString);
    if (!Array.isArray(favoriteProudctsData)) {
      return;
    }
    favoriteProudctsData = favoriteProudctsData.filter((value) => typeof value === 'string');
    dispatch({ favoriteProducts: favoriteProudctsData });
  }, [dispatch]);

  // Load favorite data from local storage on initial render
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Save favorite products to local storage whenever they change
  useEffect(() => {
    if (favoriteProducts.length === 0) {
      localStorage.removeItem('aw_favorites_products');
    } else {
      localStorage.setItem('aw_favorites_products', JSON.stringify(favoriteProducts));
    }
  }, [favoriteProducts]);

  useEffect(() => {
    window.addEventListener('storage', loadFromLocalStorage);

    return () => {
      window.removeEventListener('storage', loadFromLocalStorage);
    };
  }, [loadFromLocalStorage]);

  const addToFavorites = useCallback(
    (productId: string) => {
      dispatch((prev) =>
        prev.favoriteProducts.includes(productId)
          ? {}
          : { favoriteProducts: [productId, ...prev.favoriteProducts] }
      );
    },
    [dispatch]
  );

  const removeFromFavorites = useCallback(
    (productId: string) => {
      dispatch((prev) => ({
        favoriteProducts: prev.favoriteProducts.filter((id) => id !== productId),
      }));
    },
    [dispatch]
  );

  const toggleFavorite = useCallback(
    (productId: string): ToggleFavoriteAction => {
      if (favoriteProducts.includes(productId)) {
        removeFromFavorites(productId);
        return ToggleFavoriteAction.removed;
      } else {
        addToFavorites(productId);
        return ToggleFavoriteAction.added;
      }
    },
    [favoriteProducts, addToFavorites, removeFromFavorites]
  );

  const handleFavoriteProductClick = useCallback(
    (event: Event) => {
      const element = event?.target as Element;
      if (element === null) {
        return;
      }

      const closestFavoriteProduct = element.closest('.favorite-product');
      if (closestFavoriteProduct == null) {
        return;
      }

      const productID = closestFavoriteProduct.getAttribute('data-product-id');
      if (productID == null) {
        return;
      }

      const action = toggleFavorite(productID);

      // Manually update the local storage and dispatch storage event for cross-tab sync
      if (action == ToggleFavoriteAction.removed) {
        closestFavoriteProduct.classList.remove(
          'favorited',
          'border-[transparent_#f26924_transparent_transparent]'
        );
      } else {
        // If the product id is new, add it to the array
        closestFavoriteProduct.classList.add(
          'favorited',
          'border-[transparent_#f26924_transparent_transparent]'
        );
      }
    },
    [toggleFavorite]
  );

  useEffect(() => {
    // attach the event listener for the event handling to those specific sections (prodcut preview card and productintro)
    // where we have 'add to favroite product' option and consider event delegation
    const sectionElements1 = document.querySelectorAll(
      'section[data-component="listing/xupcardcollection"]'
    );
    const sectionElements2 = document.querySelectorAll(
      'section[data-component="product/productintro"]'
    );

    if (sectionElements1) {
      sectionElements1.forEach((sectionElement) => {
        sectionElement.addEventListener('click', handleFavoriteProductClick);
      });
    }

    if (sectionElements2) {
      sectionElements2.forEach((sectionElement) => {
        sectionElement.addEventListener('click', handleFavoriteProductClick);
      });
    }

    return () => {
      if (sectionElements1) {
        sectionElements1.forEach((sectionElement) => {
          sectionElement.removeEventListener('click', handleFavoriteProductClick);
        });
      }

      if (sectionElements2) {
        sectionElements2.forEach((sectionElement) => {
          sectionElement.removeEventListener('click', handleFavoriteProductClick);
        });
      }
    };
  }, [handleFavoriteProductClick]);

  return {
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
}
