'use client';

import {
  buildResultList,
  buildResultsPerPage,
  buildResultTemplatesManager,
  buildSort,
  loadAdvancedSearchQueryActions,
  loadSearchConfigurationActions,
  Result,
  ResultList as HeadlessResultList,
  ResultListState,
  ResultTemplatesManager,
  SearchEngine,
  Unsubscribe,
} from '@coveo/headless';
import { Page } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import PhotoItemWithDetail, {
  PhotoItemWithDetailProps,
} from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail';
import { getPhotoItemProps } from 'helpers/PhotoItemWithDetail/PhotoItemWithDetail.Utils';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { SliderRefType, SliderType, SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
import { Spinner } from 'helpers/Spinner';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import {
  buildEngineAsync,
  getInitialCriterion,
  replaceTokenInCoveoExpression,
} from 'lib/coveo/utils';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { toShortId } from 'lib/utils/string-utils/to-short-id';
import { JSX, ReactElement, useEffect, useRef, useState } from 'react';

import { XupDisplayStyle } from '../../XupCardCollection/helpers/XupCardCollection.types';
import { GridDisplay, SliderDisplay } from './DynamicXupDisplayModes.helper';
import XupCardTemplate from './XupCardCollectionDynamic.Template.helper';
import { XupCardCollectionDynamicTheme } from './XupCardCollectionDynamic.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type DynamicXupCardStyle =
  | 'photo-gallery'
  | 'result-with-image'
  | 'result-without-image'
  | 'awards';

const organizationId = config.coveo.organizationId;
const farmName = config.coveo.farmName;

type XupCardCollectionDynamicProps =
  Sitecore.Components.Listing.XupCardCollectionDynamic.XupCardCollectionDynamic & {
    fields?: {
      children: Sitecore.Components.Listing.XupCardCollectionDynamic.ResultItem[];
    };
    boostingExpression: string;
    filterExpression: string;
    page: Page;
  };

type CardAlignment = 'left' | 'center';

export function XupCardCollectionDynamicClient(props: XupCardCollectionDynamicProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  const { currentScreenWidth } = useCurrentScreenType();

  const cardStyle = getEnum<DynamicXupCardStyle>(props?.fields?.cardStyle) ?? 'photo-gallery';
  const cardAlignment = getEnum<CardAlignment>(props.fields?.alignment) ?? 'left';
  const setBackgroundColor = getEnum<ComponentBackgroundVariants>(props?.fields?.backgroundColor);
  const hideAndExcludeFromNoResult: Array<DynamicXupCardStyle> = ['awards'];

  const { themeData } = useTheme(XupCardCollectionDynamicTheme(cardAlignment));

  const { page: currentPage } = props;
  const sliderRef = useRef<SliderType | null>(null);

  const resultTemplatesManager = useRef<ResultTemplatesManager<
    (result: Result) => JSX.Element
  > | null>(null);
  const resultListController = useRef<HeadlessResultList | null>(null);

  // //#region initialise xupCoveoEngine, resultListState, registerTemplates
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

  const [engine, setEngine] = useState<SearchEngine>();

  const PAGE_ID = toShortId(currentPage.layout.sitecore.route?.itemId);

  useEffect(() => {}, [resultListState]);

  useEffect(() => {
    const allunsubscribers: (() => void)[] = [];

    (async () => {
      const _engine = await buildEngineAsync(organizationId);
      if (!_engine) {
        return;
      }

      resultTemplatesManager.current = buildResultTemplatesManager(_engine);
      buildResultsPerPage(_engine, {
        initialState: { numberOfResults: props.fields?.numberOfCards?.value ?? 12 },
      });
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
        ...XupCardTemplate(
          props.fields?.children,
          themeData.classes.gridTemplateClasses,
          cardStyle
        ),
      });

      const { updateSearchConfiguration } = loadSearchConfigurationActions(_engine);
      _engine.dispatch(
        updateSearchConfiguration({
          pipeline: props.fields?.queryPipeline?.value,
          searchHub: props.fields?.searchHub?.value,
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
            currentPage.layout.sitecore.route?.itemLanguage ?? 'en'
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
    // Suggested deps are coming directly from layout service. We can ignore react-hooks/exhaustive-deps warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // //#endregion

  const desktopDisplayStyle = getEnum<XupDisplayStyle>(props.fields?.desktopDisplayStyle) ?? 'grid';
  const mobileDisplayStyle = getEnum<XupDisplayStyle>(props.fields?.mobileDisplayStyle) ?? 'grid';

  const maxCardsPerRow: number = Number.parseInt(getEnum<string>(props.fields?.cardsPerRow) ?? '3');

  const XupSliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: maxCardsPerRow,
    responsive: [
      {
        breakpoint: getBreakpoint('md'),
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };

  const LightboxSliderSettings = {
    initialSlide:
      resultListState?.results?.length && resultListState?.results?.length > 1
        ? currentSlideIndex
        : 0,
    arrows: false,
    dots: false,
  };

  // Render Xup cardcollection based XupDisplayStyle
  const renderCardColection = (): ReactElement => {
    if (currentScreenWidth < getBreakpoint('md')) {
      // Renderings for mobile devices
      if (mobileDisplayStyle === 'grid') {
        return <GridDisplay renderXupCard={renderXupCard} resultListState={resultListState} />;
      } else {
        return (
          <SliderDisplay
            sliderSettings={XupSliderSettings}
            renderXupCard={renderXupCard}
            resultListState={resultListState}
          />
        );
      }
    } else {
      // Renderings for tablets and large screen devices
      if (desktopDisplayStyle === 'grid') {
        return (
          <GridDisplay
            maxCardsPerRow={maxCardsPerRow}
            renderXupCard={renderXupCard}
            resultListState={resultListState}
          />
        );
      }

      return (
        <SliderDisplay
          sliderSettings={XupSliderSettings}
          renderXupCard={renderXupCard}
          resultListState={resultListState}
        />
      );
    }
  };

  const NoResult = () => {
    if (!resultListState?.results?.length) {
      return (
        <div className="col-span-12">
          <BodyCopy
            classes={themeData.classes.bodyClass}
            fields={{ body: props.fields?.noResultsText }}
          />
        </div>
      );
    } else {
      return <></>;
    }
  };

  // use Coveo resultTemplateManager to choose and implement style of card
  const renderXupCard = (result: Result, index: number): ReactElement => {
    const template = resultTemplatesManager?.current?.selectTemplate(result);
    if (!template) {
      throw new Error(`No result template provided for ${result.title}.`);
    }

    return (
      <div
        tabIndex={0}
        onClick={() => {
          openModal(index);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            openModal(index);
          }
        }}
        className={classNames('h-full zzzz ', {
          '[&_.imageWrapper]:mb-0': cardStyle === 'photo-gallery',
        })}
      >
        {template(result)}
      </div>
    );
  };

  // handle opening the lightbox
  const openModal = (index: number) => {
    setIsLightboxVisible(true);
    setCurrentSlideIndex(index);
  };

  // renders photoGallery lightbox
  const photoGalleryLightbox = (): ReactElement | void => {
    const isModalOpen = cardStyle === 'photo-gallery' && isLightboxVisible;
    if (isModalOpen) {
      return (
        <ModalWrapper
          isModalOpen={isModalOpen}
          size="fluid"
          handleClose={() => setIsLightboxVisible(false)}
        >
          <div className="px-ml pb-ml pt-s">
            {resultListState?.results?.length && resultListState?.results.length > 1 ? (
              <>
                <SliderWrapper
                  sliderSettings={LightboxSliderSettings}
                  sliderRef={sliderRef as SliderRefType}
                >
                  {resultListState?.results?.map((result) => {
                    if (props.fields.children) {
                      const photoObject = getPhotoItemProps(
                        result,
                        true,
                        props.fields.children ?? []
                      ) as PhotoItemWithDetailProps;

                      return <PhotoItemWithDetail key={result.uniqueId} {...photoObject} />;
                    }
                    return <></>;
                  })}
                </SliderWrapper>
                <div className="mt-m flex items-center justify-between text-xxs md:justify-center">
                  <div
                    role="button"
                    className="ml-xxxs flex cursor-pointer items-center font-bold md:mr-xs"
                    onClick={() => sliderRef.current && sliderRef.current.slickPrev()}
                  >
                    <SvgIcon className="mr-xs" icon="arrow-left" />
                    <span>Previous</span>
                  </div>
                  <div
                    role="button"
                    className="mr-xxxs flex cursor-pointer items-center font-bold md:ml-xs"
                    onClick={() => {
                      sliderRef.current?.slickNext();
                    }}
                  >
                    <span>Next</span>
                    <SvgIcon className="ml-xs" icon="arrow-right" />
                  </div>
                </div>
              </>
            ) : (
              resultListState?.results?.map((result) => {
                if (props.fields.children) {
                  const photoObject = getPhotoItemProps(
                    result,
                    true,
                    props.fields.children ?? []
                  ) as PhotoItemWithDetailProps;

                  return <PhotoItemWithDetail key={result.uniqueId} {...photoObject} />;
                }
                return <></>;
              })
            )}
          </div>
        </ModalWrapper>
      );
    }
  };

  // if Afiliated card opted in for no result display, hide whole component if no results from coveo
  const hideOnNoResults =
    hideAndExcludeFromNoResult.includes(cardStyle) &&
    resultListState?.firstSearchExecuted &&
    !resultListState?.results?.length;

  if (!props?.fields || !engine || hideOnNoResults) {
    return (
      <Component
        variant="lg"
        dataComponent="listing/xupcardcollectiondynamic"
        {...props}
        sectionWrapperClasses="hidden"
      ></Component>
    );
  }

  return (
    <Component
      variant="lg"
      gap="gap-x-s gap-y-m"
      dataComponent="listing/xupcardcollectiondynamic"
      className={classNames(
        (props.fields?.body?.value !== '' || props.fields?.children?.length > 0) &&
          'grid-cols-0 grid gap-x-0 gap-y-0'
      )}
      {...props}
      sectionWrapperClasses={setBackgroundColor === 'gray' ? 'theme-gray bg-light-gray' : ''}
    >
      <div className="col-span-12">
        <Headline classes={themeData.classes.headlineClass} {...props} />
        <BodyCopy classes={themeData.classes.bodyClass} {...props} />
        <SingleButton {...props} />
      </div>

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
          <NoResult />
          {props.fields?.children?.length > 0 && renderCardColection()}
          {photoGalleryLightbox()}
        </>
      )}
    </Component>
  );
}
