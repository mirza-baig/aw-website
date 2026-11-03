'use client';

import {
  BreadcrumbManager as HeadlessBreadcrumbManager,
  buildBreadcrumbManager,
  buildFacet,
  buildFacetConditionsManager,
  buildQuerySummary,
  buildResultList,
  buildResultsPerPage,
  buildResultTemplatesManager,
  buildSearchStatus,
  buildSort,
  Facet as HeadlessFacet,
  loadAdvancedSearchQueryActions,
  loadFacetOptionsActions,
  loadSearchConfigurationActions,
  QuerySummary as HeadlessQuerySummary,
  Result,
  ResultList as HeadlessResultList,
  ResultListState,
  ResultTemplatesManager,
  SearchEngine,
  SearchStatus as HeadlessSearchStatus,
  Unsubscribe,
} from '@coveo/headless';
import { Field, useSitecore } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import { FacetGroup } from 'helpers/Coveo/Facet/FacetGroup';
import { ResultList } from 'helpers/Coveo/ResultList/ResultList';
import { bindUrlManager } from 'helpers/Coveo/UrlManager/UrlManager';
import Headline from 'helpers/Headline/Headline';
import { Spinner } from 'helpers/Spinner';
import { Subheadline } from 'helpers/Subheadline';
import { useTheme } from 'lib/context/ThemeContext';
import {
  buildEngineAsync,
  CoveoEngineContext,
  getInitialCriterion,
  mapFacetOptions,
} from 'lib/coveo';
import { replaceTokenInCoveoExpression } from 'lib/coveo/utils';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { toShortId } from 'lib/utils/string-utils/to-short-id';
import { JSX, useEffect, useRef, useState } from 'react';

import { DimensionsFacet, ProductTypeFacet } from './helpers/SizingTool.helper';
import SizingToolTemplate from './helpers/SizingTool.ResultTemplate.helper';
import { SizingToolTheme } from './helpers/SizingTool.theme';
import { SizingToolProps } from './helpers/SizingTool.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const organizationId = config.coveo.organizationId;
const farmName = config.coveo.farmName;

function SizingTool_Default(props: SizingToolProps): JSX.Element | null {
  const { fields } = props;
  const { page } = useSitecore();
  const { themeData } = useTheme(SizingToolTheme);

  const resultTemplatesManager =
    useRef<ResultTemplatesManager<(result: Result) => JSX.Element>>(null);
  const resultListController = useRef<HeadlessResultList>(null);
  const breadcrumbManager = useRef<HeadlessBreadcrumbManager>(null);
  const querySummaryController = useRef<HeadlessQuerySummary>(null);
  const searchStatusController = useRef<HeadlessSearchStatus>(null);
  const facetControllers = useRef<Record<string, { facet: HeadlessFacet }>>(null);

  const [resultListState, setResultListState] = useState<ResultListState | undefined>(
    resultListController.current?.state
  );

  const [isProductTypeSelected, setIsProductTypeSelected] = useState(false);
  const [isDimensionsSelected, setIsDimensionsSelected] = useState(false);

  const isFacetsAvailable = props.fields?.facets?.length && props.fields.facets.length > 0;

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

  const PAGE_ID = toShortId(page.layout.sitecore.route?.itemId);

  useEffect(() => {
    const allunsubscribers: { (): void }[] = [];

    (async () => {
      const _engine = await buildEngineAsync(organizationId);

      if (!_engine) {
        return;
      }

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
            page.layout.sitecore.context.language ?? 'en'
          }) AND (@source==AW-Website-${farmName}) `,
          aq: advancedQueries ?? '',
        })
      );

      resultTemplatesManager.current = buildResultTemplatesManager(_engine);
      breadcrumbManager.current = buildBreadcrumbManager(_engine);
      buildResultsPerPage(_engine, {
        initialState: {
          numberOfResults: fields?.searchParameters?.fields?.numberOfResultsPerPage?.value ?? 15,
        },
      });
      resultListController.current = buildResultList(_engine);
      searchStatusController.current = buildSearchStatus(_engine);
      buildSort(_engine, {
        initialState: {
          criterion: getInitialCriterion(
            fields?.searchParameters?.fields?.sortType,
            fields?.searchParameters?.fields?.sortDirection,
            fields?.searchParameters?.fields?.sortField
          ),
        },
      });

      // query summary is needed for facets mobile version (showing filtered results count in cta)
      querySummaryController.current = buildQuerySummary(_engine);

      //   Normal Facets
      facetControllers.current = {};
      props.fields?.facets.forEach((facet: Sitecore.Elements.Search.Facet) => {
        const options = mapFacetOptions(facet);
        const controller = buildFacet(_engine, { options });
        if (facet.fields.dependsOn) {
          //const facetConditionsManager =
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

      //  Product Type Facets ( for Door / Window values)
      facetControllers.current['productTypeFacet'] = {
        facet:
          props.fields?.productTypeFacet &&
          buildFacet(_engine, {
            options: mapFacetOptions(props.fields?.productTypeFacet),
          }),
      };

      //  Product Dimension Facets ( for Door / Window values)
      facetControllers.current['productDimensionsFacet'] = {
        facet:
          props.fields?.productDimensionsFacet &&
          buildFacet(_engine, {
            options: mapFacetOptions(props.fields?.productDimensionsFacet),
          }),
      };

      resultTemplatesManager.current.registerTemplates({
        ...SizingToolTemplate(props),
      });

      const { updateSearchConfiguration } = loadSearchConfigurationActions(_engine);
      _engine.dispatch(
        updateSearchConfiguration({
          pipeline: fields?.searchParameters?.fields.queryPipeline.value,
          searchHub: fields?.searchParameters?.fields.searchHub.value,
        })
      );

      const { updateFacetOptions } = loadFacetOptionsActions(_engine);
      _engine.dispatch(updateFacetOptions({ freezeFacetOrder: true }));

      bindUrlManager(_engine);

      _engine.executeFirstSearch();

      subscribeToStateChangesAndReturnCleanup(allunsubscribers);

      setEngine(_engine);
    })();

    return function cleanup() {
      allunsubscribers.forEach((unsub) => unsub?.());
    };

    // Suggested deps "fields" are coming directly from layout service. We can ignore react-hooks/exhaustive-deps warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderNoResults = () => {
    const noResultsHeadlineText = `${fields.searchParameters.fields.noResultsHeadline.value} ${
      engine?.state.query?.q && `for "${engine?.state.query?.q}"`
    }`;

    if (resultListState?.hasResults) {
      return <></>;
    }

    return (
      <>
        <Headline
          classes=""
          useTag="h2"
          fields={{
            headlineText: { value: noResultsHeadlineText },
          }}
        />
        <BodyCopy
          classes=""
          fields={{ body: fields?.searchParameters.fields.noResultsBody ?? { value: '' } }}
        />
      </>
    );
  };

  if (!engine) {
    return null;
  }

  return (
    <Component variant="lg" gap="gap-x-s md:gap-x-s" dataComponent="tool/sizingtool" {...props}>
      <CoveoEngineContext.Provider value={engine}>
        {!resultListState?.firstSearchExecuted ? (
          <div className="col-span-12">
            <div className="relative py-xxl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Spinner size={56} />
              </div>
            </div>
          </div>
        ) : (
          <>
            {facetControllers.current && (
              <>
                <ProductTypeFacet
                  controller={facetControllers.current.productTypeFacet.facet}
                  setIsProductTypeSelected={setIsProductTypeSelected}
                  {...props}
                />

                <DimensionsFacet
                  isProductTypeSelected={isProductTypeSelected}
                  controller={facetControllers.current.productDimensionsFacet.facet}
                  setIsDimensionsSelected={setIsDimensionsSelected}
                  {...props}
                />
              </>
            )}
            {isProductTypeSelected && isDimensionsSelected && (
              <>
                {isFacetsAvailable && (
                  <div className="col-span-12 mt-[6px] hidden ml:col-span-3 ml:block">
                    <FacetGroup
                      {...props}
                      themeData={themeData}
                      querySummaryController={querySummaryController.current}
                      breadcrumbManager={breadcrumbManager.current}
                      facetControllers={facetControllers.current}
                    />
                  </div>
                )}
                <div className={classNames('col-span-12', isFacetsAvailable && 'ml:col-span-9')}>
                  <div className="flex items-start  justify-between">
                    <Subheadline
                      classes="font-sans font-heavy text-s mb-m ml:mb-xxs"
                      useTag="div"
                      fields={{
                        subheadlineText: props.fields?.resultsLabel ?? { value: '' },
                      }}
                    />
                    {isFacetsAvailable && (
                      <div className="ml:hidden">
                        <FacetGroup
                          {...props}
                          themeData={themeData}
                          querySummaryController={querySummaryController.current}
                          breadcrumbManager={breadcrumbManager.current}
                          facetControllers={facetControllers.current}
                        />
                      </div>
                    )}
                  </div>

                  {renderNoResults()}

                  {resultListController.current && resultTemplatesManager.current && (
                    <ul
                      className={classNames(
                        'relative grid gap-s ml:grid-cols-12 ml:gap-s',
                        resultListState.isLoading &&
                          'before:absolute before:top-0 before:left-0 before:h-full before:w-full before:bg-white before:opacity-50 before:content-[""]'
                      )}
                    >
                      <ResultList
                        display={'raw'}
                        gridLightbox={false}
                        hasFacets={true}
                        controller={resultListController.current}
                        resultTemplatesManager={resultTemplatesManager.current}
                      />
                    </ul>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CoveoEngineContext.Provider>
    </Component>
  );
}

export const Default = withDatasourceCheck(SizingTool_Default);
