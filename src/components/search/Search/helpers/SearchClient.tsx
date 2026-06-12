'use client';

// @ts-nocheck: Disable TypeScript checks to suppress unknown type errors
import {
  BreadcrumbManager as HeadlessBreadcrumbManager,
  buildBreadcrumbManager,
  buildDidYouMean,
  buildFacet,
  buildFacetConditionsManager,
  buildNotifyTrigger,
  buildPager,
  buildQuerySummary,
  buildResultList,
  buildResultsPerPage,
  buildResultTemplatesManager,
  buildSearchBox,
  buildSearchStatus,
  buildSort,
  DidYouMean as HeadlessDidYouMean,
  Facet as HeadlessFacet,
  loadAdvancedSearchQueryActions,
  loadFacetOptionsActions,
  loadSearchConfigurationActions,
  NotifyTrigger as HeadlessNotifyTrigger,
  Pager as HeadlessPager,
  QuerySummary as HeadlessQuerySummary,
  Result,
  ResultList as HeadlessResultList,
  ResultListState,
  ResultTemplatesManager,
  SearchBox as HeadlessSearchBox,
  SearchEngine,
  SearchStatus as HeadlessSearchStatus,
  Unsubscribe,
} from '@coveo/headless';
import { Field, Page } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import { CoveoTabs } from 'helpers/Coveo/CoveoTabs/CoveoTabs';
import { DidYouMean } from 'helpers/Coveo/DidYouMean/DidYouMean';
import { FacetGroup } from 'helpers/Coveo/Facet/FacetGroup';
import { GlobalVideoGallery } from 'helpers/Coveo/GlobalVideoGallery/GlobalVideoGallery';
import { Pager } from 'helpers/Coveo/Pager/Pager';
import { QuerySummary } from 'helpers/Coveo/QuerySummary/QuerySummary';
import { ResultList } from 'helpers/Coveo/ResultList/ResultList';
import { SearchBox } from 'helpers/Coveo/SearchBox/SearchBox';
import { TriggeredBanner } from 'helpers/Coveo/TriggeredBanner/TriggeredBanner';
import { bindUrlManager } from 'helpers/Coveo/UrlManager/UrlManager';
import Headline from 'helpers/Headline/Headline';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { Spinner } from 'helpers/Spinner';
import { defaultVideoFieldsToInclude } from 'helpers/VideoGalleryHelpers/VideoItemUtils.Helper';
import { useTheme } from 'lib/context/ThemeContext';
import {
  buildEngineAsync,
  CoveoEngineContext,
  getFieldsToInclude,
  getInitialCriterion,
  LayoutType,
  mapFacetOptions,
} from 'lib/coveo';
import { replaceTokenInCoveoExpression } from 'lib/coveo/utils';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint } from 'lib/utils/get-screen-type';
import { toShortId } from 'lib/utils/string-utils/to-short-id';
import { JSX, useEffect, useRef, useState } from 'react';

import GridTemplate from './Search.GridTemplate.helper';
import ListTemplate from './Search.ListTemplate.helper';
import TableTemplate from './Search.TableTemplate.helper';
import { SearchTheme } from './Search.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

// TODO: Clean this up
const organizationId = config.coveo.organizationId;
const farmName = config.coveo.farmName;

type GridStyle = 'photo-gallery' | 'result-with-image' | 'result-without-image';

type SearchProps = Sitecore.Components.Search.Search.Search & {
  fields: {
    searchBox: Sitecore.Elements.Search.SearchBox;
    pager: Sitecore.Elements.Search.Pager;
    facets: Sitecore.Elements.Search.Facet[];
    searchParameters: Sitecore.Elements.Search.SearchParameters;
    tabs: Sitecore.Elements.Search.Tab[];
    listResultItems: Sitecore.Elements.Search.ListResultItem[];
    gridResultItems: Sitecore.Elements.Search.GridResultItem[];
    columns: Sitecore.Elements.Search.ResultColumn[];
    didYouMean: Sitecore.Elements.Search.DidYouMean;
  };
  boostingExpression: string;
  filterExpression: string;
  page: Page;
  minQueryLength: number;
  minQuerySuggestionsLength: number;
};

function GetVisiblePagerNumbers(fields: Sitecore.Elements.Search.Pager['fields']): number {
  return window.outerWidth < getBreakpoint('md')
    ? (fields?.numberOfPagesMobile.value ?? 3)
    : (fields?.numberOfPages.value ?? 5);
}

export function SearchClient(props: SearchProps) {
  const { themeData } = useTheme(SearchTheme);
  const { fields } = props;
  const resultTemplatesManager =
    useRef<ResultTemplatesManager<(result: Result) => JSX.Element>>(null);
  const breadcrumbManager = useRef<HeadlessBreadcrumbManager>(null);
  const searchBoxController = useRef<HeadlessSearchBox>(null);
  const resultListController = useRef<HeadlessResultList>(null);
  const notifyTriggerController = useRef<HeadlessNotifyTrigger>(null);
  const querySummaryController = useRef<HeadlessQuerySummary>(null);
  const searchStatusController = useRef<HeadlessSearchStatus>(null);
  const didYouMeanController = useRef<HeadlessDidYouMean>(null);
  const pagerController = useRef<HeadlessPager>(null);
  const facetControllers = useRef<Record<string, { facet: HeadlessFacet }>>(null);

  const [resultListState, setResultListState] = useState<ResultListState | undefined>(
    resultListController.current?.state
  );

  const resultLayout = getEnum<LayoutType>(fields?.resultLayout);

  const getLayoutClasses = () => {
    switch (resultLayout) {
      case 'list':
        return themeData.classes.listTemplateClasses;
      case 'table':
        return themeData.classes.tableTemplateClasses;
      case 'grid':
        return themeData.classes.gridTemplateClasses;
      default:
        return themeData.classes.listTemplateClasses;
    }
  };
  const customClass = getEnum(props?.fields?.cta1Style);
  let classes;
  if (customClass === 'link-right-icon') {
    classes = { cta1Classes: 'justify-around pr-12' };
  } else {
    classes = '';
  }
  const isFacetsAvailable = fields?.facets.length > 0;

  const subscribeToStateChangesAndReturnCleanup = (
    unsubscribers: Array<Unsubscribe | undefined>
  ) => {
    unsubscribers?.push(
      resultListController.current?.subscribe(() =>
        setResultListState(resultListController.current?.state)
      )
    );
  };

  const [engine, setEngine] = useState<SearchEngine>();

  const PAGE_ID = toShortId(props.page.layout.sitecore.route?.itemId);

  useEffect(() => {
    const allunsubscribers: { (): void }[] = [];

    (async () => {
      const _engine = await buildEngineAsync(organizationId);

      if (!_engine) {
        return;
      }

      breadcrumbManager.current = buildBreadcrumbManager(_engine);
      searchBoxController.current = buildSearchBox(_engine, {
        options: {
          clearFilters: false,
          numberOfSuggestions: fields?.searchBox?.fields.showSuggestions.value
            ? (fields.searchBox?.fields.numberOfSuggestions.value ?? 5)
            : 0,
          highlightOptions: {
            exactMatchDelimiters: {
              open: '<strong class="text-black font-demi">',
              close: '</strong>',
            },
          },
        },
      });
      buildResultsPerPage(_engine, {
        initialState: {
          numberOfResults: fields?.searchParameters?.fields.numberOfResultsPerPage.value ?? 15,
        },
      });

      resultListController.current = buildResultList(_engine, {
        options:
          resultLayout === 'video'
            ? {
                fieldsToInclude: [
                  ...getFieldsToInclude(
                    props.fields
                      .videoResultItems as unknown as Sitecore.Elements.Search.VideoResultItem[],
                    'video'
                  ),
                  'sc_templateid',
                  ...defaultVideoFieldsToInclude,
                ],
              }
            : {},
      });
      notifyTriggerController.current = buildNotifyTrigger(_engine);
      querySummaryController.current = buildQuerySummary(_engine);
      searchStatusController.current = buildSearchStatus(_engine);
      didYouMeanController.current = buildDidYouMean(_engine);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      fields?.pager &&
        (pagerController.current = buildPager(_engine, {
          options: { numberOfPages: GetVisiblePagerNumbers(fields.pager.fields) },
        }));

      buildSort(_engine, {
        initialState: {
          criterion: getInitialCriterion(
            fields?.searchParameters?.fields?.sortType,
            fields?.searchParameters?.fields?.sortDirection,
            fields?.searchParameters?.fields?.sortField
          ),
        },
      });
      facetControllers.current = {};
      props.fields?.facets.forEach((facet: Sitecore.Elements.Search.Facet) => {
        const options = mapFacetOptions(facet);
        const controller = buildFacet(_engine, { options });
        if (facet.fields.dependsOn) {
          buildFacetConditionsManager(_engine, {
            facetId: controller.state.facetId,
            conditions: [
              {
                parentFacetId:
                  (facet.fields.dependsOn.fields.uniqueIdentifier as Field<string>)?.value || '',
                condition: (parentValues) =>
                  parentValues.some((value) => value.state === 'selected'),
              },
            ],
          });
        }
        facetControllers.current![controller.state.facetId] = { facet: controller };
      });

      resultTemplatesManager.current = buildResultTemplatesManager(_engine);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      resultLayout == 'list' &&
        resultTemplatesManager.current.registerTemplates({
          ...ListTemplate(fields.listResultItems, getLayoutClasses()),
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      resultLayout == 'table' &&
        resultTemplatesManager.current.registerTemplates({
          ...TableTemplate(fields.columns, getLayoutClasses()),
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      resultLayout == 'grid' &&
        resultTemplatesManager.current.registerTemplates({
          ...GridTemplate(
            fields.gridResultItems,
            getLayoutClasses(),
            getEnum<GridStyle>(fields.gridStyle) ?? 'photo-gallery'
          ),
        });

      const { updateSearchConfiguration } = loadSearchConfigurationActions(_engine);
      _engine.dispatch(
        updateSearchConfiguration({
          pipeline: fields?.searchParameters?.fields.queryPipeline.value,
          searchHub: fields?.searchParameters?.fields.searchHub.value,
        })
      );

      const { updateAdvancedSearchQueries } = loadAdvancedSearchQueryActions(_engine);

      const boostExp = replaceTokenInCoveoExpression(props.boostingExpression, {
        currentPage: PAGE_ID,
      });

      const filterExp = replaceTokenInCoveoExpression(props.filterExpression, {
        currentPage: PAGE_ID,
      });

      const advancedQueries = `${boostExp ?? ''}${boostExp && filterExp ? ' AND ' : ''}${
        filterExp ?? ''
      }`.trim();

      _engine.dispatch(
        updateAdvancedSearchQueries({
          cq: `(@aw_xmc_excludefromsearch=="false") AND (@aw_xmc_sitelanguage==${
            props.page.locale ?? 'en'
          }) AND (@source==AW-Website-${farmName}) `,
          aq: advancedQueries ?? '',
        })
      );

      const { updateFacetOptions } = loadFacetOptionsActions(_engine);
      _engine.dispatch(updateFacetOptions({ freezeFacetOrder: true }));

      bindUrlManager(_engine, searchStatusController.current);

      _engine.executeFirstSearch();

      subscribeToStateChangesAndReturnCleanup(allunsubscribers);

      setEngine(_engine);
    })();

    return function cleanup() {
      allunsubscribers.forEach((unsub) => unsub?.());
    };
    // We can ignore the react-hooks/exhaustive-deps warning for this useEffect as it only uses the props which are coming from layout service.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderNoResults = () => {
    const noResultsHeadlineText = `${fields.searchParameters?.fields.noResultsHeadline.value} ${
      engine?.state.query?.q && `for "${engine?.state.query?.q}"`
    }`;

    return (
      <>
        <Headline
          classes={themeData.classes.noResultsHeadline ?? ''}
          useTag="h2"
          fields={{
            headlineText: { value: noResultsHeadlineText },
          }}
        />
        <BodyCopy
          classes={themeData.classes.noResultsBody}
          fields={{ body: fields.searchParameters?.fields.noResultsBody }}
        />
        <TriggeredBanner
          triggeredBannerClasses={themeData.classes.triggeredBannerClasses}
          controller={notifyTriggerController.current!}
        />
      </>
    );
  };

  if (!engine) {
    return <Headline classes={themeData.classes.headline} {...props} />;
  }
  if (!fields || !engine) {
    return null;
  }

  const heroSearchContentWrapperClass = () => {
    if (fields.headlineText.value == '' && fields.cta1Link.value.href == '') {
      return themeData.classes.heroSearchContentWrapperWithOutBar;
    } else {
      return themeData.classes.heroSearchContentWrapper;
    }
  };

  return (
    <Component variant="lg" padding="px-m lg:px-0" dataComponent="search/searchhero" {...props}>
      {engine && (
        <CoveoEngineContext.Provider value={engine}>
          <div className="col-span-12">
            <div>
              <div className={heroSearchContentWrapperClass()}>
                <Headline classes={themeData.classes.headline} {...props} />
                <SingleButton {...props} classes={classes} />
              </div>
            </div>
          </div>
          {fields.searchBox && (
            <div className="col-span-12">
              <SearchBox
                controller={searchBoxController.current!}
                searchBoxClasses={themeData.classes.searchBoxClasses}
                placeholderText={fields.searchBox.fields.placeholderText}
                minQueryLength={fields.searchBox.fields.minQueryLength.value}
                minQuerySuggestionsLength={fields.searchBox.fields.minQuerySuggestionsLength.value}
              />
            </div>
          )}
          {!resultListState!.firstSearchExecuted && (
            <div className="col-span-12">
              <div className="relative py-xxl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Spinner size={56} />
                </div>
              </div>
            </div>
          )}
          {fields?.tabs?.length > 0 && <CoveoTabs tabs={fields.tabs} />}
          {resultListState?.hasResults ? (
            <>
              {isFacetsAvailable && (
                <div className={classNames('relative col-span-12 hidden ml:col-span-3 ml:block')}>
                  <FacetGroup
                    {...props}
                    themeData={themeData}
                    querySummaryController={querySummaryController.current!}
                    breadcrumbManager={breadcrumbManager.current!}
                    facetControllers={facetControllers.current!}
                  />
                </div>
              )}
              <div
                className={classNames(
                  'relative col-span-12',
                  isFacetsAvailable && 'ml:col-span-9',
                  resultListState.isLoading &&
                    'before:absolute before:top-0 before:left-0 before:h-full before:w-full before:bg-white before:opacity-50 before:content-[""]'
                )}
              >
                <DidYouMean
                  controller={didYouMeanController.current!}
                  didYouMeanClasses={themeData.classes.didYouMeanClasses}
                  noResultsText={fields?.didYouMean?.fields?.noResultsText}
                  autoCorrectionText={fields?.didYouMean?.fields?.autoCorrectionText}
                  didYouMeanText={fields?.didYouMean?.fields?.didYouMeanText}
                />
                <div
                  className={classNames(
                    'mb-xxs flex items-end justify-between',
                    resultLayout === 'video' && 'ml:!mb-0'
                  )}
                >
                  <QuerySummary
                    controller={querySummaryController.current!}
                    querySummaryClasses={themeData.classes.querySummaryClasses}
                  />
                  {isFacetsAvailable && (
                    <div className="ml:hidden">
                      <FacetGroup
                        {...props}
                        themeData={themeData}
                        querySummaryController={querySummaryController.current!}
                        breadcrumbManager={breadcrumbManager.current!}
                        facetControllers={facetControllers.current!}
                      />
                    </div>
                  )}
                </div>
                <TriggeredBanner
                  triggeredBannerClasses={themeData.classes.triggeredBannerClasses}
                  controller={notifyTriggerController.current!}
                />
                {resultLayout === 'video' ? (
                  <GlobalVideoGallery
                    controller={resultListController.current!}
                    pagerController={pagerController.current!}
                    videoResultItems={
                      props.fields
                        .videoResultItems as unknown as Sitecore.Elements.Search.VideoResultItem[]
                    }
                    hasFacets={isFacetsAvailable}
                  />
                ) : (
                  <ResultList
                    controller={resultListController.current!}
                    resultTemplatesManager={resultTemplatesManager.current!}
                    display={resultLayout}
                    columnTitles={fields.columns?.map(
                      (column: Sitecore.Elements.Search.ResultColumn) =>
                        column.fields?.displayName.value
                    )}
                    columnClasses={themeData.classes.tableTemplateClasses?.itemTitle}
                    hasFacets={isFacetsAvailable}
                    gridLightbox={
                      resultLayout === 'grid' &&
                      getEnum<GridStyle>(fields.gridStyle) === 'photo-gallery'
                    }
                    pagerController={pagerController.current!}
                  />
                )}
                {resultLayout !== 'video' && pagerController && (
                  <Pager
                    pagerClasses={themeData.classes.pagerClasses}
                    controller={pagerController.current!}
                  />
                )}
              </div>
            </>
          ) : (
            !resultListState!.isLoading && <div className="col-span-12">{renderNoResults()}</div>
          )}
        </CoveoEngineContext.Provider>
      )}
    </Component>
  );
}
