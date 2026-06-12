import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { AddSeriesCard } from './AddSeriesCard';
import { SeriesTitle } from './ComparisonTable.Types';
import { ProductCardDot } from './ProductCardDot';

export const ComparisonTitles = ({
  comparisonTitles,
  removeSeries,
  totalNumberOfSeries,
  toggleSeriesSelector,
  isMobile,
  isProductComparison,
  comparisonTableRef,
  staticHeader = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeSeries: (index: number) => any;
  totalNumberOfSeries: number;
  comparisonTitles: Array<SeriesTitle | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleSeriesSelector: (isVisible: boolean | undefined) => any;
  isMobile?: boolean;
  isProductComparison?: boolean;
  comparisonTableRef: React.RefObject<HTMLDivElement | null>;
  staticHeader: boolean;
}) => {
  const [lastVisibleButtonCardIndex, setLastVisibleButtonCardIndex] = useState(1);
  const [isSticky, setIsSticky] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const getHeaderHeight = () => {
    return document.getElementsByTagName('header')[0]?.getBoundingClientRect().height as number;
  };
  useEffect(() => {
    const container = rowRef.current;

    const handleHorizontalScroll = () => {
      if (container) {
        const scrollLeft = container.scrollLeft;
        const containers = document.querySelectorAll('.no-scrollbar');
        containers.forEach((otherContainer) => {
          if (otherContainer !== container) {
            otherContainer.scrollLeft = scrollLeft;
          }
        });
      }
    };

    const isStickyFn = () => {
      const containerEl = comparisonTableRef.current;
      const containerElRect = containerEl?.getBoundingClientRect();

      if (!containerElRect) {
        return;
      }

      const isTopBelowHeader = containerElRect.top < getHeaderHeight();
      setIsSticky(!staticHeader && isTopBelowHeader);

      if (!rowRef.current) {
        return;
      }

      rowRef.current.style.opacity = containerElRect.bottom < getHeaderHeight() ? '0' : '1';

      const dotsContainerClass = '[&+#dots-container]:opacity-0';
      const shouldAddClass = containerElRect.bottom < getHeaderHeight();

      rowRef.current.classList.toggle(dotsContainerClass, shouldAddClass);
    };

    window.addEventListener('scroll', isStickyFn);
    container?.addEventListener('scroll', handleHorizontalScroll);
    return () => {
      container?.removeEventListener('scroll', handleHorizontalScroll);
      window.removeEventListener('scroll', isStickyFn);
    };
  }, [comparisonTableRef, staticHeader]);

  const ButtonCard = (props: { cardIndex: number } & SeriesTitle) => {
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

    return (
      <div
        ref={componentRef}
        style={{
          height: isSticky ? '50px' : isMobile ? '156px' : '185px',
        }}
        className="relative z-10 mx-auto flex h-[156px] w-full flex-col items-center justify-center rounded-[8px] border border-black py-ml px-xxxs text-center ml:h-[185px]"
      >
        {comparisonTitles.length > 1 && (
          <div
            tabIndex={0}
            onClick={() => {
              setLastVisibleButtonCardIndex(lastVisibleButtonCardIndex - 1);
              removeSeries(props.cardIndex);
            }}
          >
            <SvgIcon
              className={classNames(
                'absolute right-xxs top-xxs cursor-pointer text-black',
                isSticky && 'hidden'
              )}
              icon="close"
              size="lg"
            />
          </div>
        )}
        {isProductComparison && !isSticky && (
          <div className="relative h-[80px] w-[80px] ml:mb-xxs">
            <Image
              src={props.image?.src as string}
              width={80}
              height={80}
              layout="responsive"
              alt={props.image?.alt as string}
              unoptimized={isSvgUrl(props.image?.src)}
            />
          </div>
        )}
        <div className="font-sans! text-small font-heavy uppercase text-darkprimary ml:text-xxs">
          {
            <Link
              href={props?.url.value.href ?? ''}
              target={props?.url.value.target}
              rel="noopener noreferrer"
            >
              {props?.title ?? ''}
            </Link>
          }
        </div>
        {isProductComparison && <div className="text-small">{props.productName}</div>}
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

  return (
    <>
      <div
        style={{
          top: isMobile ? '55px' : '106px',
          position: isSticky ? 'fixed' : 'static',
          maxWidth: !isMobile && isSticky ? rowRef.current?.clientWidth : '100%',
        }}
        className={classNames(
          'no-scrollbar z-10 flex w-full items-center overflow-x-auto bg-white pt-s ml:justify-center ml:overflow-x-visible',
          isSticky &&
            !isMobile &&
            'before:absolute before:h-[calc(100%-16px)] before:w-[120vw] before:bg-white before:shadow-[0px_8px_4px_rgba(0,0,0,0.18)] before:content-[""]'
        )}
        ref={rowRef}
      >
        {comparisonTitles.map(
          (data, index) =>
            data && (
              <div
                className={classNames(
                  'relative mb-s min-w-[50%] px-xxs first:pl-s last:pr-s ml:w-full ml:min-w-0 ml:first:-ml-xxs ml:first:pl-xxs ml:last:-mr-xxs ml:last:pr-xxs',
                  !isMobile && isSticky && 'mt-s'
                )}
                key={index}
              >
                <ButtonCard {...data} cardIndex={index} />
                {comparisonTitles.length < totalNumberOfSeries &&
                  index === comparisonTitles.length - 1 && (
                    <div
                      className="absolute left-full top-0 h-full w-full pl-xxs pr-xs"
                      onClick={() => toggleSeriesSelector(true)}
                    >
                      <AddSeriesCard isSticked={isSticky} />
                    </div>
                  )}
              </div>
            )
        )}
      </div>
      {isMobile && (
        <div
          className={classNames(
            'right-0 left-0 z-10 flex w-full items-center justify-center bg-white',
            isSticky && 'fixed shadow-[0px_4px_14px_-3px_rgba(0,0,0,0.1)]'
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
