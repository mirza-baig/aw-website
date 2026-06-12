import { Facet as HeadlessFacet } from '@coveo/headless';
import { Field } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Headline from 'helpers/Headline/Headline';
import { Spinner } from 'helpers/Spinner';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { FunctionComponent, useEffect, useState } from 'react';

import { FacetSearch } from './FacetSearch';
interface FacetProps {
  controller: HeadlessFacet;
  facetLabel: Field<string>;
  showMoreLabel: Field<string>;
  showLessLabel: Field<string>;
  searchLabel: Field<string>;
  noFacetResultsBody: Field<string>;
  facetClasses?: {
    // facetClasses object can also contain nested level of classes objects or strings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [property: string]: any;
  };
}

export const Facet: FunctionComponent<FacetProps> = (props) => {
  const { controller, facetClasses } = props;
  const [state, setState] = useState(controller.state);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentUpdatingFacet, setCurrentUpdatingFacet] = useState<string>('');
  const { themeName } = useTheme();

  useEffect(() => {
    if (!state.isLoading && currentUpdatingFacet) {
      setCurrentUpdatingFacet('');
    }
    // Adding "currentUpdatingFacet" as a dependency in this useEffect may cause the infinite rendering issue.
    // We can ignore react-hooks/exhaustive-deps warning for this useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLoading]);

  useEffect(() => controller.subscribe(() => setState(controller?.state)), [controller]);

  if (!state.values.length) {
    return <></>;
  }

  return (
    <div className={facetClasses?.facetWrapper}>
      <div className={facetClasses?.categoryLabelWrapper.wrapper}>
        <div className="flex h-[18px] grow items-center">
          <Headline
            classes={facetClasses?.categoryLabelWrapper.categoryLabel}
            useTag="h3"
            fields={{
              headlineText: props.facetLabel,
            }}
          />
          {state.isLoading && currentUpdatingFacet === state.facetId && (
            <div className="ml-xxs">
              <Spinner size={12} />
            </div>
          )}
        </div>
        {state.hasActiveValues && (
          <button
            onClick={() => {
              setCurrentUpdatingFacet(state.facetId);
              controller.deselectAll();
            }}
            className={facetClasses?.categoryLabelWrapper.clearIcon}
            title="btn-clear-facet"
          >
            <SvgIcon icon="close" size="lg" />
          </button>
        )}
        <button onClick={() => setIsExpanded(!isExpanded)} title="btn-facet-toggle">
          <SvgIcon
            icon="caret"
            className={classNames(facetClasses?.categoryLabelWrapper.caretIcon, {
              'rotate-180': isExpanded,
            })}
          />
        </button>
      </div>
      {isExpanded && (
        <div>
          <ul>
            {state.values.map((value) => (
              <li key={value.value} className={facetClasses?.listItem.listItemWrapper}>
                <input
                  type="checkbox"
                  id={value.value}
                  className={classNames(
                    facetClasses?.listItem.checkboxInput,
                    state.isLoading &&
                      currentUpdatingFacet !== state.facetId &&
                      !controller.isValueSelected(value)
                      ? 'border-gray!'
                      : ''
                  )}
                  checked={controller.isValueSelected(value)}
                  onChange={() => {
                    setCurrentUpdatingFacet(state.facetId);
                    controller.toggleSelect(value);
                  }}
                  disabled={state.isLoading}
                />
                <label
                  htmlFor={value.value}
                  className={classNames(
                    facetClasses?.listItem.checkboxLabel,
                    themeName == 'rba' && !controller.isValueSelected(value)
                      ? 'text-dark-gray'
                      : 'text-black',
                    state.isLoading &&
                      currentUpdatingFacet !== state.facetId &&
                      !controller.isValueSelected(value)
                      ? 'text-gray!'
                      : ''
                  )}
                >
                  {value.value} ({value.numberOfResults})
                </label>
              </li>
            ))}
          </ul>

          {state.canShowMoreValues && (
            <FacetSearch
              controller={controller.facetSearch}
              facetLoading={state.isLoading}
              facetId={state.facetId}
              currentUpdatingFacet={currentUpdatingFacet}
              facetSearchState={state.facetSearch}
              facetSearchClasses={facetClasses?.facetSearch}
              searchLabel={props.searchLabel}
              noFacetResultsBody={props.noFacetResultsBody}
            />
          )}

          {state.canShowMoreValues && (
            <button className={facetClasses?.showMore} onClick={() => controller.showMoreValues()}>
              {props.showMoreLabel?.value}
            </button>
          )}

          {state.canShowLessValues && !state.canShowMoreValues && (
            <button className={facetClasses?.showMore} onClick={() => controller.showLessValues()}>
              {props.showLessLabel?.value}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
