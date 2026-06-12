// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

import { getBreadcrumbTheme } from './Search.Breadcrumb.theme';
import { getFacetsTheme } from './Search.Facets.theme';
import { getGridTemplateTheme } from './Search.GridTemplate.theme';
import { getListTemplateTheme } from './Search.ListTemplate.theme';
import { getPagerTheme } from './Search.Pager.theme';
import { getSearchBoxTheme } from './Search.SearchBox.theme';
import { getTableTemplateTheme } from './Search.TableTemplate.theme';

export const SearchTheme: ThemeFile = {
  aw: {
    classes: {
      heroSearchContentWrapper:
        'flex flex-col items-center relative mb-xxs before:absolute before:content-[""] before:w-[48px] before:h-[6px] before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:bg-primary',
      heroSearchContentWrapperWithOutBar: 'flex flex-col items-center relative mb-xxs',
      headline: 'text-sm-l md:text-l font-heavy mb-s',
      searchBoxClasses: getSearchBoxTheme('aw'),
      listTemplateClasses: getListTemplateTheme('aw'),
      tableTemplateClasses: getTableTemplateTheme('aw'),
      gridTemplateClasses: getGridTemplateTheme('aw'),
      facetClasses: getFacetsTheme('aw'),
      breadcrumbClasses: getBreadcrumbTheme('aw'),
      didYouMeanClasses: {
        didYouMeanLabel: 'font-sans text-body font-regular pb-xxs',
        correctedQuery: 'font-heavy underline text-primary',
        wasAutomaticallyCorrected: 'font-sans text-body [&_span]:font-heavy',
      },
      querySummaryClasses: 'font-sans text-small font-regular',
      pagerClasses: getPagerTheme('aw'),
      triggeredBannerClasses: 'bg-light-gray p-s mb-s',
      noResultsHeadline: 'font-medium text-sm-m md:text-m mt-m my-ml md:mb-m',
      noResultsBody: '',
    },
  },
  rba: {
    classes: {
      heroSearchContentWrapper:
        'flex flex-col md:flex-row md:justify-between md:items-center relative bg-secondary text-white before:absolute before:content-[""] before:w-[40px] md:before:w-[85px] before:h-[3px] before:bottom-m before:bg-primary pt-l max-w-(--breakpoint-lg) mx-auto',
      heroSearchContentWrapperWithOutBar: 'flex flex-col items-center relative mb-xxs',
      headline: 'text-sm-m md:text-l font-medium md:mb-l sm:mb-m',
      searchBoxClasses: getSearchBoxTheme('rba'),
      listTemplateClasses: getListTemplateTheme('rba'),
      tableTemplateClasses: getTableTemplateTheme('rba'),
      gridTemplateClasses: getGridTemplateTheme('rba'),
      facetClasses: getFacetsTheme('rba'),
      breadcrumbClasses: getBreadcrumbTheme('rba'),
      didYouMeanClasses: {
        didYouMeanLabel: 'font-serif text-body font-regular pb-xxs',
        correctedQuery: 'font-semi-bold underline text-darkprimary',
        wasAutomaticallyCorrected: 'font-sans text-body [&_span]:font-medium',
      },
      querySummaryClasses: 'text-body font-regular',
      pagerClasses: getPagerTheme('rba'),
      triggeredBannerClasses: 'bg-light-gray p-s mb-s',
      noResultsHeadline: 'font-medium text-sm-s md:text-m my-s mt-xxxs md:mt-s',
      noResultsBody: 'text-black! mb-s',
    },
  },
};
