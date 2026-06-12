'use client';
import { Item, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import { JSX, useEffect } from 'react';
import TagManager, { TagManagerArgs } from 'react-gtm-module';

import { Sitecore } from '.sitecore/AndersenWindows.model';
/* Bold Orange datalayer use for MCP */
function extractAndCombineTitleValues(data: Item[] | undefined): string | null {
  if (data === undefined) {
    return null;
  }

  const field = data as unknown as Sitecore.Data.Search.FacetTag[];

  if (field.length === 0) {
    return null;
  }

  return field.map((item) => item.fields?.title?.value).join(',');
}

function getCategoryName(page: Sitecore.BaseTemplates.BasePage) {
  const fields = page.fields;
  if (fields && Array.isArray(fields?.windowType) && fields?.windowType?.length > 0) {
    return fields?.windowType;
  } else if (fields && Array.isArray(fields?.doorType)) {
    return fields?.doorType;
  }
  return undefined;
}

function buildPageLevels(pageLevels: (string | null)[] = []): Record<string, string | null> {
  while (pageLevels.length < 9) {
    pageLevels.push(null);
  }
  const result = pageLevels.reduce<Record<string, string | null>>((levels, level, index) => {
    levels[`page_level_${index + 1}`] =
      typeof level == 'string' && level.length > 0 ? level.toLowerCase() : null;
    return levels;
  }, {});

  return result;
}

function buildPageViewEvent(
  itemPath: string,
  page: Sitecore.BaseTemplates.BasePage,
  siteName: string
) {
  //Page Levels
  const pageLevels = itemPath?.replace(/(?:^\/+)|(?:\/+$)/g, '')?.split('/');
  const result = {
    event: 'aw.page_view',
    pageType: page.fields?.pageType?.value ?? null,
    product: page.fields?.breadcrumbTitle?.value ?? null,
    doorType: extractAndCombineTitleValues(page.fields?.doorType),
    productType: extractAndCombineTitleValues(page.fields?.productType),
    windowType: extractAndCombineTitleValues(page.fields?.windowType),
    productSeries: extractAndCombineTitleValues(page.fields?.productSeries),
    pageInformation: {
      ...buildPageLevels(pageLevels),
      product_series: extractAndCombineTitleValues(page.fields?.productSeries),
      product_type: extractAndCombineTitleValues(page.fields?.productType),
      page_type: page.fields?.pageType?.value ?? null,
      category_name: extractAndCombineTitleValues(getCategoryName(page)), // Handle multi-select
      product_name: page.fields?.breadcrumbTitle?.value ?? null, // Breadcrumb-based product name
    },
    siteInformation: {
      brand: siteName,
    },
  };

  return result;
}

function handleDocumentClick(event: Event) {
  if (event.target instanceof Element === false) {
    return;
  }

  const target = event.target;

  // Handle click for authored CTAs
  if (target.hasAttribute('data-gtm-click')) {
    const dataLayer: Record<string, string | null> = {};

    for (const name of target.getAttributeNames()) {
      if (name.startsWith('data-gtm-dl-') === false) {
        continue;
      }

      const key = name.replace('data-gtm-dl-', '').replaceAll('-', '_');
      dataLayer[key] = target.getAttribute(name);
    }

    TagManager.dataLayer({ dataLayer });
    return;
  }

  // Handle click for RTE CTAs
  // Note: We don't need to handle nav_click gtm event as its not likely to have the RTE in navigation components
  if (target instanceof HTMLAnchorElement && target.closest('div.body-copy')) {
    TagManager.dataLayer({
      dataLayer: {
        event: target.href.startsWith('tel:') ? 'click_to_call' : 'cta_click',
      },
    });
  }
}

export const GoogleTagManager = (): JSX.Element => {
  const { siteInfo, theme } = useWebsiteContext();
  const { page } = useSitecore();
  const pageItem = page.layout.sitecore.route as Sitecore.BaseTemplates.BasePage;
  const itemPath = page.layout.sitecore.context.itemPath ?? '';

  // GTM
  // See https://andersenwindows.atlassian.net/wiki/spaces/EW/pages/3275096077/Local+Google+Tag+Manager+Development for Developer information

  // Initialization
  useEffect(() => {
    if (siteInfo?.gtm_id === undefined) {
      return;
    }

    const gtmInitData: TagManagerArgs = {
      gtmId: siteInfo.gtm_id as string,
      auth: siteInfo.gtm_auth as string | undefined,
      preview: siteInfo.gtm_environment as string | undefined,
    };

    TagManager.initialize(gtmInitData);

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [siteInfo]);

  // Page Changes
  useEffect(() => {
    if (siteInfo?.gtm_id === undefined) {
      return;
    }

    /* Bold Orange datalayer use for MCP */
    if (siteInfo.name === 'AndersenWindows' && theme === 'aw') {
      TagManager.dataLayer({ dataLayer: buildPageViewEvent(itemPath, pageItem, siteInfo.name) });
    }
  }, [pageItem, itemPath, siteInfo, theme]);

  return <></>;
};
