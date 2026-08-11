'use client';

/***
 * The two controls that sit above the "within series" compare chart: the
 * Windows/Doors switcher and the series selection row.
 *
 * Both are presentational — the chart owns the selection state so the URL hash,
 * the chart title and the card columns all stay in step with one another.
 */

import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { environment } from 'startup/environment';

import { BucketKey } from './WithinSeriesChart.helper';

export const DEFAULT_TOGGLE_LABEL = 'Select Windows or Doors to compare:';
export const DEFAULT_SELECTED_TEXT = 'SELECTED: SEE BELOW';

const BUCKET_TAB_LABEL: Record<BucketKey, string> = { windows: 'Windows', doors: 'Doors' };

/**
 * Windows/Doors switcher. Both tabs always show so the control reads as a pair,
 * but a half of the catalogue no authored series carries is disabled rather than
 * clickable — switching to it would only empty the chart.
 */
export const WindowsDoorsToggle = ({
  label,
  buckets,
  enabledBuckets,
  selectedBucket,
  onSelectBucket,
  bucketLabels,
  isMobile,
}: {
  label: string;
  buckets: BucketKey[];
  enabledBuckets: BucketKey[];
  selectedBucket: BucketKey;
  onSelectBucket: (bucket: BucketKey) => void;
  bucketLabels: Partial<Record<BucketKey, string>>;
  isMobile?: boolean;
}) => (
  <div
    className={classNames(
      'flex w-full flex-wrap items-center justify-center bg-white',
      isMobile ? 'gap-2 px-2 pt-3 pb-1' : 'gap-4 px-4 pt-5 pb-2'
    )}
  >
    <span
      className={classNames(
        'font-sans! font-demi text-black',
        isMobile ? 'text-[12px]' : 'text-base'
      )}
      id="within-series-toggle-label"
    >
      {label}
    </span>
    <div
      role="tablist"
      aria-labelledby="within-series-toggle-label"
      className={classNames(
        'inline-flex items-center rounded-full bg-[#F1F0EE]',
        isMobile ? 'gap-0.5 p-0.5' : 'gap-1 p-1'
      )}
    >
      {buckets.map((bucket) => {
        const isSelected = bucket === selectedBucket;
        const isEnabled = enabledBuckets.includes(bucket);
        return (
          <button
            key={bucket}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={!isEnabled}
            onClick={() => onSelectBucket(bucket)}
            className={classNames(
              'rounded-full font-sans! transition-colors duration-200',
              isMobile ? 'px-4 py-1 text-[12px]' : 'px-8 py-2 text-base',
              !isEnabled && 'cursor-not-allowed bg-transparent font-normal text-black opacity-40',
              isEnabled && isSelected && 'cursor-pointer bg-black font-heavy text-white',
              isEnabled &&
                !isSelected &&
                'cursor-pointer bg-transparent font-normal text-black hover:bg-black/5'
            )}
          >
            {bucketLabels[bucket] ?? BUCKET_TAB_LABEL[bucket]}
          </button>
        );
      })}
    </div>
  </div>
);

export type SeriesSelectionCard = {
  index: number;
  label: string;
  buttonText: string;
  image?: { src?: string; alt?: string };
};

const ScrollButton = ({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Scroll ${direction}`}
    className={classNames(
      'absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E0E0E0] bg-white/90 shadow-md transition-all duration-200 hover:bg-[#000000] hover:text-white md:flex',
      direction === 'left' ? 'left-2' : 'right-2'
    )}
  >
    <SvgIcon
      icon={direction === 'left' ? 'chevron-left' : 'chevron-right'}
      size="sm"
      className="fill-black text-black hover:fill-white hover:text-white"
    />
  </button>
);

/**
 * Row of series cards above the chart. Single-select: picking a card swaps the
 * whole chart to that series (the selected card reads "Selected: see below").
 */
export const SeriesSelectionRow = ({
  cards,
  selectedIndex,
  onSelect,
  selectedText,
  isMobile,
}: {
  cards: SeriesSelectionCard[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  selectedText: string;
  isMobile?: boolean;
}) => {
  const { siteInfo } = useWebsiteContext();
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const container = rowRef.current;

    const checkScrollButtons = () => {
      if (!container) {
        return;
      }
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    container?.addEventListener('scroll', checkScrollButtons);

    return () => {
      window.removeEventListener('resize', checkScrollButtons);
      container?.removeEventListener('scroll', checkScrollButtons);
    };
  }, [cards.length]);

  const scrollRow = (direction: 'left' | 'right') => {
    const container = rowRef.current;
    if (!container) {
      return;
    }
    const amount = container.clientWidth / 2;
    container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="group relative w-full pb-4 md:overflow-hidden ml:pb-[30px]">
      {!isMobile && canScrollLeft && (
        <ScrollButton direction="left" onClick={() => scrollRow('left')} />
      )}

      <div
        ref={rowRef}
        className={classNames(
          'flex w-full touch-pan-x flex-nowrap items-stretch overflow-y-hidden overflow-x-auto bg-white transition-all duration-200',
          isMobile
            ? 'gap-2 px-2.5 pt-2 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            : 'gap-4 px-4 pt-s pb-4 scrollbar-thin scrollbar-track-[#F5F5F5] scrollbar-thumb-[#F26924] hover:scrollbar-thumb-[#E05810]'
        )}
      >
        {cards.map((card) => {
          const isSelected = card.index === selectedIndex;
          return (
            <div
              key={card.index}
              className={classNames(
                'pointer-events-auto relative shrink-0',
                isMobile ? 'min-w-[85vw]' : 'w-[calc(25%-12px)]'
              )}
            >
              <div
                className="pointer-events-auto relative z-10 flex w-full cursor-pointer flex-col bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200"
                style={{
                  height: isMobile ? '160px' : '320px',
                  padding: isMobile ? '8px' : '16px',
                }}
              >
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div
                    className="flex items-center justify-center rounded-[8px] border border-[#e0e0e0] bg-[#f5f5f5]"
                    style={{
                      width: isMobile ? '80px' : '146px',
                      height: isMobile ? '80px' : '146px',
                    }}
                  >
                    {card.image?.src && (
                      <Image
                        src={getMediaUrl(card.image.src, MediaUrlType.Cdn, siteInfo!, environment)}
                        width={isMobile ? 80 : 130}
                        height={isMobile ? 80 : 130}
                        alt={card.image.alt || card.label}
                        unoptimized={isSvgUrl(card.image.src)}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="line-clamp-2 font-sans! text-sm font-heavy text-black">
                      {card.label}
                    </span>
                  </div>
                </div>

                <div className="flex w-full shrink-0 items-center justify-center overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onSelect(card.index)}
                    aria-pressed={isSelected}
                    className={classNames(
                      'flex w-full shrink-0 cursor-pointer items-center justify-center rounded-[4px] border px-3 py-2 font-sans! text-xs font-light transition-all duration-200',
                      isSelected
                        ? 'gap-2 border-black bg-black text-white'
                        : 'border-black bg-white text-black hover:bg-black hover:text-white'
                    )}
                  >
                    <span className="truncate font-sans text-sm font-medium">
                      {isSelected ? selectedText : card.buttonText}
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                        <SvgIcon icon="check" size="md" className="text-black" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isMobile && canScrollRight && (
        <ScrollButton direction="right" onClick={() => scrollRow('right')} />
      )}
    </div>
  );
};
