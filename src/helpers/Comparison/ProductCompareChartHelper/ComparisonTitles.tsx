/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import SvgIcon from 'src/helpers/SvgIcon/SvgIcon';
import { environment } from 'startup/environment';

import { SeriesTitle } from './ComparisonTable.Types';
import { ProductCardDot } from './ProductCardDot';

export const ComparisonTitles = ({
  comparisonTitles,
  allSeriesTitles,
  onSelectionChange,
  isMobile,
  comparisonTableRef,
  singleSelect = false,
  selectedText,
}: {
  removeSeries: (index: number) => any;
  totalNumberOfSeries: number;
  comparisonTitles: Array<SeriesTitle | undefined>;
  allSeriesTitles: Array<SeriesTitle | undefined>;

  toggleSeriesSelector: (isVisible: boolean | undefined) => any;
  onSelectionChange: (selectedIndices: number[]) => void;
  isMobile?: boolean;
  isProductComparison?: boolean;
  comparisonTableRef: React.RefObject<HTMLDivElement | null>;
  singleSelect?: boolean;
  selectedText?: string;
}) => {
  const { siteInfo } = useWebsiteContext();
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() => {
    const indices = new Set<number>();
    comparisonTitles.forEach((title) => {
      if (title) {
        indices.add(title.seriesIndex);
      }
    });
    return indices;
  });
  const [lastVisibleButtonCardIndex, setLastVisibleButtonCardIndex] = useState(1);

  // State for scroll buttons
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const rowRef = useRef<HTMLDivElement>(null);

  const toggleSelected = (seriesIndex: number) => {
    setSelectedIndices((prev) => {
      if (singleSelect) {
        const next = new Set([seriesIndex]);
        onSelectionChange([seriesIndex]);
        return next;
      }
      const next = new Set(prev);
      if (next.has(seriesIndex)) {
        if (next.size <= 1) {
          return prev;
        }
        next.delete(seriesIndex);
      } else {
        next.add(seriesIndex);
      }
      onSelectionChange(Array.from(next).sort());
      return next;
    });
  };

  // Check scroll position to show/hide buttons
  const checkScrollButtons = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth / 2;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = rowRef.current;

    const handleHorizontalScroll = () => {
      checkScrollButtons();

      if (container) {
        const scrollLeft = container.scrollLeft;
        const containers = document.querySelectorAll('.no-scrollbar-sync');
        containers.forEach((otherContainer) => {
          if (otherContainer !== container) {
            otherContainer.scrollLeft = scrollLeft;
          }
        });
      }
    };

    checkScrollButtons();

    window.addEventListener('resize', checkScrollButtons);
    container?.addEventListener('scroll', handleHorizontalScroll);

    return () => {
      container?.removeEventListener('scroll', handleHorizontalScroll);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [comparisonTableRef, allSeriesTitles, isMobile]);

  const ButtonCard = (
    props: { cardIndex: number; isSelected: boolean; onToggleSelect: () => void } & SeriesTitle
  ) => {
    const componentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (isMobile) {
        const componentNodeRef = componentRef.current;
        const observer = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (
              entry.isIntersecting &&
              (props.cardIndex >= lastVisibleButtonCardIndex ||
                props.cardIndex < lastVisibleButtonCardIndex - 1)
            ) {
              setLastVisibleButtonCardIndex(props.cardIndex);
            }
          },
          { threshold: 1 }
        );
        if (componentNodeRef) {
          observer.observe(componentNodeRef);
        }
        return () => {
          if (componentNodeRef) {
            observer.unobserve(componentNodeRef);
          }
        };
      } else {
        return () => false;
      }
    }, [props.cardIndex]);

    const displayName = props.productTypeTitle || props.title || '';
    const suffixText =
      displayName.toLowerCase().includes('window') || displayName.toLowerCase().includes('door')
        ? ''
        : 'Windows';
    const buttonText = `Compare ${displayName} ${suffixText}`;

    return (
      <div
        ref={componentRef}
        className="relative z-10 flex w-full flex-col bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 pointer-events-auto cursor-pointer"
        style={{
          height: isMobile ? '160px' : '320px',
          padding: isMobile ? '8px' : '16px',
        }}
      >
        <div className="flex flex-col items-center justify-center flex-1">
          <div
            className="flex items-center justify-center rounded-[8px] border border-[#e0e0e0] bg-[#f5f5f5]"
            style={{ width: isMobile ? '80px' : '146px', height: isMobile ? '80px' : '146px' }}
          >
            {props.image?.src && (
              <Image
                src={getMediaUrl(props.image.src, MediaUrlType.Cdn, siteInfo!, environment)}
                width={isMobile ? 80 : 130}
                height={isMobile ? 80 : 130}
                alt={(props.image?.alt as string) || displayName}
                unoptimized={isSvgUrl(props.image?.src)}
              />
            )}
          </div>
          <div className="mt-2 text-center">
            <span className="!font-sans text-sm font-heavy text-black line-clamp-2">
              {displayName}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center shrink-0 overflow-hidden">
          <button
            className={classNames(
              'flex cursor-pointer items-center justify-center w-full rounded-[4px] px-3 py-2 transition-all duration-200 border !font-sans text-xs font-light shrink-0',
              props.isSelected
                ? 'bg-black text-white border-black gap-2'
                : 'bg-white text-black border-black hover:bg-black hover:text-white'
            )}
            onClick={props.onToggleSelect}
            tabIndex={0}
          >
            <span className="truncate font-medium text-sm font-sans">
              {props.isSelected ? selectedText || 'SELECTED: SEE BELOW' : buttonText}
            </span>

            {props.isSelected && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white flex-shrink-0">
                <SvgIcon icon="check" size="md" className="text-black" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 1; i < comparisonTitles.length; i++) {
      dots.push(<ProductCardDot isActive={lastVisibleButtonCardIndex === i} />);
    }
    return dots;
  };

  const ScrollButton = ({
    direction,
    onClick,
  }: {
    direction: 'left' | 'right';
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      aria-label={`Scroll ${direction}`}
      className={classNames(
        'absolute z-[20] flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E0E0] bg-white/90 shadow-md transition-all duration-200 hover:bg-[#000000] hover:text-white top-1/2 -translate-y-1/2 hidden md:flex text-[#ffffff]',
        direction === 'left' ? 'left-2' : 'right-2'
      )}
    >
      {direction === 'left' ? (
        <SvgIcon
          icon="chevron-left"
          size="sm"
          className="text-black fill-black hover:fill-white hover:text-white"
        />
      ) : (
        <SvgIcon
          icon="chevron-right"
          size="sm"
          className="text-black fill-black hover:fill-white hover:text-white"
        />
      )}
    </button>
  );

  return (
    <>
      <div
        className="relative w-full group md:overflow-hidden"
        style={{
          position: 'relative',
          top: 'auto',
          left: 'auto',
          width: '100%',
          right: 'auto',
          zIndex: 10,
          paddingBottom: isMobile ? '16px' : '30px',
        }}
      >
        {!isMobile && canScrollLeft && (
          <ScrollButton direction="left" onClick={() => scrollContainer('left')} />
        )}

        <div
          style={{
            width: '100%',
          }}
          className={classNames(
            'flex items-center overflow-x-auto md:overflow-hidden overflow-y-hidden flex-nowrap bg-white transition-all duration-200 touch-pan-x',
            isMobile ? 'pt-2 pb-2 px-2.5 gap-2' : 'pt-s pb-4 px-4 gap-4',
            isMobile
              ? 'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0'
              : 'scrollbar-thin scrollbar-thumb-[#F26924] scrollbar-track-[#F5F5F5] hover:scrollbar-thumb-[#E05810]'
          )}
          ref={rowRef}
        >
          {allSeriesTitles.map(
            (data) =>
              data && (
                <div
                  className={classNames(
                    'relative shrink-0 pointer-events-auto',
                    isMobile ? 'min-w-[85vw]' : 'w-[calc(25%-12px)]'
                  )}
                  key={data.seriesIndex}
                >
                  <ButtonCard
                    {...data}
                    cardIndex={data.seriesIndex}
                    isSelected={selectedIndices.has(data.seriesIndex)}
                    onToggleSelect={() => toggleSelected(data.seriesIndex)}
                  />
                </div>
              )
          )}
        </div>

        {!isMobile && canScrollRight && (
          <ScrollButton direction="right" onClick={() => scrollContainer('right')} />
        )}
      </div>

      {isMobile && (
        <div
          className={classNames(
            'right-0 left-0 z-[10] flex w-full items-center justify-center bg-white'
          )}
          id="dots-container"
          style={{
            top: '152px',
          }}
        >
          {renderDots()}
        </div>
      )}
    </>
  );
};
