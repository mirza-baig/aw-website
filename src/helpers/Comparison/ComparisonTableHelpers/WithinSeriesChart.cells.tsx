/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import { pickRaw } from './WithinSeriesChart.helper';

const PRICE_RANGE_RE = /^\$([\d,]+(?:\.\d+)?)\s*-\s*\$([\d,]+(?:\.\d+)?)$/;

const PRICE_LEVEL_MAX = 5;

/** Field names that hold a display name, most specific first. */
const NAME_FIELD_PRIORITY = [
  'productName',
  'productFullName',
  'materialName',
  'swatchName',
  'glassType',
  'installMethodName',
];

export type SwatchOverflowHandler = (
  swatches: Array<{ src?: string; alt?: string }>,
  origin: { top: number; left: number }
) => void;

type NamedItem = { name: string; href?: string; target?: string };

/** Collapsed list of linked product names with a "+N more" expander. */
const NamedItemsCell = ({
  items,
  fieldName,
  maxVisible,
}: {
  items: NamedItem[];
  fieldName: string;
  maxVisible: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const overflow = items.length - maxVisible;
  const visible = expanded ? items : items.slice(0, maxVisible);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col items-center px-1 font-sans! font-normal">
      {visible.map((item, index) =>
        item.href ? (
          <a
            key={`${fieldName}-${index}`}
            href={item.href}
            target={item.target || undefined}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-center text-[#F26924] hover:underline"
          >
            {item.name}
          </a>
        ) : (
          <span key={`${fieldName}-${index}`} className="text-center">
            {item.name}
          </span>
        )
      )}
      {overflow > 0 && (
        <button
          type="button"
          onClick={handleToggle}
          className="mt-1 cursor-pointer border-none bg-transparent p-0 text-[#F26924] underline"
        >
          {expanded ? 'show less' : `+${overflow} more`}
        </button>
      )}
    </div>
  );
};

type CellRenderContext = {
  isMobile: boolean;
  onSwatchOverflow: SwatchOverflowHandler;
};

const renderPriceLevel = (priceLevel: string | undefined, isMobile: boolean) => {
  const level = Number.parseInt(priceLevel ?? '0', 10) || 0;
  return (
    <span
      className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}
      style={{ fontFamily: 'futura-pt, sans-serif' }}
    >
      {Array.from({ length: PRICE_LEVEL_MAX }, (_, index) => (
        <span key={index} className={index < level ? 'text-black' : 'text-[#C4BFB6]'}>
          $
        </span>
      ))}
    </span>
  );
};

const renderSwatches = (swatchData: any, ctx: CellRenderContext, maxVisible?: number) => {
  const maxVisibleCount = maxVisible ?? (ctx.isMobile ? 2 : 4);
  const swatches = swatchData?.swatches ?? swatchData;
  if (!Array.isArray(swatches) || swatches.length === 0) {
    return <span>—</span>;
  }
  const visible = swatches.slice(0, maxVisibleCount);
  const overflow = swatches.length - maxVisibleCount;

  return (
    <div className={`flex items-center justify-center ${ctx.isMobile ? 'gap-1' : 'gap-1.5'}`}>
      {visible.map((swatch: any, index: number) =>
        swatch?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={swatch.id ?? `${swatch.src}-${index}`}
            src={swatch.src}
            alt={swatch.alt ?? ''}
            className={`rounded-full border border-black/50 ${
              ctx.isMobile ? 'h-4.5 w-4.5' : 'h-6.25 w-6.25'
            }`}
          />
        ) : null
      )}
      {overflow > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            ctx.onSwatchOverflow(swatches, {
              top: rect.top,
              left: rect.left + rect.width / 2,
            });
          }}
          aria-label={`Show all ${swatches.length} swatches`}
          className={`cursor-pointer font-sans! font-normal hover:underline focus:underline focus:outline-none ${
            ctx.isMobile ? 'text-[8px]' : 'text-sm'
          }`}
        >
          +{overflow}
        </button>
      )}
    </div>
  );
};

const renderMaterials = (raw: any) => {
  const lines = (Array.isArray(raw) ? raw : [])
    .map((material: any) => material?.fields?.materialName?.value)
    .filter(Boolean);

  if (lines.length === 0) {
    return <span>—</span>;
  }

  return (
    <div className="flex flex-col items-center font-sans! font-normal">
      {lines.map((line: string) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
};

const renderNamedItems = (raw: any[], fieldName: string, isMobile: boolean) => {
  const namedItems: NamedItem[] = raw.flatMap((item: any) => {
    const fields = item?.fields ?? {};
    const preferred = NAME_FIELD_PRIORITY.find(
      (key) => typeof fields[key]?.value === 'string' && fields[key].value.trim()
    );
    const nameField = preferred ?? Object.keys(fields).find((key) => /name$/i.test(key));
    const name = nameField ? fields[nameField]?.value : undefined;
    if (typeof name !== 'string' || !name.trim()) {
      return [];
    }
    const link = fields.productDetailPageLink?.value ?? fields.pdpLink?.value ?? fields.link?.value;
    return [
      {
        name,
        href: link?.href as string | undefined,
        target: link?.target as string | undefined,
      },
    ];
  });

  if (namedItems.length === 0) {
    return null;
  }

  return <NamedItemsCell items={namedItems} fieldName={fieldName} maxVisible={isMobile ? 2 : 3} />;
};

const renderStringValue = (trimmed: string) => {
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return (
      <span className="font-sans! font-normal" dangerouslySetInnerHTML={{ __html: trimmed }} />
    );
  }

  const priceRange = PRICE_RANGE_RE.exec(trimmed);
  if (priceRange) {
    return (
      <span className="font-sans! font-normal">
        <strong>${priceRange[1]}</strong> - <strong>${priceRange[2]}</strong>
      </span>
    );
  }

  return <span className="font-sans! font-normal">{trimmed}</span>;
};

/** Item that carries its own `fields` bag: nested swatches, or a "…Name" field. */
const renderFieldsObject = (fields: Record<string, any>, ctx: CellRenderContext) => {
  const nestedSwatches = fields.swatches ?? fields.featuredSwatches;
  if (Array.isArray(nestedSwatches) && nestedSwatches.length > 0) {
    const swatchImages = nestedSwatches
      .map((swatch: any) => swatch?.fields?.swatchImage?.value ?? swatch?.fields?.swatchImage)
      .filter((value: any) => value?.src);
    if (swatchImages.length > 0) {
      return renderSwatches({ swatches: swatchImages }, ctx);
    }
  }

  if (Array.isArray(fields.swatchImages)) {
    const swatchImages = fields.swatchImages.filter((value: any) => value?.src);
    if (swatchImages.length > 0) {
      return renderSwatches({ swatches: swatchImages }, ctx);
    }
  }

  const nameField = Object.keys(fields).find((key) => /name$/i.test(key));
  const text = nameField ? fields[nameField]?.value : undefined;
  if (typeof text === 'string' && text.trim()) {
    return <span className="font-sans! font-normal">{text.trim()}</span>;
  }

  return null;
};

const renderArrayValue = (raw: any[], fieldName: string, ctx: CellRenderContext) => {
  const looksLikeSwatchArray = raw.length > 0 && raw[0]?.fields?.swatchImage;
  if (looksLikeSwatchArray) {
    const swatches = raw
      .map((swatch: any) => swatch?.fields?.swatchImage?.value)
      .filter((value: any) => value?.src);
    return renderSwatches({ swatches }, ctx);
  }
  return renderNamedItems(raw, fieldName, ctx.isMobile) ?? <span>—</span>;
};

/**
 * One product's value for one legend row. Mirrors the product compare chart's
 * cell rendering so both charts present the same GPDS data identically.
 */
export const ProductCell = ({
  productItem,
  seriesItem,
  fieldName,
  isMobile,
  resolvedSwatchCollections,
  onSwatchOverflow,
}: {
  productItem: any;
  seriesItem: any;
  fieldName: string;
  isMobile: boolean;
  resolvedSwatchCollections: Record<string, any>;
  onSwatchOverflow: SwatchOverflowHandler;
}) => {
  const ctx: CellRenderContext = { isMobile, onSwatchOverflow };
  const sources = [productItem, seriesItem].filter(Boolean);
  const raw = pickRaw(fieldName, sources, resolvedSwatchCollections);

  if (fieldName === 'priceLevel') {
    return renderPriceLevel(raw?.fields?.priceLevelText?.value, isMobile);
  }

  if (fieldName === 'materials' || fieldName === 'productMaterials') {
    return renderMaterials(raw);
  }

  if (Array.isArray(raw)) {
    return renderArrayValue(raw, fieldName, ctx);
  }

  if (raw && typeof raw === 'object' && Array.isArray(raw.swatches)) {
    return renderSwatches(raw, ctx);
  }

  if (raw && typeof raw === 'object' && raw.fields) {
    const rendered = renderFieldsObject(raw.fields, ctx);
    if (rendered) {
      return rendered;
    }
  }

  if (raw && typeof raw === 'object' && 'value' in raw && typeof raw.value === 'string') {
    const trimmed = raw.value.trim();
    if (trimmed) {
      return renderStringValue(trimmed);
    }
  }

  return <span>—</span>;
};
