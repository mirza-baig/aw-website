/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect, useRef, useState } from 'react';

import {
  BucketKey,
  collectSwatchCollectionIds,
  DESTINATION_DEFAULTS,
  getDestinationHref,
  getProductTitle,
  getSeriesLabel,
  MAX_PRODUCT_LINK_DESTINATIONS,
  ProductLinkDestinationReport,
  seriesHasProducts,
  slugify,
} from './WithinSeriesChart.helper';

export const useResolvedSwatchCollections = (
  seriesList: any[],
  dataSource: string | undefined
): Record<string, any> => {
  const [resolved, setResolved] = useState<Record<string, any>>({});

  useEffect(() => {
    const ids = collectSwatchCollectionIds(seriesList);
    if (ids.length === 0) {
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/aw/product-compare-chart/resolve-swatches', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ids, language: 'en' }),
        });
        if (!res.ok) {
          console.warn('[WithinSeriesChart] resolve-swatches failed:', res.status);
          return;
        }
        const json = (await res.json()) as { results?: Record<string, any> };
        if (cancelled || !json?.results) {
          return;
        }
        const next: Record<string, any> = {};
        for (const [id, value] of Object.entries(json.results)) {
          if (value && Array.isArray(value.fields?.swatches) && value.fields.swatches.length > 0) {
            next[id] = value;
          }
        }
        if (Object.keys(next).length > 0) {
          setResolved((prev) => ({ ...prev, ...next }));
        }
      } catch (err) {
        console.warn('[WithinSeriesChart] resolve-swatches error:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  return resolved;
};

export const useDismissOnOutsideClick = (
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onDismiss: () => void
): void => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    const timer = globalThis.setTimeout(() => {
      document.addEventListener('mousedown', handleDocClick);
      document.addEventListener('keydown', handleKey);
    }, 0);
    return () => {
      globalThis.clearTimeout(timer);
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, containerRef, onDismiss]);
};

export const useGrabScroll = (containerRef: RefObject<HTMLDivElement | null>): void => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement)?.closest('a, button')) {
        return;
      }
      dragging = true;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      container.style.scrollBehavior = 'auto';
      container.classList.add('cursor-grabbing', 'select-none');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging) {
        return;
      }
      container.scrollLeft = startScrollLeft - (e.clientX - startX);
    };

    const handlePointerUp = () => {
      if (!dragging) {
        return;
      }
      dragging = false;
      container.style.scrollBehavior = '';
      container.classList.remove('cursor-grabbing', 'select-none');
    };

    container.addEventListener('pointerdown', handlePointerDown);
    globalThis.addEventListener('pointermove', handlePointerMove);
    globalThis.addEventListener('pointerup', handlePointerUp);
    globalThis.addEventListener('pointercancel', handlePointerUp);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      globalThis.removeEventListener('pointermove', handlePointerMove);
      globalThis.removeEventListener('pointerup', handlePointerUp);
      globalThis.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [containerRef]);
};

export const useCenteredCardIndex = (
  containerRef: RefObject<HTMLDivElement | null>,
  isMobile: boolean
): [number, (index: number) => void] => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) {
      return undefined;
    }
    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      const index = children.findIndex((child) => child.offsetLeft >= container.scrollLeft - 1);
      setActiveCardIndex(index === -1 ? 0 : index);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, isMobile]);

  return [activeCardIndex, setActiveCardIndex];
};

export const useHashSelection = (
  seriesList: any[],
  availableBuckets: BucketKey[],
  onMatch: (bucket: BucketKey, index: number) => void
): void => {
  const applied = useRef(false);
  if (applied.current || seriesList.length === 0) {
    return;
  }
  applied.current = true;
  const hash = globalThis.location?.hash?.replace('#', '') ?? '';
  if (!hash) {
    return;
  }
  for (const bucket of availableBuckets) {
    const matchIndex = seriesList.findIndex(
      (item) => seriesHasProducts(item, bucket) && slugify(getSeriesLabel(item, bucket)) === hash
    );
    if (matchIndex !== -1) {
      onMatch(bucket, matchIndex);
      return;
    }
  }
};

export const useDestinationDiagnostics = (
  destinationReport: ProductLinkDestinationReport,
  products: any[],
  activeSeries: any,
  activeSeriesLabel: string,
  deps: unknown[]
): void => {
  useEffect(() => {
    const { authored, rendered, unrecognized, overflow } = destinationReport;
    if (authored.length === 0) {
      return;
    }
    if (unrecognized.length > 0) {
      console.warn(
        `[WithinSeriesChart] product link destination(s) not recognised and dropped: ${unrecognized
          .map((entry) => `"${entry}"`)
          .join(', ')}. Expected something matching PDP, design tool, series or RAQ.`
      );
    }
    if (overflow.length > 0) {
      console.warn(
        `[WithinSeriesChart] ${authored.length} destinations authored — only the first ` +
          `${MAX_PRODUCT_LINK_DESTINATIONS} render (primary, secondary, tertiary); ` +
          `dropped: ${overflow.join(', ')}.`
      );
    }
    const firstProduct = products[0];
    if (firstProduct) {
      const unresolved = rendered.filter(
        (destination) => !getDestinationHref(destination, firstProduct, activeSeries)
      );
      if (unresolved.length > 0) {
        console.warn(
          `[WithinSeriesChart] no link found on "${getProductTitle(firstProduct, activeSeriesLabel)}" ` +
            `for destination(s): ${unresolved.join(', ')} — those buttons will not render.`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

type CTATier = 'primary' | 'secondary' | 'tertiary';
const CTA_TIERS: CTATier[] = ['primary', 'secondary', 'tertiary'];

export const buildProductCTAs = (
  productItem: any,
  productLinkDestinations: ReadonlyArray<keyof typeof DESTINATION_DEFAULTS>,
  activeSeries: any,
  activeSeriesLabel: string,
  tcText: (key: string) => string
): Array<{ label: string; href: string; tier: CTATier }> => {
  if (productLinkDestinations.length === 0) {
    const fallbackHref =
      productItem?.fields?.productDetailPageLink?.value?.href ??
      getDestinationHref('designTool', productItem, activeSeries) ??
      activeSeries?.fields?.seriesLink?.value?.href;
    if (!fallbackHref) {
      return [];
    }
    return [{ label: `Explore ${activeSeriesLabel}`.trim(), href: fallbackHref, tier: 'primary' }];
  }

  return productLinkDestinations
    .map((destination) => {
      const definition = DESTINATION_DEFAULTS[destination];
      return {
        label: tcText(definition.labelKey) || definition.defaultLabel(activeSeriesLabel),
        href: getDestinationHref(destination, productItem, activeSeries),
      };
    })
    .filter((cta): cta is { label: string; href: string } => !!cta.href)
    .map((cta, index) => ({ ...cta, tier: CTA_TIERS[index] ?? 'tertiary' }));
};
