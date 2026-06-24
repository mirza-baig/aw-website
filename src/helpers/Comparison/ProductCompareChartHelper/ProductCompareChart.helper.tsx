/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { hashCode } from 'lib/utils/string-utils/hash-code';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Disclaimer from 'src/helpers/DisclaimerText/DisclaimerText';
import ModalWrapper from 'src/helpers/ModalWrapper/ModalWrapper';
import SvgIcon from 'src/helpers/SvgIcon/SvgIcon';

import {
  getComparisonObject,
  getProductTypeLookupField,
  groupProductStyles,
} from './CompareChart.helper';
import { ProductTypeToCompareItem, SeriesTitle } from './ComparisonTable.Types';
import { ComparisonTitles } from './ComparisonTitles';
import { Selector } from './Selector';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ProductCompareChartProps =
  Sitecore.Components.Product.ComparisonTable.ProductCompareChart & ComponentProps;

const ENABLE_GRAPHQL_SWATCH_RESOLVER = true;

// Enum for Sitecore product bucket field.
enum ProductBucket {
  Windows = 'windowsProductTypes',
  Doors = 'doorsProductTypes',
}

// Extracted out of ProductCompareChart so it isn't redefined on every render
// and to satisfy SonarQube S6478 (no nested component definitions).
type NamedItemsCellProps = {
  items: { name: string; href?: string; target?: string }[];
  fieldName: string;
  maxVisible?: number;
};

const NamedItemsCell = ({ items, fieldName, maxVisible = 3 }: NamedItemsCellProps) => {
  const [expanded, setExpanded] = useState(false);
  const overflow = items.length - maxVisible;
  const visible = expanded ? items : items.slice(0, maxVisible);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(true);
  };
  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <div className="flex flex-col items-center font-sans! font-normal w-full px-1">
      {visible.map((it, i) =>
        it.href ? (
          <a
            key={`${fieldName}-${i}`}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F26924] hover:underline text-center"
          >
            {it.name}
          </a>
        ) : (
          <span key={`${fieldName}-${i}`} className="text-center">
            {it.name}
          </span>
        )
      )}
      {!expanded && overflow > 0 && (
        <button
          onClick={handleExpand}
          className="mt-1 text-[#F26924] underline cursor-pointer bg-transparent border-none p-0"
        >
          +{overflow} more
        </button>
      )}
      {expanded && overflow > 0 && (
        <button
          onClick={handleCollapse}
          className="mt-1 text-[#F26924] underline cursor-pointer bg-transparent border-none p-0"
        >
          show less
        </button>
      )}
    </div>
  );
};

type ResolvedSwatchCollectionClient = {
  id: string;
  fields: {
    swatchCollectionName?: { value: string };
    swatchCollectionDescription?: { value: string };
    swatchCollectionFooterCopy?: { value: string };
    swatches: Array<{
      id: string;
      name?: string;
      fields: {
        swatchName?: { value: string };
        swatchDescription?: { value: string };
        swatchImage?: {
          src: string;
          alt: string;
          width: number | string;
          height: number | string;
        };
      };
    }>;
  };
};

export const ProductCompareChart = /* NOSONAR */ (props: ProductCompareChartProps) => {
  const isProductComparison = props.fields && (() => 'products' in props.fields)();
  const originalGroupedProducts = isProductComparison && groupProductStyles(props.fields);
  const [selectedProductStyleIndex, setSelectedProductStyleIndex] = useState(0);
  const originalComparisonObject = getComparisonObject(
    isProductComparison
      ? {
          products:
            originalGroupedProducts.products[
              originalGroupedProducts.productStyles[selectedProductStyleIndex]?.productTitle
            ],
          tableStructure: props.fields.tableStructure,
        }
      : props.fields,
    isProductComparison
  );
  const [comparisonObject, setComparisonObject] = useState(originalComparisonObject);

  const [isProductSelectorVisible, setIsProductSelectorVisible] = useState(false);

  const [isSeriesSelectorVisible, setIsSeriesSelectorVisible] = useState(false);
  const [selectedProductTypeIndex, setSelectedProductTypeIndex] = useState(0);

  const { currentScreenWidth } = useCurrentScreenType();

  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const comparisonTableRef = useRef<HTMLDivElement | null>(null);
  const comparisonTableId = `comparison-table-${props?.fields?.sectionId?.value ?? hashCode(props?.rendering?.dataSource ?? '')}`;

  const [resolvedSwatchCollections, setResolvedSwatchCollections] = useState<
    Record<string, ResolvedSwatchCollectionClient>
  >({});

  const [openSwatchModal, setOpenSwatchModal] = useState<{
    swatches: Array<{ src?: string; alt?: string }>;
    top: number;
    left: number;
  } | null>(null);
  const swatchPopoverRef = useRef<HTMLDivElement | null>(null);

  // ── URL hash sync helpers ──
  // Converts a product type title to a URL-safe slug, e.g. "Awning Window" → "awning-window"
  const slugifyProductType = (title: string): string =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Store the initial hash so we can match it once product types are known.
  // Using a ref avoids triggering re-renders and keeps the value stable.
  const initialHashRef = useRef<string>(globalThis.location?.hash?.replace('#', '') ?? '');

  // After the component has product types available, apply the initial hash once.
  // We track whether we've already applied it to avoid re-running on every render.
  const hashAppliedRef = useRef(false);

  useEffect(() => {
    if (!openSwatchModal) {
      return undefined;
    }
    const handleDocClick = (e: MouseEvent) => {
      if (swatchPopoverRef.current && !swatchPopoverRef.current.contains(e.target as Node)) {
        setOpenSwatchModal(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenSwatchModal(null);
      }
    };
    const t = globalThis.setTimeout(() => {
      document.addEventListener('mousedown', handleDocClick);
      document.addEventListener('keydown', handleKey);
    }, 0);
    return () => {
      globalThis.clearTimeout(t);
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openSwatchModal]);

  useEffect(() => {
    if (!ENABLE_GRAPHQL_SWATCH_RESOLVER || !props.fields) {
      return;
    }

    const ids = new Set<string>();
    const seriesList = ((props.fields as any)?.seriesToCompare ?? []) as any[];

    const collectFromItem = (item: any) => {
      const fields = item?.fields;
      if (!fields || typeof fields !== 'object') {
        return;
      }
      for (const key of Object.keys(fields)) {
        const val = fields[key];
        if (
          val &&
          typeof val === 'object' &&
          typeof val.id === 'string' &&
          val.fields &&
          typeof val.fields === 'object' &&
          val.fields.swatches !== undefined &&
          !Array.isArray(val.fields.swatches)
        ) {
          ids.add(val.id);
        }
      }
    };

    for (const series of seriesList) {
      const buckets = [ProductBucket.Windows, ProductBucket.Doors] as const;
      for (const bucket of buckets) {
        const products = (series?.fields?.[bucket] as any[] | undefined) ?? [];
        for (const product of products) {
          collectFromItem(product);
        }
      }

      collectFromItem(series);
    }

    const idList = Array.from(ids);
    if (idList.length === 0) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/aw/product-compare-chart/resolve-swatches', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ids: idList, language: 'en' }),
        });
        if (!res.ok) {
          console.warn('[ProductCompareChart] resolve-swatches failed:', res.status);
          return;
        }
        const json = (await res.json()) as {
          results?: Record<string, ResolvedSwatchCollectionClient | null>;
        };
        if (cancelled || !json?.results) {
          return;
        }
        const next: Record<string, ResolvedSwatchCollectionClient> = {};
        for (const [id, val] of Object.entries(json.results)) {
          if (val && Array.isArray(val.fields?.swatches) && val.fields.swatches.length > 0) {
            next[id] = val;
          }
        }
        if (Object.keys(next).length > 0) {
          setResolvedSwatchCollections((prev) => ({ ...prev, ...next }));
        }
      } catch (err) {
        console.warn('[ProductCompareChart] resolve-swatches error:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rendering?.dataSource]);

  const findActiveCardIndex = (container: HTMLDivElement, scrollLeft: number): number => {
    const children = Array.from(container.children) as HTMLElement[];
    for (let i = 0; i < children.length; i += 1) {
      if (children[i].offsetLeft >= scrollLeft - 1) {
        return i;
      }
    }
    return 0;
  };

  useEffect(() => {
    const container = scrollableSectionRef.current;

    const handleScroll = () => {
      if (!container) {
        return;
      }
      const { scrollLeft } = container;
      for (const otherContainer of document.querySelectorAll('.no-scrollbar')) {
        if (otherContainer !== container) {
          (otherContainer as HTMLElement).scrollLeft = scrollLeft;
        }
      }
      if (isMobile && container.children.length) {
        setActiveCardIndex(findActiveCardIndex(container, scrollLeft));
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobile = currentScreenWidth <= getBreakpoint('ml');

  // ── Helper: render price level as $$$$ indicators ──
  const renderPrice = (priceData: any) => {
    const level = Number.parseInt(priceData?.priceLevel ?? '0', 10);
    const maxLevel = 5;
    return (
      <span
        className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}
        style={{ fontFamily: 'futura-pt, sans-serif' }}
      >
        {Array.from({ length: maxLevel }, (_, i) => (
          <span key={i} className={i < level ? 'text-black' : 'text-[#C4BFB6]'}>
            $
          </span>
        ))}
      </span>
    );
  };

  // ── Helper: render swatch circles with overflow count ──
  const renderSwatches = (swatchData: any, maxVisible?: number) => {
    const maxVisibleCount = maxVisible ?? (isMobile ? 2 : 4);
    if (!swatchData) {
      return <span>—</span>;
    }
    const swatches = swatchData?.swatches ?? swatchData;
    if (!Array.isArray(swatches) || swatches.length === 0) {
      return <span>—</span>;
    }
    const visible = swatches.slice(0, maxVisibleCount);
    const overflow = swatches.length - maxVisibleCount;
    return (
      <div className={`flex items-center justify-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
        {visible.map((swatch: any) =>
          swatch?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={swatch?.id}
              src={swatch.src}
              alt={swatch.alt ?? ''}
              className={`rounded-full border border-black/50 ${isMobile ? 'h-4.5 w-4.5' : 'h-6.25 w-6.25'}`}
            />
          ) : null
        )}
        {overflow > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setOpenSwatchModal({
                swatches,
                top: rect.top,
                left: rect.left + rect.width / 2,
              });
            }}
            aria-label={`Show all ${swatches.length} swatches`}
            className={`font-sans! font-normal cursor-pointer hover:underline focus:outline-none focus:underline ${isMobile ? 'text-[8px]' : 'text-sm'}`}
          >
            +{overflow}
          </button>
        )}
      </div>
    );
  };

  // ── Helper: render materials text ──
  const renderMaterials = (materialData: any) => {
    if (!materialData || !Array.isArray(materialData)) {
      return <span>—</span>;
    }
    const lines = materialData
      .filter(Boolean)
      .map((m: any) => {
        if (Array.isArray(m)) {
          return m[1];
        }
        return typeof m === 'string' ? m : '';
      })
      .filter(Boolean);
    return (
      <div className="flex flex-col items-center">
        {lines.map((line: string) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    );
  };

  if (!props.fields) {
    return <></>;
  }

  const allProductTypes: string[] = [];
  const productTypeSet = new Set<string>();

  const productTypeToCompare = (
    (props.fields as unknown as { productTypeToCompare?: ProductTypeToCompareItem[] })
      .productTypeToCompare ?? []
  ).filter(Boolean);

  const explicitProductTypeTitles: Array<{
    seriesIndex: number;
    url: { value: { href: string; text: string } };
    title: string;
    productTypeTitle: string;
    description?: string;
    image?: { src: string; alt?: string; width?: string | number; height?: string | number };
  }> = [];

  productTypeToCompare.forEach((item) => {
    const title = item.fields?.productTypeName?.value || item.displayName || item.name || '';

    if (!title || productTypeSet.has(title)) {
      return;
    }

    productTypeSet.add(title);
    allProductTypes.push(title);

    const imageValue = item.fields?.productTypeImage?.value as
      | { src?: string; alt?: string; width?: string | number; height?: string | number }
      | undefined;
    const image = imageValue?.src
      ? {
          src: imageValue.src,
          alt: imageValue.alt ?? title,
          width: imageValue.width,
          height: imageValue.height,
        }
      : undefined;

    explicitProductTypeTitles.push({
      seriesIndex: allProductTypes.length - 1,
      url: { value: { href: item.url || '#', text: title } },
      title,
      productTypeTitle: title,
      description: item.fields?.productTypeDescription?.value,
      image,
    });
  });

  // Apply the initial URL hash once the product types are loaded.
  if (!hashAppliedRef.current && allProductTypes.length > 0 && initialHashRef.current) {
    const matchIdx = allProductTypes.findIndex(
      (t) => slugifyProductType(t) === initialHashRef.current
    );
    if (matchIdx !== -1 && matchIdx !== selectedProductTypeIndex) {
      setSelectedProductTypeIndex(matchIdx);
    }
    hashAppliedRef.current = true;
  }

  const selectedProductTypeName =
    allProductTypes[selectedProductTypeIndex] || allProductTypes[0] || '';
  const selectedProductTypeId = (
    productTypeToCompare[selectedProductTypeIndex] ?? productTypeToCompare[0]
  )?.id;

  const filteredSeriesIndices: number[] = [];
  const seriesToCompareList = ((props.fields as any)?.seriesToCompare ?? []) as any[];

  const seriesOffersProductType = (
    seriesItem: any,
    productTypeId?: string
  ): {
    matched: boolean;
    via?: ProductBucket;
    lookupItem?: any;
  } => {
    if (!productTypeId || !seriesItem?.fields) {
      return { matched: false };
    }
    const targetId = productTypeId.replace(/[{}-]/g, '').toLowerCase();
    const buckets = [ProductBucket.Windows, ProductBucket.Doors];
    for (const bucket of buckets) {
      const lookupItems = (seriesItem.fields[bucket] as any[] | undefined) ?? [];
      for (const lookupItem of lookupItems) {
        const lookupFieldName = getProductTypeLookupField(lookupItem);
        if (!lookupFieldName) {
          continue;
        }
        const referenced = lookupItem.fields?.[lookupFieldName];
        const refId = (referenced?.id ?? '').toString().replace(/[{}-]/g, '').toLowerCase();
        if (refId && refId === targetId) {
          return { matched: true, via: bucket, lookupItem };
        }
      }
    }
    return { matched: false };
  };

  seriesToCompareList.forEach((seriesItem, idx) => {
    const result = seriesOffersProductType(seriesItem, selectedProductTypeId);
    if (result.matched) {
      filteredSeriesIndices.push(idx);
    }
  });

  const currentProductTypeName =
    selectedProductTypeName ||
    (isProductComparison
      ? (originalGroupedProducts?.productStyles?.[selectedProductStyleIndex]?.productTitle ?? '')
      : '');

  const selectedExplicitProductType = explicitProductTypeTitles[selectedProductTypeIndex];
  const currentProductTypeDescription =
    selectedExplicitProductType?.description ??
    (isProductComparison
      ? (originalGroupedProducts?.productStyles?.[selectedProductStyleIndex]?.productDescription ??
        '')
      : '');

  // Returns the FIRST matching product — kept for finalRowCTAs which only needs one.
  const getProductForSeries = (seriesIdx: number, productTypeId?: string): any => {
    const seriesItem = seriesToCompareList[seriesIdx];
    if (!seriesItem?.fields || !productTypeId) {
      return undefined;
    }
    const targetId = productTypeId.replace(/[{}-]/g, '').toLowerCase();
    const buckets = [ProductBucket.Windows, ProductBucket.Doors];
    for (const bucket of buckets) {
      const products = (seriesItem.fields[bucket] as any[] | undefined) ?? [];
      for (const product of products) {
        const lookupFieldName = getProductTypeLookupField(product);
        if (!lookupFieldName) {
          continue;
        }
        const referenced = product.fields?.[lookupFieldName];
        const refId = (referenced?.id ?? '').toString().replace(/[{}-]/g, '').toLowerCase();
        if (refId && refId === targetId) {
          return product;
        }
      }
    }
    return undefined;
  };

  // Returns ALL products in a series matching the given product type.
  // A single series (e.g. 400 Series) can have multiple products under the same
  // product type (e.g. Tilt-Wash Double-Hung AND Woodwright Double-Hung), so we
  // collect every match instead of stopping at the first one.
  const getProductsForSeries = (seriesIdx: number, productTypeId?: string): any[] => {
    const seriesItem = seriesToCompareList[seriesIdx];
    if (!seriesItem?.fields || !productTypeId) {
      return [];
    }
    const targetId = productTypeId.replaceAll(/[{}-]/g, '').toLowerCase();
    const results: any[] = [];
    const buckets = [ProductBucket.Windows, ProductBucket.Doors];
    for (const bucket of buckets) {
      const products = (seriesItem.fields[bucket] as any[] | undefined) ?? [];
      for (const product of products) {
        const lookupFieldName = getProductTypeLookupField(product);
        if (!lookupFieldName) {
          continue;
        }
        const referenced = product.fields?.[lookupFieldName];
        const refId = (referenced?.id ?? '').toString().replaceAll(/[{}-]/g, '').toLowerCase();
        if (refId && refId === targetId) {
          results.push(product);
        }
      }
    }
    return results;
  };

  const tc = (props.fields as any)?.tableConfiguration?.fields ?? {};
  const tcText = (key: string | undefined): string => {
    if (!key) {
      return '';
    }
    const raw = (tc?.[key]?.value as string | undefined) ?? '';
    return raw.replace(/\s*:\s*$/u, '').trim();
  };
  const tcLink = (
    key: string | undefined
  ): { text: string; href: string; target?: string } | undefined => {
    if (!key) {
      return undefined;
    }
    const v = tc?.[key]?.value as { text?: string; href?: string; target?: string } | undefined;
    if (!v?.href || !v?.text) {
      return undefined;
    }
    return { text: v.text, href: v.href, target: v.target };
  };

  const SECTION_HEIGHT = isMobile ? 'h-[32px]' : 'h-[44px]';
  const ROW_HEIGHT = isMobile ? 'h-[120px]' : 'h-[100px]';

  type LegendItem =
    | {
        kind: 'section';
        key: string;
        label: string;
        cta?: { text: string; href: string; target?: string };
        heightClass: string;
      }
    | {
        kind: 'row';
        key: string;
        label: string;
        fieldName: string;
        heightClass: string;
        zebra: boolean;
        cta?: { text: string; href: string; target?: string };
      };

  const tableStructure = ((props.fields as any)?.tableStructure ?? []) as any[];
  const sectionTplId = normalizeGuid(
    SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
      .ComparisonSection.Id
  );
  const subsectionTplId = normalizeGuid(
    SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Product
      .ComparisonSubsection.Id
  );

  const legendRows: LegendItem[] = [];
  let zebra = false;

  const resolveKey = (f: any): string | undefined => {
    if (!f) {
      return undefined;
    }
    return (
      getEnum<string>(f) ??
      (typeof f === 'string' ? f : undefined) ??
      (typeof f?.value === 'string' ? f.value : undefined) ??
      (typeof f?.fields?.Phrase?.value === 'string' ? f.fields.Phrase.value : undefined) ??
      undefined
    );
  };

  tableStructure.forEach((el: any, idx: number) => {
    const tplId = normalizeGuid(el?.fields?._AW_TemplateId?.value ?? '');
    if (tplId === sectionTplId) {
      const titleKey = resolveKey(el?.fields?.titleFieldName);
      const ctaKey = resolveKey(el?.fields?.ctaFieldName);
      legendRows.push({
        kind: 'section',
        key: `sec-${idx}-${titleKey ?? ''}`,
        label: tcText(titleKey),
        cta: tcLink(ctaKey),
        heightClass: SECTION_HEIGHT,
      });
      zebra = false;
    } else if (tplId === subsectionTplId) {
      const titleKey = resolveKey(el?.fields?.titleFieldName);
      const valueKey = resolveKey(el?.fields?.valueFieldName);
      if (!valueKey) {
        return;
      }
      const findTcKeyForValue = (): string | undefined => {
        if (titleKey) {
          return titleKey;
        }
        const sectionTitleKey = `${valueKey}SectionTitle`;
        if (tcText(sectionTitleKey)) {
          return sectionTitleKey;
        }
        const lowerVk = valueKey.toLowerCase();
        const tcKeys = Object.keys(tc);
        return tcKeys.find((k) => {
          const lk = k.toLowerCase();
          if (lk === lowerVk) {
            return false;
          }
          return (
            lk.endsWith(lowerVk) ||
            lk.replace('options', '').endsWith(lowerVk) ||
            lk.startsWith(lowerVk)
          );
        });
      };
      const labelKey = findTcKeyForValue();
      const label = tcText(labelKey);
      const rowCta =
        tcLink(titleKey ? `${titleKey}CTA` : undefined) ??
        tcLink(labelKey ? `${labelKey}CTA` : undefined) ??
        tcLink(
          labelKey?.endsWith('SectionTitle')
            ? `${labelKey.slice(0, -'SectionTitle'.length)}SectionCTA`
            : undefined
        ) ??
        tcLink(`${valueKey}SectionCTA`);

      legendRows.push({
        kind: 'row',
        key: `row-${idx}-${valueKey}`,
        label,
        fieldName: valueKey,
        heightClass: ROW_HEIGHT,
        zebra,
        cta: rowCta,
      });
      zebra = !zebra;
    }
  });

  const hasAnyRow = legendRows.some((r) => r.kind === 'row');
  if (!hasAnyRow) {
    const FALLBACK_ROWS: Array<{ labelKey: string; fieldName: string }> = [
      { labelKey: 'materials', fieldName: 'productMaterials' },
      { labelKey: 'standardExteriorColors', fieldName: 'featuredExteriorColors' },
      { labelKey: 'standardInteriorColors', fieldName: 'featuredInteriorColors' },
      { labelKey: 'interiorWoodSpecies', fieldName: 'interiorWoodSpecies' },
      { labelKey: 'interiorWoodStainFinishes', fieldName: 'featuredInteriorFinishesOptions' },
      { labelKey: 'productOptionsPriceLevel', fieldName: 'priceLevel' },
    ];
    let fallbackZebra = false;
    FALLBACK_ROWS.forEach((r, idx) => {
      legendRows.push({
        kind: 'row',
        key: `fallback-${idx}-${r.fieldName}`,
        label: tcText(r.labelKey),
        fieldName: r.fieldName,
        heightClass: ROW_HEIGHT,
        zebra: fallbackZebra,
        cta: tcLink(`${r.labelKey}CTA`),
      });
      fallbackZebra = !fallbackZebra;
    });
  }

  // Field name aliases: tableStructure valueFieldName → actual Sitecore field name(s)
  const FIELD_ALIASES: Record<string, string[]> = {
    materials: ['materials', 'productMaterials'],
    productMaterials: ['productMaterials', 'materials'],
    standardExteriorColors: ['standardExteriorColors', 'featuredExteriorColors', 'exteriorColors'],
    standardInteriorColors: ['standardInteriorColors', 'featuredInteriorColors', 'interiorColors'],
    standardInteriorSpecies: ['standardInteriorSpecies', 'interiorWoodSpecies', 'woodSpecies'],
    featuredExteriorColors: ['featuredExteriorColors', 'standardExteriorColors', 'exteriorColors'],
    featuredInteriorColors: ['featuredInteriorColors', 'standardInteriorColors', 'interiorColors'],
    interiorWoodSpecies: ['interiorWoodSpecies', 'standardInteriorSpecies', 'woodSpecies'],
    hardwareFinishes: ['hardwareFinishes', 'featuredHardwareFinishes'],
    hardwareStyles: ['hardwareStyles', 'featuredHardwareStyles'],
  };

  const isEmptyValue = (v: any): boolean => {
    if (v === undefined || v === null) {
      return true;
    }
    if (Array.isArray(v)) {
      return v.length === 0;
    }
    if (typeof v === 'object') {
      if ('value' in v) {
        return v.value === undefined || v.value === null || v.value === '';
      }
      if ('swatches' in v) {
        return !Array.isArray(v.swatches) || v.swatches.length === 0;
      }
      const innerSwatches = v.fields?.swatches;
      if (innerSwatches !== undefined && !Array.isArray(innerSwatches)) {
        return true;
      }
      return Object.keys(v).length === 0;
    }
    if (typeof v === 'string') {
      return v.trim() === '';
    }
    return false;
  };

  // S3776: extracted swatch-collection resolution so pickRaw stays readable
  const resolveSwatchCollection = (v: any): any => {
    if (
      !ENABLE_GRAPHQL_SWATCH_RESOLVER ||
      !v ||
      typeof v !== 'object' ||
      typeof v.id !== 'string' ||
      v?.fields?.swatches === undefined ||
      Array.isArray(v.fields.swatches)
    ) {
      return undefined;
    }
    return resolvedSwatchCollections[v.id];
  };

  const pickRaw = (fieldName: string, sources: any[]): any => {
    const aliases = FIELD_ALIASES[fieldName] ?? [fieldName];
    for (const src of sources) {
      const f = src?.fields ?? {};
      for (const alias of aliases) {
        const v = f[alias];
        const resolved = resolveSwatchCollection(v);
        if (resolved) {
          return resolved;
        }
        if (!isEmptyValue(v)) {
          return v;
        }
      }
    }
    return undefined;
  };

  const NAME_FIELD_PRIORITY = [
    'productName',
    'productFullName',
    'materialName',
    'swatchName',
    'glassType',
    'installMethodName',
  ];

  const renderSwatchArray = (raw: any[]): React.ReactElement => {
    const swatches = raw.map((s: any) => s?.fields?.swatchImage?.value).filter((v: any) => v?.src);
    return renderSwatches({ swatches });
  };

  const renderNamedItems = (raw: any[], fieldName: string): React.ReactElement | null => {
    const namedItems = raw
      .map((it: any) => {
        const fields = it?.fields ?? {};
        const preferred = NAME_FIELD_PRIORITY.find(
          (k) => typeof fields[k]?.value === 'string' && fields[k].value.trim()
        );
        const nameField = preferred ?? Object.keys(fields).find((k) => /name$/i.test(k));
        const name = nameField ? fields[nameField]?.value : undefined;
        const link =
          fields.productDetailPageLink?.value ?? fields.pdpLink?.value ?? fields.link?.value;
        return {
          name,
          href: link?.href as string | undefined,
          target: link?.target as string | undefined,
        };
      })
      .filter((r) => typeof r.name === 'string' && r.name.trim());
    if (namedItems.length === 0) {
      return null;
    }
    return (
      <NamedItemsCell items={namedItems} fieldName={fieldName} maxVisible={isMobile ? 2 : 3} />
    );
  };

  const renderFieldsObject = (fields: Record<string, any>): React.ReactElement | null => {
    const nestedSwatches = fields.swatches ?? fields.featuredSwatches;
    if (Array.isArray(nestedSwatches) && nestedSwatches.length > 0) {
      const swatchImgs = nestedSwatches
        .map((s: any) => s?.fields?.swatchImage?.value ?? s?.fields?.swatchImage)
        .filter((v: any) => v?.src);
      if (swatchImgs.length > 0) {
        return renderSwatches({ swatches: swatchImgs });
      }
    }
    if (Array.isArray(fields.swatchImages)) {
      const swatchImgs = fields.swatchImages.filter((v: any) => v?.src);
      if (swatchImgs.length > 0) {
        return renderSwatches({ swatches: swatchImgs });
      }
    }
    const nameField = Object.keys(fields).find((k) => /name$/i.test(k));
    const text = nameField ? fields[nameField]?.value : undefined;
    if (typeof text === 'string' && text.trim()) {
      return <span className="font-sans! font-normal">{text.trim()}</span>;
    }
    return null;
  };

  // NOSONAR
  const renderProductCell = (product: any, fieldName: string, seriesItem?: any) => {
    // NOSONAR
    const sources = [product, seriesItem].filter(Boolean);
    const raw = pickRaw(fieldName, sources);

    if (fieldName === 'priceLevel') {
      return renderPrice({ priceLevel: raw?.fields?.priceLevelText?.value ?? '0' });
    }

    if (fieldName === 'materials' || fieldName === 'productMaterials') {
      const arr = Array.isArray(raw) ? raw : [];
      const lines = arr
        .map((m: any) => [null, m?.fields?.materialName?.value])
        .filter((r: any) => r[1]);
      return renderMaterials(lines);
    }

    if (Array.isArray(raw)) {
      const looksLikeSwatchArray = raw.length > 0 && raw[0]?.fields?.swatchImage;
      if (looksLikeSwatchArray) {
        return renderSwatchArray(raw);
      }
      return renderNamedItems(raw, fieldName) ?? <span>—</span>;
    }

    if (raw && typeof raw === 'object' && Array.isArray(raw.swatches)) {
      return renderSwatches(raw);
    }

    if (raw && typeof raw === 'object' && raw.fields) {
      const result = renderFieldsObject(raw.fields);
      if (result) {
        return result;
      }
    }

    if (raw && typeof raw === 'object' && 'value' in raw) {
      const v = raw.value;
      if (typeof v === 'string' && v.trim()) {
        const trimmed = v.trim();
        if (/<[a-z][\s\S]*>/i.test(trimmed)) {
          return (
            <span
              className="font-sans! font-normal"
              dangerouslySetInnerHTML={{ __html: trimmed }}
            />
          );
        }
        return <span className="font-sans! font-normal">{trimmed}</span>;
      }
    }

    return <span>—</span>;
  };

  const getInteriorColorsComment = (product: any, seriesItem?: any): string | undefined => {
    const tryFrom = (item: any) => {
      const sc = item?.fields?.standardInteriorColors?.fields;
      return (
        sc?.swatchCollectionDescription?.value ?? sc?.swatchCollectionComments?.value ?? undefined
      );
    };
    return tryFrom(product) ?? tryFrom(seriesItem);
  };

  // Count total visible cards: a series with N products matching the selected type
  // renders N cards, not 1.
  const visibleCardsCount = filteredSeriesIndices.reduce((count, seriesIdx) => {
    const products = getProductsForSeries(seriesIdx, selectedProductTypeId);
    return count + (products.length > 0 ? products.length : 1);
  }, 0);

  type ProductLinkDestinationKey =
    | 'productDetailPage'
    | 'designTool'
    | 'seriesLanding'
    | 'requestAQuote';

  const productLinkDestinationsRaw =
    ((props.fields as any)?.productLinkDestinationCTAs as any[] | undefined) ??
    ((props.fields as any)?.productLinkDestinations as any[] | undefined) ??
    [];

  const normalizeDestinationKey = (
    raw: string | undefined
  ): ProductLinkDestinationKey | undefined => {
    if (!raw) {
      return undefined;
    }
    const k = raw.toLowerCase().replace(/[\s_-]+/g, '');
    if (k === 'productdetailpage' || k === 'pdp') {
      return 'productDetailPage';
    }
    if (k === 'designtool' || k === 'design') {
      return 'designTool';
    }
    if (k === 'series' || k === 'serieslanding') {
      return 'seriesLanding';
    }
    if (k === 'raq' || k === 'requestaquote' || k === 'quote') {
      return 'requestAQuote';
    }
    return undefined;
  };

  const productLinkDestinations: ProductLinkDestinationKey[] = productLinkDestinationsRaw
    .map((it) => normalizeDestinationKey(resolveKey(it)))
    .filter((k): k is ProductLinkDestinationKey => !!k)
    .slice(0, 3);

  const destinationDefaults: Record<
    ProductLinkDestinationKey,
    { labelKey: string; defaultLabel: (seriesTitle: string) => string }
  > = {
    productDetailPage: {
      labelKey: 'productLinkPDPText',
      defaultLabel: () => 'View this product',
    },
    designTool: {
      labelKey: 'productLinkDesignToolText',
      defaultLabel: () => 'Design this product',
    },
    seriesLanding: {
      labelKey: 'productLinkSeriesLandingText',
      defaultLabel: (t) => `View ${t}`,
    },
    requestAQuote: {
      labelKey: 'productLinkRequestAQuoteText',
      defaultLabel: () => 'Request a Quote',
    },
  };

  const getDestinationHref = (
    dest: ProductLinkDestinationKey,
    product: any,
    seriesItem: any
  ): string | undefined => {
    const pf = product?.fields ?? {};
    const sf = seriesItem?.fields ?? {};
    switch (dest) {
      case 'productDetailPage':
        return pf.productDetailPageLink?.value?.href ?? sf.productDetailPageLink?.value?.href;
      case 'designTool': {
        // Design Tool deep-links the product via the Sitecore `anchor` field
        // (e.g. "/<guid>/0") which must be appended as a hash fragment so the
        // SPA loads the right product.
        const link = pf.designToolLink?.value ?? sf.designToolLink?.value;
        if (!link?.href) {
          return undefined;
        }
        const anchor = typeof link.anchor === 'string' ? link.anchor.trim() : '';
        return anchor ? `${link.href}#${anchor.replace(/^#/, '')}` : link.href;
      }
      case 'seriesLanding':
        return (
          sf.seriesLandingPageCTA?.value?.href ??
          sf.seriesLandingPageLink?.value?.href ??
          sf.seriesLink?.value?.href ??
          sf.seriesLandingLink?.value?.href ??
          sf.exploreAllProducts?.value?.href ??
          pf.exploreAllProducts?.value?.href ??
          pf.seriesLink?.value?.href
        );
      case 'requestAQuote': {
        // Build an absolute URL using the current origin when available,
        // falling back to a site-root-relative path.
        const origin =
          typeof globalThis?.location?.origin === 'string'
            ? globalThis.location.origin.replace(/\/+$/u, '')
            : '';
        return origin ? `${origin}/request-a-quote/` : '/request-a-quote/';
      }
      default:
        return undefined;
    }
  };

  type CTATier = 'primary' | 'secondary' | 'tertiary';
  const buildCardCTAs = (
    series: any,
    product: any,
    seriesItem: any,
    fallbackUrl: string | undefined
  ): { label: string; href: string; tier: CTATier }[] => {
    if (productLinkDestinations.length === 0) {
      if (!fallbackUrl) {
        return [];
      }
      return [{ label: `Explore ${series.title}`, href: fallbackUrl, tier: 'primary' }];
    }
    const resolved = productLinkDestinations.map((dest) => {
      const href = getDestinationHref(dest, product, seriesItem);
      const def = destinationDefaults[dest];
      const label = tcText(def.labelKey) || def.defaultLabel(series.title);
      return { dest, label, href };
    });

    const tiers: CTATier[] = ['primary', 'secondary', 'tertiary'];
    return resolved
      .filter((r) => !!r.href)
      .map((r, i) => ({ label: r.label, href: r.href as string, tier: tiers[i] ?? 'tertiary' }));
  };

  const ctaTierClasses = (tier: CTATier): string => {
    const base =
      'w-full whitespace-normal rounded-lg border-4 px-m py-[9px] font-sans text-button font-heavy disabled:border-gray disabled:text-gray disabled:cursor-not-allowed';
    if (tier === 'primary') {
      return `${base} border-theme-btn-border bg-theme-btn-bg text-theme-btn-text hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover disabled:hover:bg-theme-btn-bg`;
    }
    if (tier === 'secondary') {
      return `${base} theme-btn-secondary-border border-black bg-theme-btn-secondary-bg text-theme-btn-secondary-text hover:border-theme-btn-secondary-border-hover hover:bg-theme-btn-secondary-bg-hover hover:text-theme-btn-secondary-text-hover disabled:bg-gray`;
    }
    return `${base} border-gray hover:border-black hover:bg-black hover:text-white disabled:hover:bg-theme-btn-bg`;
  };

  type FinalRowCTA = { label: string; href: string; target?: string };
  const finalRowCTAsRaw =
    ((props.fields as any)?.finalRowCTAs as any[] | undefined) ??
    ((props.fields as any)?.finalRowCTAOptions as any[] | undefined) ??
    [];

  const finalRowCTAs: FinalRowCTA[] = finalRowCTAsRaw
    .map((it: any): FinalRowCTA | undefined => {
      const f = it?.fields ?? {};
      const linkVal = f.link?.value;
      if (linkVal?.href) {
        return {
          label: linkVal.text || it.displayName || it.name || 'Learn more',
          href: linkVal.href,
          target: linkVal.target,
        };
      }
      if (f.linkUrl?.value?.href || f.linkUrl?.value) {
        const href = typeof f.linkUrl.value === 'string' ? f.linkUrl.value : f.linkUrl.value.href;
        if (href) {
          return {
            label: f.linkText?.value || it.displayName || it.name || 'Learn more',
            href,
            target: f.linkUrl.value?.target,
          };
        }
      }
      const key = normalizeDestinationKey(resolveKey(it));
      if (key && destinationDefaults[key]) {
        const firstSeriesIdx = filteredSeriesIndices[0];
        const seriesItem = seriesToCompareList[firstSeriesIdx];
        const product = getProductForSeries(firstSeriesIdx, selectedProductTypeId);
        const href = getDestinationHref(key, product, seriesItem);
        if (href) {
          const def = destinationDefaults[key];
          return { label: tcText(def.labelKey) || def.defaultLabel(''), href };
        }
      }
      return undefined;
    })
    .filter((v): v is FinalRowCTA => !!v);

  const handleOpenProductSelector = () => setIsProductSelectorVisible(true);
  const handleCloseProductSelector = () => setIsProductSelectorVisible(false);
  const handleCloseSeriesSelector = () => setIsSeriesSelectorVisible(false);
  const handleScrollLeft = () => {
    scrollableSectionRef.current?.scrollBy({ left: -(isMobile ? 190 : 292), behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    scrollableSectionRef.current?.scrollBy({ left: isMobile ? 190 : 292, behavior: 'smooth' });
  };
  const handleSelectionChange = (indices: number[]) => {
    if (indices.length > 0) {
      const idx = indices[0];
      setSelectedProductTypeIndex(idx);
      //Slug Url Shareable
      const slug = slugifyProductType(allProductTypes[idx] ?? '');
      if (slug) {
        globalThis.history.replaceState(null, '', `#${slug}`);
      }
    }
  };
  const handleCloseSwatchModal = () => setOpenSwatchModal(null);

  return (
    <>
      <div className="col-span-12">
        <div className="mx-m ml:-mx-0">
          {isProductComparison && originalGroupedProducts?.productStyles?.length > 1 && (
            <div className="mb-xxs w-full">
              {/* S1082: replaced non-interactive <div onClick> with <button> */}
              <button
                type="button"
                onClick={handleOpenProductSelector}
                className="flex cursor-pointer items-center !font-sans text-base font-demi bg-transparent border-none p-0"
              >
                <Text
                  tag="h3"
                  field={{
                    value: (
                      props.fields.tableConfiguration?.fields.changeProductStyleCTAText as Field
                    )?.value as string,
                  }}
                />
                <SvgIcon className="ml-xxs" icon="pencil" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12">
        {originalGroupedProducts?.productStyles?.length > 1 && isProductSelectorVisible && (
          <ModalWrapper
            isModalOpen={
              originalGroupedProducts?.productStyles?.length > 1 && isProductSelectorVisible
            }
            handleClose={handleCloseProductSelector}
            size={isMobile ? 'extra-large' : 'fluid'}
          >
            <Selector
              productsStylesList={originalGroupedProducts.productStyles}
              selectedProductStyleIndex={selectedProductStyleIndex}
              productStyleIndexSetter={setSelectedProductStyleIndex}
              toggleSelector={setIsProductSelectorVisible}
              tableConfiguration={
                props.fields
                  .tableConfiguration as Sitecore.Components.Product.ComparisonTable.ComparisonTableConfiguration
              }
              isProductSelector={true}
              isImageVisible={true}
            />
          </ModalWrapper>
        )}
        {isSeriesSelectorVisible && comparisonObject && (
          <ModalWrapper
            isModalOpen={comparisonObject && isSeriesSelectorVisible}
            handleClose={handleCloseSeriesSelector}
            size={isMobile ? 'extra-large' : 'fluid'}
          >
            <Selector
              // @ts-ignore original comparison object may have unexpected fields
              originalComparisonObject={originalComparisonObject}
              currentSelectedSeries={comparisonObject.seriesTitles ?? []}
              toggleSelector={setIsSeriesSelectorVisible}
              comparisonObjectSetter={setComparisonObject}
              tableConfiguration={
                props.fields
                  .tableConfiguration as Sitecore.Components.Product.ComparisonTable.ComparisonTableConfiguration
              }
              isImageVisible={isProductComparison}
            />
          </ModalWrapper>
        )}

        {comparisonObject && (
          <div
            id={comparisonTableId}
            ref={comparisonTableRef}
            className="relative shadow-[0px_4px_14px_-3px_rgba(0,0,0,0.06)]"
          >
            {allProductTypes.length > 0 &&
              (() => {
                const productTypeTitles = explicitProductTypeTitles;
                const selectedTitle = productTypeTitles[selectedProductTypeIndex];
                return (
                  <ComparisonTitles
                    comparisonTitles={
                      (selectedTitle ? [selectedTitle] : []) as unknown as SeriesTitle[]
                    }
                    allSeriesTitles={productTypeTitles as unknown as SeriesTitle[]}
                    removeSeries={() => {}}
                    totalNumberOfSeries={productTypeTitles.length}
                    toggleSeriesSelector={() => {}}
                    onSelectionChange={handleSelectionChange}
                    isMobile={isMobile}
                    isProductComparison={false}
                    comparisonTableRef={comparisonTableRef}
                    singleSelect
                    selectedText={
                      (props.fields as any).productSelectedLabel?.value ||
                      (props.fields as any).productTypeSelectionCardSelectedText?.value ||
                      'SELECTED: SEE BELOW'
                    }
                  />
                );
              })()}

            <div className={`flex ${isMobile ? 'gap-1 p-[10px]' : 'gap-5 py-[15px]'}`}>
              {/* ── Left Legend Panel ── */}
              <div
                className={`shrink-0 bg-white shadow-[10px_0_14px_-20px_rgb(0,0,0)] ${
                  isMobile
                    ? 'min-w-[100px] max-w-[100px] px-2 pt-[13px] pb-[60px]'
                    : 'min-w-[200px] max-w-[310px] px-10 pt-[21px] pb-[120px]'
                }`}
              >
                <div
                  className={`flex w-full shrink-0 flex-col justify-start ${isMobile ? 'gap-1 h-[150px] pb-2' : 'gap-2 h-[216px] pb-4'}`}
                >
                  <span
                    className={`font-bold uppercase tracking-wider text-[#F26924] ${
                      isMobile ? 'text-[10px] leading-tight' : 'text-lg'
                    }`}
                    style={{ fontFamily: 'futura-pt, sans-serif', letterSpacing: '0.9px' }}
                  >
                    COMPARE
                  </span>
                  <span
                    className={`font-bold line-clamp-3 ${
                      isMobile ? 'text-[13px] leading-tight' : 'text-[28px]'
                    }`}
                    style={{ fontFamily: 'futura-pt, sans-serif' }}
                  >
                    {currentProductTypeName}
                  </span>
                  {currentProductTypeDescription && (
                    <span
                      className={`text-[#333] !font-sans ${
                        isMobile ? 'text-[8px] hidden' : 'text-sm'
                      }`}
                    >
                      {currentProductTypeDescription}
                    </span>
                  )}
                </div>

                {legendRows.map((row) => {
                  if (row.kind === 'section') {
                    return (
                      <div
                        key={row.key}
                        className={`flex flex-col justify-center border-b border-[#CCC] p-[20px] font-sans! ${row.heightClass} ${isMobile ? 'text-[10px]' : 'text-base'}`}
                      >
                        <span className="font-bold uppercase tracking-wide">{row.label}</span>
                        {row.cta && (
                          <a
                            href={row.cta.href}
                            target={row.cta.target || undefined}
                            rel={row.cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                            className={`mt-0.5 inline-block font-demi text-[#F26924] underline underline-offset-2 hover:no-underline ${isMobile ? 'text-[8px]' : 'text-xs'}`}
                          >
                            {row.cta.text}
                          </a>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={row.key}
                      className={`flex flex-col justify-center border-b border-[#CCC] !font-sans p-[20px] font-normal ${row.heightClass} ${isMobile ? 'text-[9px]' : 'text-base'} ${row.zebra ? 'bg-[#FCFAFA]' : ''}`}
                    >
                      <span>{row.label}</span>
                      {row.cta && (
                        <a
                          href={row.cta.href}
                          target={row.cta.target || undefined}
                          rel={row.cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                          className={`mt-0.5 inline-block font-demi text-[#F26924] underline underline-offset-2 hover:no-underline ${isMobile ? 'text-[8px]' : 'text-[12px]'}`}
                        >
                          {row.cta.text}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Scrollable Product Cards Area with Slider Arrows ── */}
              <div className="relative flex-1 min-w-0">
                {!isMobile && (
                  <button
                    type="button"
                    onClick={handleScrollLeft}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-[#E0E0E0] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors duration-200"
                    aria-label="Scroll left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                {!isMobile && (
                  <button
                    type="button"
                    onClick={handleScrollRight}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-[#E0E0E0] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors duration-200"
                    aria-label="Scroll right"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
                )}

                <div
                  ref={scrollableSectionRef}
                  className={`flex overflow-x-auto overflow-y-hidden scroll-smooth ${isMobile ? 'gap-2 px-2' : 'gap-3 px-6'}`}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {comparisonObject.seriesTitles?.flatMap((series, seriesIdx) => {
                    if (!series) {
                      return [];
                    }
                    if (!filteredSeriesIndices.includes(seriesIdx)) {
                      return [];
                    }
                    const seriesSourceItem = seriesToCompareList[seriesIdx];
                    const matchedProducts = getProductsForSeries(seriesIdx, selectedProductTypeId);
                    // Fall back to a single undefined slot so the series still
                    // renders a card even when no specific product is matched.
                    const productItems: any[] =
                      matchedProducts.length > 0 ? matchedProducts : [undefined];

                    return productItems.map((productItem, productIdx) => {
                      const exploreUrl =
                        productItem?.fields?.productDetailPageLink?.value?.href ??
                        getDestinationHref('designTool', productItem, seriesSourceItem) ??
                        seriesSourceItem?.fields?.seriesLink?.value?.href ??
                        undefined;
                      const productImageVal =
                        productItem?.fields?.productImage?.value ??
                        seriesSourceItem?.fields?.productImage?.value;
                      const seriesImage = productImageVal?.src ? productImageVal : undefined;

                      return (
                        <div
                          key={`${series.seriesIndex}-${productIdx}`}
                          className={`flex flex-col items-start rounded bg-white border border-[#EAEAEA] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${
                            isMobile
                              ? 'min-w-[160px] w-[160px] px-2 py-3'
                              : 'min-w-[280px] w-[280px] px-2.5 py-5'
                          }`}
                        >
                          <div
                            className={`flex w-full shrink-0 flex-col justify-start ${isMobile ? 'h-[150px] pb-2' : 'h-[216px] pb-4'}`}
                          >
                            <div
                              className={`flex ${isMobile ? 'h-[90px]' : 'h-[134px]'} w-full items-center justify-center`}
                            >
                              {seriesImage?.src && (
                                <Image
                                  src={seriesImage.src}
                                  width={
                                    seriesImage?.width
                                      ? Number.parseInt(seriesImage.width, 10)
                                      : 134
                                  }
                                  height={
                                    seriesImage?.height
                                      ? Number.parseInt(seriesImage.height, 10)
                                      : 134
                                  }
                                  alt={(seriesImage?.alt as string) || series?.title}
                                  unoptimized={isSvgUrl(seriesImage?.src)}
                                  className="h-full w-auto object-contain"
                                />
                              )}
                            </div>
                            <div
                              className={`flex items-center justify-center gap-1 text-center font-sans! font-bold ${isMobile ? 'text-xs mt-2' : 'text-base mt-4'}`}
                            >
                              <span className="line-clamp-2">
                                {productItem?.fields?.expandedSeriesName?.value ||
                                  productItem?.fields?.productFullName?.value}
                              </span>
                            </div>
                            <div
                              className={`flex items-center justify-center gap-1 text-center font-sans! ${isMobile ? 'text-xs mt-2' : 'text-base mt-2'}`}
                            >
                              <span className="line-clamp-2">
                                {productItem?.fields?.productSubtype?.value}
                              </span>
                            </div>
                          </div>

                          {legendRows.map((row) => {
                            if (row.kind === 'section') {
                              return (
                                <div
                                  key={row.key}
                                  className={`flex w-full shrink-0 items-center justify-center border-b border-[#CCC] ${row.heightClass}`}
                                />
                              );
                            }
                            const isIntColorsRow = row.fieldName === 'standardInteriorColors';
                            const comment = isIntColorsRow
                              ? getInteriorColorsComment(productItem, seriesSourceItem)
                              : undefined;
                            return (
                              <div
                                key={row.key}
                                className={`flex w-full shrink-0 flex-col items-center justify-center gap-0.5 border-b border-[#CCC] text-center  min-h-[100px] ${isMobile ? 'min-h-[120px] text-[10px]' : 'min-h-[100px] text-base'} ${row.zebra ? 'bg-[#FCFAFA]' : ''}`}
                              >
                                {renderProductCell(productItem, row.fieldName, seriesSourceItem)}
                                {comment && (
                                  <span
                                    className={`w-full text-center italic font-normal px-1 ${isMobile ? 'text-[8px] leading-[10px]' : 'text-[10px] leading-[12px]'}`}
                                  >
                                    {comment}
                                  </span>
                                )}
                              </div>
                            );
                          })}

                          <div
                            className={`flex w-full flex-col items-stretch justify-center gap-2 ${isMobile ? 'mt-1' : 'mt-4'}`}
                          >
                            {buildCardCTAs(series, productItem, seriesSourceItem, exploreUrl).map(
                              (cta) => (
                                <a
                                  key={`${series.seriesIndex}-${productIdx}-${cta.label}-${cta.href}`}
                                  href={cta.href}
                                  className={`flex items-center justify-center text-center no-underline ${ctaTierClasses(cta.tier)}`}
                                >
                                  {cta.label}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      );
                    });
                  })}

                  {/* ── Final-row CTA card ── */}
                  {(() => {
                    const exploreAllProductsHref =
                      productTypeToCompare[selectedProductTypeIndex]?.fields?.exploreAllProducts
                        ?.value?.href;
                    if (!exploreAllProductsHref) {
                      return null;
                    }
                    return (
                      <div
                        className={`flex shrink-0 items-stretch justify-center rounded border border-[#EAEAEA] bg-white text-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)] ${isMobile ? 'min-w-[145px] w-[145px]' : 'min-w-[163px] w-[163px]'}`}
                      >
                        {finalRowCTAs.length > 0 ? (
                          <div
                            className={`flex flex-col items-stretch justify-center h-full w-full gap-2 px-2 py-3 !font-sans ${isMobile ? 'text-[10px]' : 'text-sm'}`}
                            style={{ minHeight: isMobile ? 100 : 320 }}
                          >
                            {finalRowCTAs.map((cta) => (
                              <a
                                key={`${cta.label}-${cta.href}`}
                                href={cta.href}
                                target={cta.target || undefined}
                                rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
                                className={`flex w-full items-center justify-center rounded-full bg-white text-center font-semibold text-[#001722] no-underline transition-colors duration-200 hover:bg-[#F26924] hover:text-white ${isMobile ? 'h-7 text-[10px] border-2 border-[#F26924]' : 'h-11 text-base border-4 border-[#F26924]'}`}
                                style={{ fontFamily: 'futura-pt, sans-serif' }}
                              >
                                {cta.label}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <a
                            href={exploreAllProductsHref}
                            className={`flex flex-col items-center justify-center h-full w-full gap-2 px-2 !font-sans font-normal text-black no-underline ${isMobile ? 'text-[10px]' : 'text-sm'}`}
                            style={{ minHeight: isMobile ? 100 : 320 }}
                          >
                            <span className={`text-[#666] ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                              Explore all
                            </span>
                            <span
                              className={`text-[#666] line-clamp-2 ${isMobile ? 'text-[8px]' : 'text-xs'}`}
                            >
                              {currentProductTypeName}
                            </span>
                            <span
                              className={`inline-flex items-center justify-center rounded-full border border-[#E0E0E0] ${isMobile ? 'h-6 w-6' : 'h-9 w-9'}`}
                            >
                              <SvgIcon icon="arrow-right" size="sm" />
                            </span>
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* S6479: Array.from with map function instead of chained .map() */}
                {isMobile && visibleCardsCount > 0 && (
                  <div className="w-full flex items-center justify-center mt-2">
                    <div className="flex gap-2 bg-white px-2 py-1 rounded-full shadow-sm">
                      {Array.from({ length: visibleCardsCount }, (_, idx) => (
                        <button
                          key={idx}
                          aria-label={`Go to card ${idx + 1}`}
                          onClick={() => {
                            const el = scrollableSectionRef.current;
                            if (el?.children[idx]) {
                              const child = el.children[idx] as HTMLElement;
                              el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
                              setActiveCardIndex(idx);
                            }
                          }}
                          className={`h-2 w-2 rounded-full transition-colors duration-150 ${
                            activeCardIndex === idx ? 'bg-black' : 'bg-[#E5E7EB]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 pb-5"></div>

      {props.fields.disclaimerText && (
        <div className="col-span-12">
          <div className="flex flex-col gap-1.5 pt-1 font-sans! text-[10px] font-normal leading-3.75 text-black">
            <Disclaimer disclaimerClasses="" fields={props.fields} />
          </div>
        </div>
      )}

      {openSwatchModal && (
        <div
          ref={swatchPopoverRef}
          aria-modal="false"
          aria-label="All swatches"
          style={{
            position: 'fixed',
            top: openSwatchModal.top,
            left: openSwatchModal.left,
            transform: 'translate(-50%, calc(-100% - 6px))',
            maxWidth: 'min(90vw, 520px)',
          }}
          className="z-50 flex flex-wrap items-center justify-center gap-2 bg-white px-4 py-2 shadow-xl ring-1 ring-black/10"
        >
          {openSwatchModal.swatches
            .filter((s) => s?.src)
            .map((s, idx) => (
              <img
                key={`${s.src}-${idx}`}
                src={s.src}
                alt={s.alt ?? ''}
                className="h-6.25 w-[25px] rounded-full border border-black/50"
              />
            ))}
          <button
            type="button"
            onClick={handleCloseSwatchModal}
            aria-label="Close"
            className="ml-1 text-black hover:opacity-60 focus:outline-none"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1 L13 13 M13 1 L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};
