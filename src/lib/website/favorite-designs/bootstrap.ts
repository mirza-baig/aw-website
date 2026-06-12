/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, useCallback, useEffect } from 'react';
import useSWR from 'swr';

import { WebsiteContexAction } from '../website-actions';

export interface DesignSelection {
  title: string;
  value: string;
  [key: string]: any;
}

export interface Design {
  createdDate: string;
  selections: DesignSelection[];
  productName?: string;
  productShortDescription?: string;
  [key: string]: any;
}

export interface ProductData {
  productId: { value: string };
  productName: { value: string };
  productShortDescription: { value: string };
  [key: string]: any;
}

export function useFavoriteDesignsBootstrap(
  dispatch: Dispatch<WebsiteContexAction>,
  favoriteDesigns: Design[]
) {
  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    const stored = localStorage.getItem('aw_favoritedesigns');
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        dispatch({ favoriteDesigns: parsed });
      }
    } catch {
      console.warn('Failed to parse favorite designs from localStorage');
    }
  }, [dispatch]);

  // Load on boot
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Persist changes
  useEffect(() => {
    if (favoriteDesigns?.length) {
      localStorage.setItem('aw_favoritedesigns', JSON.stringify(favoriteDesigns));
    } else {
      localStorage.removeItem('aw_favoritedesigns');
    }
  }, [favoriteDesigns]);

  // Extract product IDs for API
  const productIds = favoriteDesigns
    ?.map((d) => {
      const selections = d?.selections;
      if (!Array.isArray(selections)) {
        return undefined;
      }
      const found = selections.find((s) => s?.title === 'Product ID#');
      return found?.value;
    })
    ?.filter(Boolean) as string[];

  // API fetch function
  const fetcher = async (url: string): Promise<ProductData[]> => {
    if (!productIds.length) {
      return [];
    }

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ favoriteProducts: productIds, language: 'en' }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch favorite designs product data');
    }
    return res.json();
  };

  // SWR request
  const { data, error, isLoading } = useSWR<ProductData[], Error>(
    productIds?.length ? ['/api/aw/favorite-products'] : null,
    (url: string) => fetcher(url),
    { shouldRetryOnError: false }
  );

  // Enrich local designs with product data
  useEffect(() => {
    if (!data) {
      return;
    }
    const productsArray: ProductData[] = Array.isArray(data)
      ? data
      : (data && (data as any).productData) || [];

    const lookup = new Map<string, ProductData>(productsArray.map((p) => [p.productId.value, p]));

    const enriched = favoriteDesigns.map((design) => {
      const id = design.selections.find((s) => s.title === 'Product ID#')?.value;
      const product = id ? lookup.get(id) : undefined;

      if (!product) {
        return design;
      }

      return {
        ...design,
        productName: product.productName.value,
        productShortDescription: product.productShortDescription.value,
      };
    });

    dispatch({ favoriteDesigns: enriched });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Add design
  const addFavoriteDesign = useCallback(
    (design: Design) => {
      dispatch({ favoriteDesigns: [design, ...(favoriteDesigns || [])] });
    },
    [dispatch, favoriteDesigns]
  );

  // Remove design
  const removeFavoriteDesign = useCallback(
    (createdDate: string) => {
      dispatch({
        favoriteDesigns: (favoriteDesigns || []).filter((d) => d.createdDate !== createdDate),
      });
    },
    [dispatch, favoriteDesigns]
  );

  // Toggle
  const toggleFavoriteDesign = useCallback(
    (design: Design): 'added' | 'removed' => {
      const exists = favoriteDesigns.some((d) => d.createdDate === design.createdDate);

      if (exists) {
        removeFavoriteDesign(design.createdDate);
        return 'removed';
      } else {
        addFavoriteDesign(design);
        return 'added';
      }
    },
    [favoriteDesigns, addFavoriteDesign, removeFavoriteDesign]
  );

  // Toggle by productId
  const toggleFavoriteDesignByProductId = useCallback(
    (productId: string): 'added' | 'removed' | null => {
      const existingDesign = favoriteDesigns?.find(
        (design) => design.selections?.find((s) => s.title === 'Product ID#')?.value === productId
      );

      if (existingDesign) {
        removeFavoriteDesign(existingDesign.createdDate);
        return 'removed';
      }

      return null; // Design doesn't exist, can't add without full data
    },
    [favoriteDesigns, removeFavoriteDesign]
  );

  return {
    favoriteDesigns,
    isLoading,
    error,
    addFavoriteDesign,
    removeFavoriteDesign,
    toggleFavoriteDesign,
    toggleFavoriteDesignByProductId,
  };
}
