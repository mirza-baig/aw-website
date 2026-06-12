'use client';

import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { BreadcrumbItem } from 'lib/breadcrumb/breadcrumb-service';
import { ComponentProps } from 'lib/component-props';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { useTheme } from 'lib/context/ThemeContext';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import debounce from 'lodash/debounce';
import Script from 'next/script';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';

import { BreadcrumbTheme } from './helpers/Breadcrumb.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type AWHeaderProps = Sitecore.Components.Navigation.Header.Header;

function Breadcrumb_Default(props: ComponentProps): JSX.Element {
  const pageItem = props.page.layout.sitecore.route as Sitecore.BaseTemplates.BasePage;
  const pageTitle = pageItem?.fields?.pageTitle?.value ?? undefined;

  const { siteInfo, breadcrumbs = [] } = useWebsiteContext();
  const publicUrl = siteInfo?.canonicalHostName ?? siteInfo?.targetHostName ?? '';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBreadcrumbNavOverflowing, setIsBreadcrumbNavOverflowing] = useState(false);

  const breadcrumbContainerRef = useRef<HTMLDivElement | null>(null);

  const { screenType } = useCurrentScreenType();
  const isDesktop = screenType !== 'sm' && screenType !== 'md';

  const [styleForBlog, setStyleForBlog] = useState('');

  const hasRaqBanner = useMemo<boolean>((): boolean => {
    const headerElement = props.page.layout.sitecore.route?.placeholders?.['headless-header']?.find(
      (item) => item.componentName === 'AWHeader'
    ) as AWHeaderProps;
    const mainMenu = headerElement?.fields?.children?.find(
      (nav: AWHeaderProps) => nav?.fields?.menuTitle && nav?.fields?.menuTitle.value === 'mainMenu'
    );
    const returnValue = mainMenu?.fields?.children?.find(
      (item: AWHeaderProps) =>
        item.templateId ===
        SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Navigation
          .RaqMobileBanner.RaqMobileBanner.Id
    );
    return !!returnValue;
  }, [props.page]);

  const { themeData } = useTheme(BreadcrumbTheme(hasRaqBanner));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mastheadCheck = document.querySelector('[data-component="general/globalmasthead"]');
      if (mastheadCheck) {
        setStyleForBlog('max-ml:relative max-ml:top-[60px] py-0');
      } else {
        setStyleForBlog(
          `max-ml:relative ${
            hasRaqBanner ? 'max-ml:top-[60px] py-[36px]' : 'max-ml:top-[30px] py-[12px]'
          } lg:py-[10px]`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollBreadcrumb = debounce(() => {
    if (breadcrumbContainerRef.current) {
      const container = breadcrumbContainerRef.current;
      const scrollLeft = container.scrollLeft;

      const beforeShadow = document.querySelector('.before-shadow') as HTMLDivElement;
      const afterShadow = document.querySelector('.after-shadow') as HTMLDivElement;
      if (scrollLeft > 0) {
        beforeShadow.style.opacity = '0.6';
      } else {
        beforeShadow.style.opacity = '0';
      }

      if (scrollLeft < container.scrollWidth - container.clientWidth) {
        afterShadow.style.opacity = '0.6';
      } else {
        afterShadow.style.opacity = '0';
      }
    }
  }, 100);

  useEffect(() => {
    const breadcrumbNav = document.querySelector('.breadcrumb-nav ol') as HTMLElement;

    const handleCollapse = () => {
      if (breadcrumbs.length > 5 && isDesktop) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    const handleResize = () => {
      if (breadcrumbNav) {
        const breadcrumbNavWidth = breadcrumbNav.offsetWidth;
        const viewportWidth = window.innerWidth;

        // Compare the width of breadcrumbNav to the viewport width
        if (breadcrumbNavWidth > viewportWidth) {
          setIsBreadcrumbNavOverflowing(true);
        } else {
          setIsBreadcrumbNavOverflowing(false);
        }
      }
    };

    handleCollapse(); // Initial check for collapse

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breadcrumbs, isDesktop]);

  useEffect(() => {
    const containerRef = breadcrumbContainerRef.current;

    if (!isCollapsed && !isDesktop && isBreadcrumbNavOverflowing && containerRef) {
      containerRef.addEventListener('scroll', handleScrollBreadcrumb);
    } else if (containerRef) {
      containerRef.removeEventListener('scroll', handleScrollBreadcrumb);
    }
    // Cleanup
    return () => {
      if (containerRef) {
        containerRef.removeEventListener('scroll', handleScrollBreadcrumb);
      }
    };
  }, [isCollapsed, isDesktop, isBreadcrumbNavOverflowing, handleScrollBreadcrumb]);
  const handleClick = () => {
    setIsCollapsed(false);
  };

  const breadcrumData = breadcrumbs.length > 0 && breadcrumbs.slice(1);
  const currentItem = breadcrumData && breadcrumData.length > 0 && breadcrumData.pop();
  const previousItem = breadcrumData && breadcrumData.length > 0 && breadcrumData.pop();
  const firstItem = breadcrumbs[0]?.name && breadcrumbs[0]?.href && (
    <li key="home">
      <LinkWrapper
        field={{ href: breadcrumbs[0].href, text: breadcrumbs[0].name }}
        className="flex items-center text-black underline hover:font-heavy"
      >
        {currentItem && <SvgIcon icon="caret-right" className="pl-xxxs" />}
      </LinkWrapper>
    </li>
  );

  const collapsedItems = (
    <>
      {firstItem}
      <li className="pl-xxxs">
        <span className="flex cursor-pointer items-center">
          ...
          <SvgIcon icon="caret-right" className="pl-xxxs" />
        </span>
      </li>
      {previousItem && previousItem.name && (
        <li className="px-xxxs">
          <LinkWrapper
            field={{
              href: previousItem.href,
              text: previousItem.name,
            }}
            className="flex items-center text-black hover:font-heavy"
          >
            <SvgIcon icon="caret-right" className="pl-xxxs" />
          </LinkWrapper>
        </li>
      )}

      {currentItem && (
        <li className="px-xxxs text-black">{currentItem.name ? currentItem.name : pageTitle}</li>
      )}
    </>
  );

  const listItems =
    breadcrumData &&
    breadcrumData.length > 0 &&
    breadcrumData.map(
      (item: BreadcrumbItem) =>
        item.name && (
          <li key={item.name + item.href} className="px-xxxs">
            <LinkWrapper
              field={{
                href: item.href,
                text: item.name,
              }}
              className="flex items-center text-black underline hover:font-heavy"
            >
              <SvgIcon icon="caret-right" className="pl-xxxs" />
            </LinkWrapper>
          </li>
        )
    );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item: BreadcrumbItem, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${publicUrl}${item.href === '/' ? '' : item.href}`,
    })),
  };

  useEffect(() => {
    const scrollBreadcrumb = document.getElementById('scrollBreadcrumb');
    setTimeout(function () {
      if (scrollBreadcrumb) {
        scrollBreadcrumb.scrollLeft = scrollBreadcrumb?.scrollWidth;
      }
    }, 100);
  }, []);

  return (
    <>
      <Script
        id=""
        strategy="beforeInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {breadcrumbs.length > 1 && (
        <div
          className={classNames(
            themeData.classes.breadcrumbMargin,
            'mt-m px-m md:max-w-(--breakpoint-xl) ml:mb-0 ml:mt-8 ml:px-l lg:mx-auto'
          )}
          id="breadcrumb"
        >
          <style>{`
            @media (min-width: 1009px) and (max-width: 1247px) {
            .custom-padding {
            padding-top: 10px !important;
            padding-bottom: 10px !important;
        }
      }
      `}</style>
          <div
            className={`${themeData.classes.breadcrumbContainer} ${styleForBlog} custom-padding`}
          >
            {isBreadcrumbNavOverflowing && (
              <span
                className={`before-shadow pointer-events-none absolute left-[-9px] top-0 z-1 h-full w-5 opacity-0 transition-opacity duration-300 ease-[ease-in-out] content-[""] ${
                  isDesktop ? ' hidden' : ''
                }`}
              ></span>
            )}
            <nav className="breadcrumb-nav" aria-label="breadcrumb">
              <div
                className="relative flex overflow-x-auto whitespace-nowrap"
                ref={breadcrumbContainerRef}
              >
                {isCollapsed && isDesktop ? (
                  <button
                    onClick={handleClick}
                    onKeyDown={(e) => {
                      if (e.code === 'Enter' || e.code === 'Space') {
                        handleClick();
                      }
                    }}
                  >
                    <ol className="flex ">{collapsedItems}</ol>
                  </button>
                ) : (
                  <ol id="scrollBreadcrumb" className="flex overflow-x-auto">
                    {currentItem && firstItem}
                    {listItems}
                    {previousItem && previousItem.name && (
                      <li className="px-xxxs">
                        <LinkWrapper
                          field={{
                            href: previousItem.href,
                            text: previousItem.name,
                          }}
                          className="flex items-center text-black underline hover:font-heavy"
                        >
                          <SvgIcon icon="caret-right" className="pl-xxxs" />
                        </LinkWrapper>
                      </li>
                    )}

                    {currentItem && (
                      <li className="px-xxxs text-black">
                        {currentItem?.name ? currentItem.name : pageTitle}
                      </li>
                    )}
                  </ol>
                )}
              </div>
            </nav>
            {isBreadcrumbNavOverflowing && (
              <span
                className={`after-shadow pointer-events-none absolute right-0 top-0 z-1 h-full w-5 transition-opacity duration-300 ease-[ease-in-out] content-[""]
                ${isDesktop ? ' hidden' : ''}`}
              ></span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const Default = Breadcrumb_Default;
