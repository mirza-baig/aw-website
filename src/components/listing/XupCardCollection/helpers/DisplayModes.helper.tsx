import classNames from 'classnames';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType, sliderSettings, SliderType } from 'helpers/SliderWrapper/SliderWrapper';
import { Children, isValidElement, ReactNode, useRef } from 'react';

import { GetLayoutClasses } from './XupCardCollection.helper';

type GridDisplayProps = {
  maxCardsPerRow?: number;
  pageEditMode?: boolean;
  cards: ReactNode[];
};

type SliderDisplayProps = Readonly<{
  sliderSettings: sliderSettings;
  cards: ReactNode[];
  pageEditMode?: boolean;
}>;

const createNodeKeyGenerator = () => {
  const counts = new Map<string, number>();

  return (node: ReactNode): string => {
    let baseKey: string = typeof node;

    if (isValidElement(node)) {
      baseKey = String(node.key ?? node.type);
    } else if (typeof node === 'string') {
      baseKey = `text:${node}`;
    }

    const count = counts.get(baseKey) ?? 0;
    counts.set(baseKey, count + 1);

    return count === 0 ? baseKey : `${baseKey}-${count}`;
  };
};

const isSitecoreChromeCodeNode = (node: ReactNode) => {
  if (!isValidElement(node) || node.type !== 'code') {
    return false;
  }

  const props = node.props as {
    className?: string;
    type?: string;
    kind?: string;
    chrometype?: string;
  };

  return props.type === 'text/sitecore' && props.className?.includes('scpm') === true;
};

const buildDisplayCards = (cards: ReactNode[], pageEditMode?: boolean): ReactNode[] => {
  const normalizedCards = Children.toArray(cards);

  if (!pageEditMode) {
    return normalizedCards;
  }

  const groupedSlides: ReactNode[][] = [];
  let pendingPrefix: ReactNode[] = [];

  normalizedCards.forEach((node) => {
    if (isSitecoreChromeCodeNode(node)) {
      const nodeProps = (node as React.ReactElement).props as { kind?: string };

      if (nodeProps.kind === 'close' && groupedSlides.length > 0) {
        groupedSlides.at(-1)?.push(node);
      } else {
        pendingPrefix.push(node);
      }
      return;
    }

    if (typeof node === 'string' && node.trim() === '') {
      return;
    }

    groupedSlides.push([...pendingPrefix, node]);
    pendingPrefix = [];
  });

  if (pendingPrefix.length > 0) {
    if (groupedSlides.length > 0) {
      groupedSlides.at(-1)?.push(...pendingPrefix);
    } else {
      groupedSlides.push(pendingPrefix);
    }
  }

  if (groupedSlides.length === 0) {
    return normalizedCards;
  }

  return groupedSlides.map((slideItems) => <>{slideItems}</>);
};

export function GridDisplay({ cards, maxCardsPerRow, pageEditMode }: GridDisplayProps) {
  const gridCards = buildDisplayCards(cards, pageEditMode);
  const getNodeKey = createNodeKeyGenerator();

  return gridCards.map((card) => (
    <div
      key={getNodeKey(card)}
      data-xup-card-slot={pageEditMode ? '' : undefined}
      className={classNames(
        'col-span-12',
        maxCardsPerRow && GetLayoutClasses(maxCardsPerRow),
        pageEditMode ? 'px-xxs md:px-sm-s' : ''
      )}
    >
      {card}
    </div>
  ));
}

export function SliderDisplay({ cards, sliderSettings, pageEditMode }: SliderDisplayProps) {
  const sliderRef = useRef<SliderType>(null);
  const sliderCards = buildDisplayCards(cards, pageEditMode);
  const getNodeKey = createNodeKeyGenerator();

  return (
    <div className="col-span-12 [&_.slick-track]:mx-0!">
      <SliderWrapper sliderSettings={sliderSettings} sliderRef={sliderRef as SliderRefType}>
        {sliderCards?.map((card) => (
          <button
            type="button"
            data-xup-card-slot={pageEditMode ? '' : undefined}
            onKeyDown={(e) => {
              if (e.shiftKey && e.key === 'Tab' && sliderRef?.current) {
                sliderRef.current.slickPrev();
              } else if (e.key === 'Tab' && sliderRef?.current) {
                sliderRef?.current.slickNext();
              }
            }}
            key={getNodeKey(card)}
            className={classNames('h-full w-full cursor-auto bg-transparent p-0 md:px-xxs')}
          >
            {card}
          </button>
        ))}
      </SliderWrapper>
    </div>
  );
}
