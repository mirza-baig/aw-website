import { Result, ResultListState } from '@coveo/headless';
import classNames from 'classnames';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { sliderSettings } from 'helpers/SliderWrapper/SliderWrapper';
import { ReactElement } from 'react';

import { GetLayoutClasses } from '../../XupCardCollection/helpers/XupCardCollection.helper';

type GridDisplayProps = {
  renderXupCard: (result: Result, index: number) => ReactElement;
  maxCardsPerRow?: number;
  resultListState: ResultListState | undefined;
};

type SliderDisplayProps = {
  sliderSettings: sliderSettings;
  renderXupCard: (result: Result, index: number) => ReactElement;
  resultListState: ResultListState | undefined;
};

export const GridDisplay = ({
  maxCardsPerRow,
  renderXupCard,
  resultListState,
}: GridDisplayProps) => {
  return (
    <>
      {resultListState?.results?.map((result, index) => (
        <div
          key={index}
          className={classNames('col-span-12', maxCardsPerRow && GetLayoutClasses(maxCardsPerRow))}
        >
          {renderXupCard(result, index)}
        </div>
      ))}
    </>
  );
};

export const SliderDisplay = ({
  sliderSettings,
  renderXupCard,
  resultListState,
}: SliderDisplayProps) => {
  return (
    <div className="col-span-12 [&_.slick-track]:mx-0!">
      {resultListState?.results && (
        <SliderWrapper sliderSettings={sliderSettings}>
          {resultListState?.results?.map((result, index) => (
            <div key={index} className={classNames('block! h-full md:px-xxs')}>
              {renderXupCard(result, index)}
            </div>
          ))}
        </SliderWrapper>
      )}
    </div>
  );
};
