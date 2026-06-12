import { Result, ResultList as HeadlessResultList, ResultTemplatesManager } from '@coveo/headless';
import classNames from 'classnames';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType, SliderType } from 'helpers/SliderWrapper/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { LayoutType } from 'lib/coveo';
import { FunctionComponent, JSX, useEffect, useRef, useState } from 'react';

interface ResultListProps {
  controller: HeadlessResultList;
  resultTemplatesManager: ResultTemplatesManager<(result: Result) => JSX.Element>;
  display?: LayoutType | 'raw';
  columnTitles?: string[];
  columnClasses?: string;
  gridLightbox: boolean;
  hasFacets: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagerController?: any;
}

export const ResultList: FunctionComponent<ResultListProps> = (props) => {
  const { display = 'list', controller, resultTemplatesManager } = props;
  const [state, setState] = useState(controller.state);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [showPrevPage, setShowPrevPage] = useState(false);

  const sliderRef = useRef<SliderType>(null);

  const sliderSettings = {
    initialSlide: state.results.length > 1 ? currentSlideIndex : 0,
    arrows: false,
    dots: false,
    beforeChange: (_current: number, next: number) => {
      setCurrentSlideIndex(next);
    },
  };

  const openModal = (index: number) => {
    setIsLightboxVisible(true);
    setCurrentSlideIndex(index);
  };

  useEffect(
    () =>
      controller.subscribe(() => {
        setState(controller.state);

        // Use the isLoading flag to avoid getting the wrong controller state values
        const isLoading = controller.state.isLoading;
        if (!isLoading && showPrevPage) {
          // Display the last slide of the page since we're going backwards
          // through the slides
          sliderRef.current?.slickGoTo(controller.state.results.length - 1);
          setShowPrevPage(() => false);
        }
      }),
    [controller, showPrevPage]
  );

  const renderResult = (result: Result) => {
    const template = resultTemplatesManager.selectTemplate(result);

    if (template) {
      return template(result);
    }
    return null;
  };

  const renderModalResult = (result: Result) => {
    const template = resultTemplatesManager.selectTemplate(result);

    if (!template) {
      throw new Error(`No result template provided for ${result.title}.`);
    }

    return (template as any).modalTemplate // eslint-disable-line @typescript-eslint/no-explicit-any
      ? (template as any).modalTemplate(result) // eslint-disable-line @typescript-eslint/no-explicit-any
      : template(result);
  };

  return display === 'raw' ? (
    <>{state.results.length > 0 && state.results.map((result) => renderResult(result))}</>
  ) : (
    <div>
      {/* Render columns if current layout is table. p.s. Document list has the table layout */}
      {display === 'table' && (
        <ul className="hidden ml:flex">
          {props.columnTitles?.map((title, index) => {
            return (
              <li
                key={`${title}_${index}`}
                className={classNames(index === 0 ? 'basis-4/5' : 'basis-1/5', props.columnClasses)}
              >
                {title}
              </li>
            );
          })}
        </ul>
      )}
      {display === 'grid' && (
        <>
          <div className="grid gap-s md:grid-cols-12 md:gap-s">
            {state.results.map((result, index) => {
              if (props.gridLightbox) {
                return (
                  <div
                    tabIndex={0}
                    key={result.uniqueId}
                    className={classNames(
                      'col-span-12 h-full',
                      props.hasFacets ? 'md:col-span-4' : 'md:col-span-3'
                    )}
                    onClick={() => {
                      openModal(index);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        openModal(index);
                      }
                    }}
                  >
                    {renderResult(result)}
                  </div>
                );
              } else {
                return (
                  <div
                    key={result.uniqueId}
                    className={classNames(
                      'col-span-12 h-full',
                      props.hasFacets ? 'md:col-span-4' : 'md:col-span-3'
                    )}
                  >
                    {renderResult(result)}
                  </div>
                );
              }
            })}
          </div>
          {props.gridLightbox && isLightboxVisible && (
            <ModalWrapper
              isModalOpen={isLightboxVisible}
              size="fluid"
              handleClose={() => setIsLightboxVisible(false)}
            >
              <div className="px-ml pb-ml pt-s">
                {state.results.length > 1 && (
                  <>
                    <SliderWrapper
                      sliderSettings={sliderSettings}
                      sliderRef={sliderRef as SliderRefType}
                    >
                      {state.results.map((result) => renderModalResult(result))}
                    </SliderWrapper>
                    <div className="mt-m flex items-center justify-between text-xxs md:justify-center">
                      <div
                        role="button"
                        className="ml-xxxs flex cursor-pointer items-center font-bold md:mr-xs"
                        onClick={() => {
                          if (currentSlideIndex === 0 && props.pagerController) {
                            setShowPrevPage(() => true);
                            if (props.pagerController.state.hasPreviousPage) {
                              props.pagerController.previousPage();
                            } else {
                              props.pagerController.selectPage(props.pagerController.state.maxPage);
                            }
                          } else if (sliderRef.current) {
                            sliderRef.current.slickPrev();
                          }
                        }}
                      >
                        <SvgIcon className="mr-xs" icon="arrow-left" />
                        <span>Previous</span>
                      </div>
                      <div
                        role="button"
                        className="mr-xxxs flex cursor-pointer items-center font-bold md:ml-xs"
                        onClick={() => {
                          if (
                            currentSlideIndex === state.results.length - 1 &&
                            props.pagerController
                          ) {
                            if (props.pagerController.state.hasNextPage) {
                              props.pagerController.nextPage();
                            } else {
                              props.pagerController.selectPage(1);
                            }
                            sliderRef.current?.slickGoTo(0);
                          } else if (sliderRef.current) {
                            sliderRef.current.slickNext();
                          }
                        }}
                      >
                        <span>Next</span>
                        <SvgIcon className="ml-xs" icon="arrow-right" />
                      </div>
                    </div>
                  </>
                )}
                {state.results.length == 1 && <>{renderModalResult(state.results[0])}</>}
              </div>
            </ModalWrapper>
          )}
        </>
      )}
      {(display === 'list' || display === 'table') && (
        <ul>{state.results.length > 0 && state.results.map((result) => renderResult(result))}</ul>
      )}
    </div>
  );
};
