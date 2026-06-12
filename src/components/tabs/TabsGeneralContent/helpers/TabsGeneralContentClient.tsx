'use client';

import { Field, Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { TabsGeneralContentContext } from 'lib/context/TabsGeneralContentContext';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { defaultIfNullOrEmpty } from 'lib/utils/string-utils/default-if-null-or-empty';
import { isEqualIgnoreCase } from 'lib/utils/string-utils/is-equal-ignore-case';
import { JSX, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TabList, Tabs } from 'react-tabs';

import { Tab } from './tab';
import { TabsGeneralContentTheme } from './TabsGeneralContent.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type TabHeadingProps = {
  onClick: () => void;
  selected: boolean;
  themeData: {
    classes: {
      tabs: {
        outerTabHeadingClass: string;
        commonTabHeadingClass: string;
        selectedTabHeadingClass: string;
        unselectedTabHeadingClass: string;
        lastTab: string;
        headlineClass: string;
        selectedHeadlineClass: string;
      };
    };
  };
  isLastTab: boolean;
  headlineText: Field<string>;
  headlineLevel?: Item;
  id: string;
};

function TabHeading({
  onClick,
  selected,
  themeData,
  isLastTab,
  headlineLevel,
  headlineText,
  id,
}: TabHeadingProps) {
  return (
    <div className={themeData.classes.tabs.outerTabHeadingClass}>
      <button
        className={classNames(
          themeData.classes.tabs.commonTabHeadingClass,
          selected
            ? themeData.classes.tabs.selectedTabHeadingClass
            : themeData.classes.tabs.unselectedTabHeadingClass,
          isLastTab ? themeData.classes.tabs.lastTab : ''
        )}
        onClick={onClick}
        type="button"
        id={id}
      >
        <Headline
          useTag="h3"
          classes={classNames(
            themeData.classes.tabs.headlineClass,
            selected ? themeData.classes.tabs.selectedHeadlineClass : ''
          )}
          fields={{
            headlineLevel,
            headlineText,
          }}
        />
      </button>
    </div>
  );
}

TabHeading.tabsRole = 'Tab';

type TabLabelView = 'standard' | 'long';

type TabsGeneralContentProps = Sitecore.Components.Tabs.TabsGeneralContent.TabsGeneralContent & {
  tabs: Tab[];
  placeholder: ReactNode;
};

function CalculateSliderSettings(
  screenType: string,
  currentScreenWidth: number,
  numberOfTabs: number,
  tabLabelView: string,
  defaultTab: number
) {
  let enoughTabsToScroll = false;
  let slidesToShow = 2;
  let initialSlide = 0;
  let isLongTabLabelView = false;

  if (screenType) {
    if (currentScreenWidth < getBreakpoint('md') && (numberOfTabs > 2 || tabLabelView === 'long')) {
      if (tabLabelView === 'long') {
        slidesToShow = 1;
        initialSlide = defaultTab;
        isLongTabLabelView = true;
      }
    } else if (
      currentScreenWidth >= getBreakpoint('md') &&
      currentScreenWidth < getBreakpoint('ml')
    ) {
      slidesToShow = 4;
    } else if (currentScreenWidth >= getBreakpoint('ml')) {
      slidesToShow = 6;
    }
    enoughTabsToScroll = numberOfTabs > slidesToShow;
    initialSlide =
      defaultTab >= slidesToShow && !isLongTabLabelView
        ? defaultTab + 1 - slidesToShow
        : initialSlide;
  }

  return { enoughTabsToScroll, slidesToShow, initialSlide, isLongTabLabelView };
}

export function TabsGeneralContentClient(props: TabsGeneralContentProps): JSX.Element {
  const tabLabelView = getEnum<TabLabelView>(props.fields?.tabLabelView) ?? 'standard';
  const componentRef = useRef<HTMLDivElement>(null);
  const { screenType, currentScreenWidth } = useCurrentScreenType();
  const hasScrolledOnLoad = useRef(false);

  const getHashAnchor = useCallback((): number => {
    let hashedTabIndex = -1;
    if (typeof window !== 'undefined' && window.location.hash !== '') {
      const hash = window.location.hash.replace('#', '');
      hashedTabIndex = props.tabs.findIndex(
        (tab: Tab) =>
          isEqualIgnoreCase(tab.id, hash) || isEqualIgnoreCase(tab.contentId.value, hash)
      );
    }
    return hashedTabIndex;
  }, [props.tabs]);

  let defaultTab = 0;
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabIndexChange = useCallback(
    (index: number) => {
      setActiveTab(index);
      const tab = props.tabs[index] as Tab;
      if (tab) {
        window.location.hash = defaultIfNullOrEmpty(tab.contentId.value, tab.id);
      }
    },
    [setActiveTab, props.tabs]
  );

  useEffect(() => {
    // Scroll ONLY once on initial load when coming from a hash
    if (!hasScrolledOnLoad.current && getHashAnchor() > -1 && componentRef.current) {
      componentRef.current.scrollIntoView();
      hasScrolledOnLoad.current = true;
    }

    // Handle browser back / forward navigation
    window.onpopstate = () => {
      const currentHash = getHashAnchor();
      if (currentHash > -1) {
        handleTabIndexChange(currentHash);
      }
    };

    return () => {
      window.onpopstate = null;
    };
  }, [getHashAnchor, handleTabIndexChange]);

  const hashedTab = getHashAnchor();
  const normalizeId = (id?: string) => id?.replace(/[-{}]/g, '').toUpperCase().trim();

  if (hashedTab > -1) {
    defaultTab = hashedTab;
  } else if (props.fields?.defaultActiveTab) {
    const defaultTabIndex = props.tabs.findIndex((child: Item) => {
      return normalizeId(child.id) === normalizeId(props.fields.defaultActiveTab.id);
    });

    if (defaultTabIndex >= 0) {
      defaultTab = defaultTabIndex;
    }
  }

  useEffect(
    function loadTabForHash() {
      const hashedTab = getHashAnchor();
      if (hashedTab > -1) {
        setActiveTab(hashedTab);
      }
    },
    [getHashAnchor, setActiveTab]
  );

  const tabContextValue = useMemo(
    () => ({
      activeTab,
      tabIds: props.tabs.map((t: Tab) => t.id),
    }),
    [activeTab, props.tabs]
  );

  const { themeData } = useTheme(
    TabsGeneralContentTheme(screenType ?? 'sm', props.tabs.length, tabLabelView)
  );

  const { enoughTabsToScroll, slidesToShow, initialSlide, isLongTabLabelView } =
    CalculateSliderSettings(
      screenType ?? 'sm',
      currentScreenWidth,
      props.tabs.length,
      tabLabelView,
      activeTab
    );

  const handleSlideIndexChange = (index: number) => {
    if (!isLongTabLabelView) {
      handleTabIndexChange(index);
    }
  };

  const isFewTabs = props.tabs.length <= 3 && !enoughTabsToScroll;
  const slidesToShowFallback = props.tabs.length > slidesToShow ? slidesToShow : 1;
  const slidesToShowValue = isFewTabs ? props.tabs.length || 1 : slidesToShowFallback;

  const sliderSettings = {
    infinite: false,
    speed: 500,
    initialSlide: initialSlide,
    slidesToShow: slidesToShowValue,
    slidesToScroll: 1,
    enableNumberedPagination: currentScreenWidth < getBreakpoint('md') && tabLabelView === 'long',
    dots: currentScreenWidth < getBreakpoint('md') && tabLabelView === 'long',
    numberedPaginationClasses: themeData.classes.numberedPaginationClass,
    nextArrowClasses: themeData.classes.nextArrowClass,
    prevArrowClasses: themeData.classes.prevArrowClass,
    arrows: currentScreenWidth < getBreakpoint('md') || enoughTabsToScroll,
    variableWidth: !isFewTabs,
    className: 'tabsgeneralcontent',
    afterIndexChange: handleSlideIndexChange,
  };

  return (
    <Component dataComponent="tabs/tabsgeneralcontent" {...props}>
      <div className={themeData.classes.componentClass} ref={componentRef}>
        <Headline classes={themeData.classes.headlineClass} defaultTag="h2" {...props} />
        {screenType && (
          <Tabs
            selectedIndex={activeTab}
            onSelect={(index: number) => setActiveTab(index)}
            focusTabOnClick={false}
          >
            <TabList className={themeData.classes.tabs.tabListClass}>
              <div role="tab">
                <SliderWrapper sliderSettings={sliderSettings}>
                  {props.tabs.map((tab: Tab, index: number) => {
                    const key = `tab-heading-${index}`;
                    return (
                      <TabHeading
                        key={key}
                        selected={activeTab === index}
                        themeData={themeData}
                        isLastTab={index === props.tabs.length - 1}
                        onClick={() => {
                          handleTabIndexChange(index);
                        }}
                        headlineLevel={tab.headlineLevel}
                        headlineText={tab.headlineText}
                        id={tab.id}
                      />
                    );
                  })}
                </SliderWrapper>
              </div>
            </TabList>
            <TabsGeneralContentContext.Provider value={tabContextValue}>
              {props.placeholder}
            </TabsGeneralContentContext.Provider>
          </Tabs>
        )}
      </div>
    </Component>
  );
}
