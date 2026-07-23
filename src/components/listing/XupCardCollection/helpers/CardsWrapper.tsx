'use client';

import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import {
  Children,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { GridDisplay, SliderDisplay } from './DisplayModes.helper';
import { XupDisplayStyle } from './XupCardCollection.types';

// Selectors for DOM-level card wrapping correction in Sitecore Pages edit mode.
const CHROME_OPEN_SELECTOR = 'code[type="text/sitecore"][chrometype="rendering"][kind="open"]';
const CARD_SLOT_SELECTOR = '[data-xup-card-slot]';

// Collect ordered card groups (open-code … close-code node sequences) from a single slot.
const getCardGroupsFromSlot = (slot: Element): Node[][] => {
  const groups: Node[][] = [];
  let currentGroup: Node[] | null = null;

  for (const child of Array.from(slot.childNodes)) {
    const el = child as Element;
    const isChromeRendering =
      child.nodeType === Node.ELEMENT_NODE &&
      el.tagName === 'CODE' &&
      el.getAttribute('chrometype') === 'rendering';

    if (isChromeRendering && el.getAttribute('kind') === 'open') {
      currentGroup = [child];
      groups.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.push(child);
      if (isChromeRendering && el.getAttribute('kind') === 'close') {
        currentGroup = null;
      }
    }
  }

  return groups;
};

// Find the first rendering chrome open code within a slot. Used as the insertion anchor so that
// any placeholder chrome codes (chrometype="placeholder") that precede renderings are never moved.
const getInsertionPoint = (slot: Element): ChildNode | null => {
  for (const child of Array.from(slot.childNodes)) {
    const el = child as Element;
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      el.tagName === 'CODE' &&
      el.getAttribute('chrometype') === 'rendering' &&
      el.getAttribute('kind') === 'open'
    ) {
      return child;
    }
  }
  return null;
};

// Rebalance card slots: collect all card groups across every slot in DOM order, then put exactly
// one per slot. This corrects the DOM after Sitecore moves a card between placeholders by directly
// mutating the DOM without triggering a React re-render. The overloaded slot contributes its cards
// in their current intra-slot order, so drag-to-insert produces the correct final sequence.
const rebalanceCardSlots = (container: HTMLElement): void => {
  const slots = Array.from(container.querySelectorAll<HTMLElement>(CARD_SLOT_SELECTOR));

  const hasOverloadedSlot = slots.some(
    (slot) => slot.querySelectorAll(CHROME_OPEN_SELECTOR).length > 1
  );
  if (!hasOverloadedSlot) {
    return;
  }

  // Snapshot the correct card order before any DOM moves.
  const allGroups = slots.flatMap(getCardGroupsFromSlot);

  // Place each card group into its target slot using insertBefore.
  // insertBefore moves nodes atomically — they are never absent from the DOM — unlike
  // remove+appendChild, which temporarily orphans nodes and causes Sitecore's editor to
  // see the chrome code as "deleted", losing its drag-and-drop registration.
  for (let i = 0; i < slots.length; i++) {
    const group = allGroups[i];
    if (!group?.length) {
      continue;
    }
    const slot = slots[i];
    const insertionPoint = getInsertionPoint(slot);
    if (insertionPoint === group[0]) {
      continue;
    } // already in the correct position
    if (insertionPoint) {
      insertionPoint.before(...group);
    } else {
      slot.append(...group);
    }
  }
};

type CardsWrapperProps = Readonly<{
  cards: ReactNode[];
  maxCardsPerRow: number;
  tabletMaxCardsPerRow: number;
  desktopDisplayStyle: XupDisplayStyle;
  mobileDisplayStyle: XupDisplayStyle;
  isEditing: boolean;
}>;

export function CardsWrapper({
  maxCardsPerRow,
  tabletMaxCardsPerRow,
  desktopDisplayStyle,
  mobileDisplayStyle,
  isEditing,
  cards,
}: CardsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-apply the wrapping fix after every React render. React's reconciliation can temporarily
  // revert our DOM changes (e.g., after a window resize triggers a re-render via
  // useCurrentScreenType). useLayoutEffect runs synchronously before the browser paints, so
  // the user never sees the incorrect intermediate state.
  useLayoutEffect(() => {
    if (!isEditing || !containerRef.current) {
      return;
    }
    rebalanceCardSlots(containerRef.current);
  });

  // Watch for Sitecore's editor mutating the DOM when a card is moved between placeholders.
  // Sitecore moves DOM nodes directly without triggering a React re-render, so we detect the
  // structural change via MutationObserver and fix the slot wrapping immediately in the DOM.
  useEffect(() => {
    if (!isEditing) {
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let rafId: ReturnType<typeof requestAnimationFrame>;

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Disconnect before rebalancing so our own insertBefore mutations don't
        // queue another RAF call, then reconnect to watch for the next Sitecore drag.
        observer.disconnect();
        rebalanceCardSlots(container);
        observer.observe(container, { childList: true, subtree: true });
      });
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isEditing]);

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

  let displayContent: ReactElement;

  if (screenWidth < getBreakpoint('md')) {
    // Renderings for mobile devices
    if (mobileDisplayStyle === 'grid') {
      displayContent = <GridDisplay cards={normalizedCards} pageEditMode={isEditing} />;
    } else {
      displayContent = (
        <SliderDisplay
          cards={normalizedCards}
          sliderSettings={sliderSettings}
          pageEditMode={isEditing}
        />
      );
    }
  } else if (desktopDisplayStyle === 'grid') {
    // Renderings for tablets and large screen devices
    displayContent = (
      <GridDisplay
        cards={normalizedCards}
        maxCardsPerRow={maxCardsPerRow}
        pageEditMode={isEditing}
      />
    );
  } else {
    displayContent = (
      <SliderDisplay
        cards={normalizedCards}
        sliderSettings={sliderSettings}
        pageEditMode={isEditing}
      />
    );
  }

  // In edit mode wrap in a layout-transparent container so the MutationObserver ref can watch
  // the entire card area without affecting the CSS grid layout.
  if (isEditing) {
    return (
      <div ref={containerRef} style={{ display: 'contents' }}>
        {displayContent}
      </div>
    );
  }

  return displayContent;
}
