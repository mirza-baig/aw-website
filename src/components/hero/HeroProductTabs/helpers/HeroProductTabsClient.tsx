'use client';

import { Field, Item, RichText, Text, TextField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { JSX, useEffect, useRef, useState } from 'react';
import { TabList, Tabs } from 'react-tabs';

import styles from './_react-tabs.module.scss';
import { useCurrentTab } from './CurrentTab';
import { HeroProductTabsTheme } from './HeroProductTabs.theme';
import { Tab } from './HeroProductTabs.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

/* --------------------------------------------------
 Types
---------------------------------------------------*/
type HeroProductTabsProps = Sitecore.Components.Hero.HeroProductTabs.HeroProductTabs & {
  tabs: Tab[];
  fields?: {
    headline?: Field<string>;
    headlineLevel?: Item;
    sticky?: Field<boolean>;
  };
};

/* --------------------------------------------------
 Tab Heading
---------------------------------------------------*/
const TabHeading = ({
  onClick,
  children,
  index,
  tabIndex,
  themeData,
}: {
  onClick: () => void;
  children: JSX.Element;
  index: number;
  tabIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeData: any;
}) => {
  const isSelected = index === tabIndex;

  return (
    <div
      role="tab"
      tabIndex={isSelected ? 0 : -1}
      aria-selected={isSelected}
      onClick={onClick}
      className={classNames(
        styles['react-tabs__tab'],
        themeData.classes.tabs.commonTabHeadingClass,
        isSelected
          ? themeData.classes.tabs.selectedTabHeadingClass
          : themeData.classes.tabs.unselectedTabHeadingClass
      )}
    >
      {children}
    </div>
  );
};

/* --------------------------------------------------
 Component
---------------------------------------------------*/
export function HeroProductTabsClient(props: HeroProductTabsProps): JSX.Element {
  const { fields } = props;

  const tabChildren = props.tabs;
  const numberOfTabs = tabChildren?.length ?? 0;

  const componentRef = useRef<HTMLDivElement>(null);

  const { currentTab, setCurrentTab } = useCurrentTab();

  const [raqBannerAdjust, setRaqBannerAdjust] = useState(false);

  const { screenType, currentScreenWidth } = useCurrentScreenType();
  const { themeName, themeData } = useTheme(HeroProductTabsTheme(screenType ?? 'sm', numberOfTabs));

  /* --------------------------------------------------
   Helpers
  ---------------------------------------------------*/
  const getTabTitle = (index: number): TextField | undefined => tabChildren?.[index]?.title;

  const getTabContentId = (index: number): string | undefined =>
    tabChildren?.[index]?.contentId?.value;

  const getHashAnchor = (): number => {
    if (typeof window === 'undefined' || !window.location.hash || !tabChildren) {
      return -1;
    }

    const hash = window.location.hash.replace('#', '').toLowerCase();

    return tabChildren.findIndex((child: Tab) => {
      return child.id?.toLowerCase() === hash || child.contentId?.value?.toLowerCase() === hash;
    });
  };

  /* --------------------------------------------------
   Effects
  ---------------------------------------------------*/
  useEffect(() => {
    const TOP_THRESHOLD = 70;

    const handleScroll = () => {
      setRaqBannerAdjust(window.scrollY > TOP_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const hashedTab = getHashAnchor();
    if (hashedTab > -1) {
      setCurrentTab(hashedTab);
      componentRef.current?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hashedTab = getHashAnchor();
      if (hashedTab > -1) {
        setCurrentTab(hashedTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabChildren]);

  /* --------------------------------------------------
   Slider
  ---------------------------------------------------*/
  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: numberOfTabs > 2 ? 2 : numberOfTabs,
    slidesToScroll: 1,
    dots: false,
    arrows: currentScreenWidth < getBreakpoint('md') && numberOfTabs > 3,
    variableWidth: true,
    className: 'heroproducttabs',
    swipeToSlide: true,
  };

  const isStickyTabonPage = fields?.sticky?.value;

  const stickyTabClass = (theme: string) => {
    if (!isStickyTabonPage) {
      return '';
    }
    return `sticky ${theme === 'aw' ? 'top-[55px]' : 'top-0'} ml:top-[122px]`;
  };

  if (!fields || !tabChildren?.length) {
    return <></>;
  }

  /* --------------------------------------------------
   Render
  ---------------------------------------------------*/
  return (
    <Component padding="0" variant="full" dataComponent="hero/heroproducttabs" {...props}>
      <div className="col-span-12" ref={componentRef}>
        <Tabs
          className={styles['react-tabs']}
          selectedIndex={currentTab}
          onSelect={(index) => setCurrentTab(index)}
        >
          {/* ---------------- TAB HEADERS ---------------- */}
          <div
            className={`heroproducttabs-wrapper z-19 w-full border-b bg-white ${stickyTabClass(
              themeName
            )}`}
            role="tablist"
          >
            <div className="flex w-full flex-col ml:flex-row ml:px-m lg:mx-auto lg:max-w-(--breakpoint-lg)">
              <RichText
                tag={getHeadingLevel('h1', fields?.headlineLevel)}
                className={themeData.classes.productHeadlineClass}
                field={fields.headline}
              />

              <TabList className={classNames(raqBannerAdjust ? 'pt-5' : '', 'ml:ml-auto')}>
                {screenType === 'sm' ? (
                  <SliderWrapper sliderSettings={sliderSettings}>
                    {tabChildren.map((tab: Tab, index: number) => (
                      <TabHeading
                        key={tab.id}
                        index={index}
                        tabIndex={currentTab}
                        themeData={themeData}
                        onClick={() => {
                          setCurrentTab(index);
                          window.location.hash = getTabContentId(index) ?? '';
                        }}
                      >
                        <Text
                          tag="h3"
                          id={`react-tabs-${index}-label`}
                          className={classNames(
                            themeData.classes.tabs.headlineClass,
                            index === currentTab ? themeData.classes.tabs.selectedHeadlineClass : ''
                          )}
                          field={getTabTitle(index)}
                        />
                      </TabHeading>
                    ))}
                  </SliderWrapper>
                ) : (
                  <div className="flex flex-row">
                    {tabChildren.map((tab: Tab, index: number) => (
                      <TabHeading
                        key={tab.id}
                        index={index}
                        tabIndex={currentTab}
                        themeData={themeData}
                        onClick={() => {
                          setCurrentTab(index);
                          window.location.hash = getTabContentId(index) ?? '';
                        }}
                      >
                        <Text
                          tag="h3"
                          id={`react-tabs-${index}-label`}
                          className={classNames(
                            themeData.classes.tabs.headlineClass,
                            index === currentTab ? themeData.classes.tabs.selectedHeadlineClass : ''
                          )}
                          field={getTabTitle(index)}
                        />
                      </TabHeading>
                    ))}
                  </div>
                )}
              </TabList>
            </div>
          </div>

          {/* ---------------- TAB PANELS ---------------- */}
          {props.placeholder}
        </Tabs>
      </div>
    </Component>
  );
}
