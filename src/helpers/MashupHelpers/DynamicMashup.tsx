'use client';

import {
  buildResultList,
  buildResultsPerPage,
  buildResultTemplatesManager,
  buildSort,
  loadAdvancedSearchQueryActions,
  loadSearchConfigurationActions,
  Result,
  ResultList,
  ResultListState,
  ResultTemplatesManager,
  SearchEngine,
  Unsubscribe,
} from '@coveo/headless';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Headline from 'helpers/Headline/Headline';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { buildEngineAsync } from 'lib/coveo';
import { buildBoostExpression } from 'lib/coveo/build-boost-expression';
import { buildFilterExpression } from 'lib/coveo/build-filter-expression';
import { getInitialCriterion, replaceTokenInCoveoExpression } from 'lib/coveo/utils';
import { getEnum } from 'lib/utils/get-enum';
import { toShortId } from 'lib/utils/string-utils/to-short-id';
import { JSX, useEffect, useRef, useState } from 'react';

import DynamicMashupTemplate from './DynamicMashup.Template.helper';
import { MashupTheme } from './Mashup.theme';
import { MashupStyle } from './Mashup.Types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const organizationId = config.coveo.organizationId;
const farmName = config.coveo.farmName;

type PageMashupDynamicProps = ComponentProps &
  Sitecore.Components.Search.PageMashupDynamic.PageMashupDynamic & {
    fields: {
      children: Sitecore.Components.Search.PageMashupDynamic.ResultItem[];
    };
  };

const DynamicMashup = (props: PageMashupDynamicProps) => {
  const { themeData } = useTheme(MashupTheme);
  const { page } = useSitecore();

  const resultTemplatesManager =
    useRef<ResultTemplatesManager<(result: Result) => JSX.Element>>(null);
  const resultListController = useRef<ResultList>(null);

  const [resultListState, setResultListState] = useState<ResultListState | undefined>(
    resultListController.current?.state
  );
  const subscribeToStateChangesAndReturnCleanup = (
    unsubscribers: Array<Unsubscribe | undefined>
  ) => {
    unsubscribers?.push(
      resultListController.current?.subscribe(() =>
        setResultListState(resultListController.current?.state)
      )
    );
  };

  const mashupStyle = getEnum<MashupStyle>(props.fields?.mashupStyle) ?? 'images-for-all';

  const [engine, setEngine] = useState<SearchEngine>();

  const PAGE_ID = toShortId(page.layout.sitecore.route?.itemId);

  useEffect(() => {
    const allunsubscribers: Array<() => void> = [];
    (async () => {
      const _engine = await buildEngineAsync(organizationId);

      if (!_engine) {
        return;
      }

      resultTemplatesManager.current = buildResultTemplatesManager(_engine);

      resultListController.current = buildResultList(_engine);
      buildSort(_engine, {
        initialState: {
          criterion: getInitialCriterion(
            props.fields?.sortType,
            props.fields?.sortDirection,
            props.fields?.sortField
          ),
        },
      });
      resultTemplatesManager.current.registerTemplates({
        ...DynamicMashupTemplate(
          props.fields?.children,
          mashupStyle,
          props.fields?.placeholderImage
        ),
      });

      buildResultsPerPage(_engine, {
        initialState: { numberOfResults: 4 },
      });

      const { updateSearchConfiguration } = loadSearchConfigurationActions(_engine);
      _engine.dispatch(
        updateSearchConfiguration({
          pipeline: props?.fields?.queryPipeline?.value,
          searchHub: props?.fields?.searchHub?.value,
        })
      );

      const { updateAdvancedSearchQueries } = loadAdvancedSearchQueryActions(_engine);
      const filterXml = props.fields?.filterExpression?.value;
      const boostXml = props.fields?.boostingExpression?.value;
      let filterExp = (await buildFilterExpression(filterXml)) ?? '';
      let boostExp = (await buildBoostExpression(boostXml)) ?? '';
      filterExp = replaceTokenInCoveoExpression(filterExp, {
        currentPage: PAGE_ID,
      });
      boostExp = replaceTokenInCoveoExpression(boostExp, {
        currentPage: PAGE_ID,
      });

      const advancedQueries = `${boostExp || ''}${boostExp && filterExp ? ' AND ' : ''}${
        filterExp || ''
      }`.trim();
      _engine.dispatch(
        updateAdvancedSearchQueries({
          cq: `(@aw_xmc_excludefromsearch=="false") AND (@aw_xmc_sitelanguage==${
            page.locale ?? 'en'
          }) AND (@source==AW-Website-${farmName}) `,
          aq: advancedQueries ?? '',
        })
      );
      _engine.executeFirstSearch();

      subscribeToStateChangesAndReturnCleanup(allunsubscribers);
      setEngine(_engine);
    })();

    return function cleanup() {
      allunsubscribers.forEach((unsub) => unsub?.());
    };

    // ------ we can ignore react-hooks/exhaustive-deps warning for these following suggested dependencies: ------
    // "sitecoreContext.language" it is related to language;
    // "pageAffiliate?.affiliateId" and "userAffiliate?.affiliateId" are configured from affiliateId;
    // "props.fields?.filterExpression.value", "props.fields?.boostingExpression.value" are configured for "replaceTokenInCoveoExpression";
    // "featureToggles" is configured for coveo driven state;
    // "props.fields?.children", "props.fields?.placeholderImage", "props.fields?.queryPipeline.value", "props.fields?.searchHub.value", "props.fields?.sortDirection", "props.fields?.sortField", and "props.fields?.sortType" are props coming from layout, which will not change;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mashupStyle]);

  if (!props.fields) {
    return <></>;
  }

  const getTemplate = (result: Result) => {
    const template = resultTemplatesManager?.current?.selectTemplate(result);

    if (!template) {
      throw new Error(`No result template provided for ${result.title}.`);
    }
    return template;
  };

  const renderFeaturedCard = () => {
    const featuredResult = resultListState?.results[0];

    if (featuredResult) {
      const _result = { ...featuredResult, cardIndex: 0 };
      return getTemplate(featuredResult)(_result);
    }
    return <></>;
  };

  const renderRegularCards = () => {
    return resultListState?.results?.slice(1).map((result, index) => {
      const _result = { ...result, cardIndex: index + 1 };
      return getTemplate(result)(_result);
    });
  };

  if (!engine) {
    return <></>;
  }

  return (
    <div className="col-span-12 py-l">
      <div className="grid-rows-auto grid grid-cols-12 gap-s px-m md:max-w-(--breakpoint-lg) lg:mx-auto">
        <div className="col-span-12 md:col-span-6">
          <Headline {...props} classes={themeData.classes.sectionheadline} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <BodyCopy {...props} classes={themeData.classes.sectionBody} />
          <SingleButton {...props} classes={themeData.classes.sectionCta} />
        </div>
        {renderFeaturedCard()}
        {mashupStyle === 'images-for-all' ? (
          renderRegularCards()
        ) : (
          <div className="md:gap-lg col-span-12  grid grid-cols-12 gap-x-s gap-y-ml self-start border-t border-gray pt-s md:col-span-6">
            {renderRegularCards()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicMashup;
