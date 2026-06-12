'use client';

import { ComponentRendering, Field, Item, Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { Tabs } from 'helpers/Tabs';
import ToggleSwitch from 'helpers/ToggleSwitch/ToggleSwitch';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';
import React, { useEffect, useRef, useState } from 'react';

import Promo from './helpers/Promo.helper';
import { TabsFeaturedPromoTheme } from './helpers/TabsFeaturedPromo.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type TabItemsProps = {
  fields: {
    children: Array<Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo>;
    headlineLevel: Item;
    headlineText: Field<string>;
  };
};

type TabCollectionsProps = {
  fields: {
    children: Array<Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo & TabItemsProps>;
  };
};

type TabsFeaturedPromoProps = ComponentProps &
  Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo &
  TabCollectionsProps;

function TabsFeaturedPromo_Default(props: TabsFeaturedPromoProps) {
  const { fields } = getComponentServerProps(props.rendering) as TabsFeaturedPromoProps;

  const { children } = fields ?? {};

  const { themeName, themeData } = useTheme(TabsFeaturedPromoTheme);
  const { currentScreenWidth } = useCurrentScreenType();

  const titlesScroller = useRef<HTMLDivElement>(null);

  //#region initial states and data of tabs

  // ToggleSwitch
  const [activeSwitchIndex, setActiveSwitchIndex] = useState(0);
  //Sets visible tab group
  const [visiblePanelIndex, setVisiblePanelIndex] = useState(0);
  //Sets visible tab panel
  const [currentIndex, setCurrentIndex] = useState(-1);
  // Sets if hash should be updated
  const [shouldUpdateURL, setShouldUpdateURL] = useState(false);

  //#endregion

  const compareTabId = React.useCallback(
    (tabId: string): boolean => {
      if (!tabId) {
        return false;
      }

      for (let collectionIndex = 0; collectionIndex < children.length; collectionIndex++) {
        const items = children[collectionIndex].fields.children;
        for (let itemIndex = 0; itemIndex < items?.length; itemIndex++) {
          const item = items[itemIndex];
          const idToCompare = item?.fields?.contentId?.value ?? `tab-${normalizeGuid(item.id)}`;
          if (tabId === idToCompare) {
            setActiveSwitchIndex(collectionIndex);
            setVisiblePanelIndex(collectionIndex);
            setCurrentIndex(itemIndex);
            return true;
          }
        }
      }
      return false;
    },
    [children]
  );

  useEffect(() => {
    if (!children || children.length === 0) {
      return;
    }

    const selectedId = window.location.hash?.slice(1);
    const defaultTabId = fields.defaultActiveTab?.fields?.contentId?.value;

    let selected = compareTabId(selectedId);

    if (!selected && defaultTabId) {
      selected = compareTabId(defaultTabId);
    }

    if (!selected && children?.[0]?.fields?.children?.[0]) {
      setActiveSwitchIndex(0);
      setVisiblePanelIndex(0);
      setCurrentIndex(0);
    }
  }, [children, fields?.defaultActiveTab, compareTabId]);

  // get the tab title appear into view if the tabs are in scrollable section
  useEffect(() => {
    const selectedItem = (fields?.children?.[visiblePanelIndex]?.fields.children ?? [])[
      currentIndex
    ];
    const selectedItemId =
      selectedItem?.fields?.contentId.value ?? `tab-${normalizeGuid(selectedItem?.id)}`;

    if (shouldUpdateURL && currentIndex >= 0) {
      history.pushState(history.state, window.location.href, `#${selectedItemId}`);
      setShouldUpdateURL(false);

      // Defer scroll until after DOM updates
      setTimeout(() => {
        const tabElement = document.getElementById(selectedItemId);
        if (tabElement) {
          tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 0);
    }

    if (
      titlesScroller.current &&
      currentScreenWidth <= getBreakpoint('ml') &&
      selectedItemId.replace('tab-', '').length > 0
    ) {
      // We're using ref of the parent node of the titles in order to avoid bugs which can occur
      // if this component is authored multiple times in single page
      titlesScroller.current
        .querySelector(`[id='tab-${selectedItemId}']`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // "fields.children" can be ignored as it is coming from layout service. We can ignore this warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePanelIndex, currentIndex, shouldUpdateURL, currentScreenWidth]);

  const getSwitchTitles = (): string[] => {
    const switchTitles = ['', ''];

    children.forEach(
      (collection: Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo, index: number) => {
        switchTitles[index] = (collection?.fields?.mobileToggleTitle as Field<string>)?.value;
      }
    );

    return switchTitles;
  };

  const selectTab = (itemIndex: number, collectionIndex: number) => {
    setShouldUpdateURL(true);
    setCurrentIndex(itemIndex);
    setVisiblePanelIndex(collectionIndex);
  };

  const scrollTab = () => {
    setCurrentIndex(currentIndex + 1);
    tabRefs.current[currentIndex + 1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const renderToggleSwitch = () => {
    if (currentScreenWidth <= getBreakpoint('ml')) {
      return (
        <ToggleSwitch
          switchTitles={getSwitchTitles()}
          activeSwitchIndex={activeSwitchIndex}
          toggleActiveSwtich={() => {
            const _activeSwitchIndex = activeSwitchIndex === 0 ? 1 : 0;
            setVisiblePanelIndex(_activeSwitchIndex);
            setActiveSwitchIndex(_activeSwitchIndex);
            setCurrentIndex(0);
          }}
        />
      );
    }
    return null;
  };
  const tabRefs = useRef<Array<HTMLLIElement | null>>([]);
  tabRefs.current = [];

  const renderTitles = (
    collection: Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo,
    collectionIndex: number
  ) => {
    if (
      (currentScreenWidth <= getBreakpoint('ml') && collectionIndex === visiblePanelIndex) ||
      currentScreenWidth > getBreakpoint('ml')
    ) {
      return (
        <>
          {collection?.fields?.headlineText?.value !== '' && (
            <div className={themeData.classes.tabsClasses.tabHeadlineWrapper}>
              {themeName === 'aw' && (
                <SvgIcon
                  icon="orange-triangle"
                  className={themeData.classes.tabsClasses.tabHeadlineIcon}
                />
              )}
              <Headline
                fields={collection?.fields}
                classes={themeData.classes.tabsClasses.tabHeadline}
              />
            </div>
          )}
          <div ref={titlesScroller} className={themeData.classes.tabsClasses.tabTitlesContainer}>
            {currentIndex > 0 && (
              <button
                onClick={scrollTab}
                onKeyUp={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    scrollTab();
                  }
                }}
              >
                <div className={themeData.classes.tabsClasses.leftArrowIcon}>
                  <SvgIcon icon="arrow-left" />
                </div>
              </button>
            )}
            <ul className={themeData.classes.tabsClasses.tabTitlesWrapper} key={collectionIndex}>
              {collection?.fields?.children?.map(
                (
                  item: Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo,
                  itemIndex: number
                ) => {
                  return (
                    <li
                      key={item.id}
                      id={item.fields?.contentId?.value ?? `tab-${normalizeGuid(item.id)}`}
                      // @ts-ignore allow existing ref logic here
                      ref={(el) => (tabRefs.current[itemIndex] = el)}
                      className={classNames(
                        currentScreenWidth >= getBreakpoint('ml')
                          ? 'wrap-break-word'
                          : 'whitespace-nowrap',
                        themeData.classes.tabsClasses.tabTitle,
                        itemIndex === currentIndex &&
                          collectionIndex === visiblePanelIndex &&
                          themeData.classes.tabsClasses.activeTabTitle
                      )}
                    >
                      <button
                        className="text-left"
                        onClick={() => selectTab(itemIndex, collectionIndex)}
                        onKeyDown={(e) => {
                          if (e.code === 'Enter' || e.code === 'Space') {
                            selectTab(itemIndex, collectionIndex);
                          }
                        }}
                      >
                        <Text tag="h4" field={item.fields?.tabTitle as Field<string>} />
                      </button>
                    </li>
                  );
                }
              )}
            </ul>
            {currentIndex < collection?.fields.children?.length - 1 && (
              <button
                onClick={scrollTab}
                onKeyUp={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    scrollTab();
                  }
                }}
              >
                <div className={themeData.classes.tabsClasses.rightArrowIcon}>
                  <SvgIcon icon="arrow-right" />
                </div>
              </button>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  if (!fields) {
    return null;
  }

  const renderTabTitles = () => {
    return (
      <>
        {/* Toggle Switch */}
        {children?.length > 1 && (
          <div className={themeData.classes.tabsClasses.toggleContainer}>
            {renderToggleSwitch()}
          </div>
        )}
        {/* Tab Titles List */}
        {children?.map(
          (
            collection: Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo,
            collectionIndex: number
          ) => {
            return (
              <React.Fragment key={collection.fields?._AW_TemplateId.value}>
                {renderTitles(collection, collectionIndex)}
              </React.Fragment>
            );
          }
        )}
      </>
    );
  };

  const renderTabPanels = (): React.ReactElement[] => {
    const panels: Array<React.ReactElement> = [];
    children?.map(
      (
        collection: Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo,
        collectionIndex: number
      ) => {
        return (
          collectionIndex === visiblePanelIndex &&
          collection.fields?.children?.forEach(
            (tabItem: Sitecore.Components.Tabs.TabsFeaturedPromo.TabsFeaturedPromo) => {
              panels.push(
                <Promo key={tabItem.id} classes={themeData.classes.promoClasses} {...tabItem} />
              );
            }
          )
        );
      }
    );

    return panels;
  };

  return (
    <Component variant="lg" dataComponent="promo/tabsfeaturedpromo" {...props}>
      <div className="col-span-12">
        <Headline fields={fields} classes={themeData.classes.headline} />
      </div>
      {fields.children?.length > 0 && (
        <div className="col-span-12 mb-ml">
          <Tabs classes={themeData.classes.tabsClasses} currentTabIndex={currentIndex}>
            {renderTabTitles()}
            {renderTabPanels()}
          </Tabs>
        </div>
      )}
    </Component>
  );
}

export const Default = withDatasourceCheck(TabsFeaturedPromo_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        fields: ItemFieldResult[];
      }>;
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item?.fields ?? []),
      children: mapSearchResults(fields.data.item?.children ?? [], (child) => {
        return {
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
            children: mapSearchResults(child.children, (grandChild) => {
              return {
                fields: {
                  ...mapItemFieldResultsToObject(grandChild.fields),
                },
              };
            }),
          },
        };
      }),
    },
  };

  return result;
}
