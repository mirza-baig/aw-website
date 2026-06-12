'use client';

import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { Children, Fragment, isValidElement, ReactNode } from 'react';

import { GridDisplay, SliderDisplay } from './DisplayModes.helper';
import { DesktopVideoDisplayStyleType, XupDisplayStyle } from './XupCardCollection.types';

type CardsWrapperProps = Readonly<{
  cards: ReactNode[];
  maxCardsPerRow: number;
  tabletMaxCardsPerRow: number;
  desktopDisplayStyle: XupDisplayStyle;
  mobileDisplayStyle: XupDisplayStyle;
  isEditing: boolean;
  desktopVideoDisplayStyle: DesktopVideoDisplayStyleType;
}>;

export function CardsWrapper({
  maxCardsPerRow,
  tabletMaxCardsPerRow,
  desktopDisplayStyle,
  mobileDisplayStyle,
  isEditing,
  cards,
}: CardsWrapperProps) {
  const normalizeCardsForEditing = (inputCards: ReactNode[]): ReactNode[] => {
    const cardsArray = Children.toArray(inputCards);

    if (!isEditing) {
      return cardsArray;
    }

    const unwrapSitecoreWrappers = (node: ReactNode, isTopLevel = false): ReactNode[] => {
      if (!isValidElement(node)) {
        return [node];
      }

      const props = node.props as {
        className?: string;
        children?: ReactNode;
        [key: string]: unknown;
      };

      const children = Children.toArray(props.children);
      if (children.length === 0) {
        return [node];
      }

      const className = props.className ?? '';
      const hasSitecoreDataAttribute = Object.keys(props).some((key) => key.startsWith('data-sc'));
      const isSitecoreEditingWrapper =
        className.includes('scLooseFrameZone') ||
        className.includes('scChrome') ||
        hasSitecoreDataAttribute;
      const isReactFragment = node.type === Fragment;
      const isTopLevelAnonymousWrapper =
        isTopLevel && children.length > 1 && !className && !hasSitecoreDataAttribute;

      if (!isSitecoreEditingWrapper && !isReactFragment && !isTopLevelAnonymousWrapper) {
        return [node];
      }

      return children.flatMap((child) => unwrapSitecoreWrappers(child, false));
    };

    const normalizedCards = cardsArray.flatMap((node) => unwrapSitecoreWrappers(node, true));

    if (normalizedCards.length > 0) {
      return normalizedCards;
    }

    return cardsArray;
  };

  const normalizedCards = normalizeCardsForEditing(cards);

  const { currentScreenWidth } = useCurrentScreenType();
  const screenWidth = currentScreenWidth > 0 ? currentScreenWidth : getBreakpoint('ml');
  const sliderSettings = {
    dots: false,
    infinite: false,
    ...(screenWidth > getBreakpoint('mmd')
      ? { slidesToShow: maxCardsPerRow }
      : { slidesToShow: 1 }),
    responsive: [
      {
        breakpoint: getBreakpoint('mmd'),
        settings: {
          slidesToShow: tabletMaxCardsPerRow,
          dots: true,
        },
      },
      {
        breakpoint: getBreakpoint('md'),
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };

  if (screenWidth < getBreakpoint('md')) {
    // Renderings for mobile devices
    if (mobileDisplayStyle === 'grid') {
      return <GridDisplay cards={normalizedCards} pageEditMode={isEditing} />;
    } else {
      return (
        <SliderDisplay
          cards={normalizedCards}
          sliderSettings={sliderSettings}
          pageEditMode={isEditing}
        />
      );
    }
  } else if (desktopDisplayStyle === 'grid') {
    // Renderings for tablets and large screen devices
    return (
      <GridDisplay
        cards={normalizedCards}
        maxCardsPerRow={maxCardsPerRow}
        pageEditMode={isEditing}
      />
    );
  } else {
    return (
      <SliderDisplay
        cards={normalizedCards}
        sliderSettings={sliderSettings}
        pageEditMode={isEditing}
      />
    );
  }
}
