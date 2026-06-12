'use client';
import {
  buildInstantResults,
  buildStandaloneSearchBox,
  InstantResults as HeadlessInstantResults,
  loadAdvancedSearchQueryActions,
  loadSearchConfigurationActions,
  SearchEngine,
  StandaloneSearchBox as HeadlessStandaloneSearchBox,
  Unsubscribe,
} from '@coveo/headless';
import { Field, LinkField, useSitecore } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import { useTheme } from 'lib/context/ThemeContext';
import { buildEngine } from 'lib/coveo';
import { replaceTokenInCoveoExpression } from 'lib/coveo/utils';
import { toShortId } from 'lib/utils/string-utils/to-short-id';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FunctionComponent, SetStateAction, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { StandaloneSearchBoxTheme } from './StandaloneSearchBox.theme';

const organizationId = config.coveo.organizationId;
const farmName = config.coveo.farmName;

export type StandaloneSearchBoxProps = {
  redirectionUrl: LinkField;
  showSuggestions: Field<boolean>;
  numberOfSuggestions: Field<number>;
  queryPipeline: Field<string>;
  searchHub: Field<string>;
  filterExpression: string;
  boostingExpression: string;
  suggestedResultsLabel: Field<string>;
  placeholderText: Field<string>;
  toggleSearchBoxVisibility?: React.Dispatch<SetStateAction<boolean>>;
  coveoAccessToken: string;
  minQueryLength: Field<number>;
  minQuerySuggestionsLength: Field<number>;
};

export const StandaloneSearchBox: FunctionComponent<StandaloneSearchBoxProps> = (props) => {
  const { themeName, themeData } = useTheme(StandaloneSearchBoxTheme);

  const [redirectionTrigggered, setRedirectionTrigggered] = useState(false);

  const standaloneSearchBoxController = useRef<HeadlessStandaloneSearchBox | null>(null);
  const instantResultsController = useRef<HeadlessInstantResults | null>(null);
  const [standaloneSearchBoxState, setStandaloneSearchBoxState] = useState(
    standaloneSearchBoxController.current?.state
  );

  const [instantResultsState, setInstantResultsState] = useState(
    instantResultsController.current?.state
  );

  const { page } = useSitecore();
  const router = useRouter();

  const [focused, setFocused] = useState(false);

  const { redirectionUrl, suggestedResultsLabel, placeholderText, toggleSearchBoxVisibility } =
    props;

  const [engine, setEngine] = useState<SearchEngine>();

  const PAGE_ID = toShortId(page.layout.sitecore.route?.itemId);
  const rawMinLength = Number(props.minQueryLength?.value);
  const rawMinSuggestionsLength = Number(props.minQuerySuggestionsLength?.value);

  const minLength = Number.isNaN(rawMinLength) ? 5 : rawMinLength;
  const minSuggestionsLength = Number.isNaN(rawMinSuggestionsLength) ? 3 : rawMinSuggestionsLength;

  useEffect(() => {
    const allunsubscribers: Array<() => void> = [];

    const _engine = buildEngine(props.coveoAccessToken, organizationId);

    const {
      showSuggestions,
      numberOfSuggestions,
      queryPipeline,
      searchHub,
      filterExpression,
      boostingExpression,
    } = props;

    // Search box will error out if there is not a redirect url
    if (redirectionUrl?.value?.href) {
      standaloneSearchBoxController.current = buildStandaloneSearchBox(_engine, {
        options: {
          id: 'standaloneSearchBox',
          redirectionUrl: redirectionUrl?.value.href ?? '',
          numberOfSuggestions: showSuggestions?.value ? numberOfSuggestions.value : 0,
          highlightOptions: {
            exactMatchDelimiters: {
              open: '<strong class="text-black">',
              close: '</strong>',
            },
          },
        },
      });
    }

    instantResultsController.current =
      showSuggestions &&
      buildInstantResults(_engine, {
        options: {
          maxResultsPerQuery: showSuggestions.value ? numberOfSuggestions.value : 0,
        },
      });

    const { updateSearchConfiguration } = loadSearchConfigurationActions(_engine);
    _engine.dispatch(
      updateSearchConfiguration({
        pipeline: queryPipeline?.value || 'sitesearch',
        searchHub: searchHub?.value || 'search',
      })
    );

    const { updateAdvancedSearchQueries } = loadAdvancedSearchQueryActions(_engine);

    const boostingExp = replaceTokenInCoveoExpression(boostingExpression, { currentPage: PAGE_ID });

    const filterExp = replaceTokenInCoveoExpression(filterExpression, { currentPage: PAGE_ID });

    const advancedQueries = `${boostingExp || ''}${
      boostingExp && filterExp ? ' AND ' : ''
    }${filterExp || ''}`.trim();

    _engine.dispatch(
      updateAdvancedSearchQueries({
        cq: `(@aw_xmc_excludefromsearch=="false") AND (@aw_xmc_sitelanguage==${
          page.locale ?? 'en'
        }) AND (@source==AW-Website-${farmName}) `,
        aq: advancedQueries || '',
      })
    );

    subscribeToStateChangesAndReturnCleanup(allunsubscribers);

    setEngine(_engine);

    return function cleanup() {
      allunsubscribers.forEach((unsub) => unsub?.());
    };
    // Most of the suggested deps are from props.
    // However, Actual reason to ignore this react-hooks/exhaustive-deps is, Adding the suggested deps will cause engine to re initiate everytime deps changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.coveoAccessToken]);

  useEffect(() => {
    if (redirectionTrigggered) {
      const value = standaloneSearchBoxController.current?.state?.value ?? '';

      if (toggleSearchBoxVisibility) {
        toggleSearchBoxVisibility(false);
      }
      setRedirectionTrigggered(false);

      let currentPathName = window.location.pathname;
      const targetUrl = new URL(`${window.location.origin}${redirectionUrl.value.href ?? ''}`);

      if (targetUrl) {
        currentPathName = currentPathName.replace(/\/$/, '');

        // If standalone searchbox component present in same page as redirectionalUrl then we need to update only hash
        if (currentPathName === targetUrl.pathname) {
          window.location.hash = `q=${encodeURIComponent(value)}`;
        } else {
          targetUrl.hash += `q=${encodeURIComponent(value)}`;
          window.location.href = targetUrl.toString();
        }
      }
    }
    // We only need to run this useEffect if the redirectionTrigggered dependency changes.
    // Suggested deps are not required for the useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectionTrigggered]);
  const [localValue, setLocalValue] = useState('');

  const subscribeToStateChangesAndReturnCleanup = (
    unsubscribers: Array<Unsubscribe | undefined>
  ) => {
    // Subscribe to standalone search controller
    unsubscribers?.push(
      standaloneSearchBoxController.current?.subscribe(() => {
        setStandaloneSearchBoxState(standaloneSearchBoxController.current?.state);
      })
    );
    // Subscribe to instant results controller
    unsubscribers?.push(
      instantResultsController.current?.subscribe(() =>
        setInstantResultsState(instantResultsController.current?.state)
      )
    );
  };

  function isEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    return e.key === 'Enter';
  }

  if (!engine || !standaloneSearchBoxController?.current) {
    return null;
  }

  return (
    <div
      className={twMerge(
        themeData.classes?.standaloneSearchBoxContainer,
        focused &&
          standaloneSearchBoxState?.suggestions &&
          standaloneSearchBoxState.suggestions.length > 0 &&
          themeData.classes?.standaloneFocusedClasses
      )}
    >
      <div className={themeData.classes?.standaloneSearchBoxWrapper}>
        {/* Search icon */}
        <button
          type="button"
          className={themeData.classes?.searchIconWrapper}
          onClick={() => {
            const value = localValue;
            if (value.length >= minLength) {
              standaloneSearchBoxController.current?.updateText(value);
              standaloneSearchBoxController.current?.submit();
              setRedirectionTrigggered(true);
            }
          }}
          aria-label="Submit search"
        >
          {/* We need to use static svg as using dynamic-import functionality causes flickering issues as coveo updates the state of the searchbox on keydown */}
          <svg
            width={themeName === 'aw' ? '20' : '16'}
            height={themeName === 'aw' ? '20' : '16'}
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Search Icon"
          >
            <title>Search Icon</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5274 4.57599C13.7069 6.75552 13.7069 10.2892 11.5274 12.4688C9.34789 14.6483 5.81418 14.6483 3.63465 12.4688C1.45512 10.2892 1.45512 6.75552 3.63465 4.57599C5.81418 2.39646 9.34789 2.39646 11.5274 4.57599ZM13.6019 13.1305C15.8828 10.158 15.6628 5.8829 12.9416 3.16178C9.98106 0.201201 5.18101 0.201201 2.22043 3.16178C-0.740144 6.12236 -0.740144 10.9224 2.22043 13.883C4.94106 16.6036 9.21506 16.8241 12.1875 14.5445L16.7017 19.0587L18.1159 17.6445L13.6019 13.1305Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        <div className={themeData.classes?.searchBox}>
          <input
            className={themeData.classes?.searchBoxInput}
            value={localValue}
            onChange={(e) => {
              const value = e.target.value;
              setLocalValue(value);
              if (value.length >= minSuggestionsLength) {
                standaloneSearchBoxController.current?.updateText(value);
                instantResultsController.current?.updateQuery(value);
              }
            }}
            onKeyDown={(e) => {
              if (isEnterKey(e)) {
                const value = localValue ?? '';
                if (value.length >= minLength) {
                  standaloneSearchBoxController.current?.updateText(value);
                  standaloneSearchBoxController.current?.submit();
                  setRedirectionTrigggered(true);
                  setFocused(false);
                }
              }
            }}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setFocused(false);
            }}
            placeholder={placeholderText?.value}
          />
          {/* Close icon */}
          {standaloneSearchBoxState?.value && (
            <button
              type="button"
              className={themeData.classes?.closeIconWrapper}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                standaloneSearchBoxController?.current?.clear();
              }}
              aria-label="Clear search"
            >
              {/* We need to use static svg as using dynamic-import functionality causes flickering issues as coveo updates the state of the searchbox on keydown */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Close Icon"
              >
                <title>Close Icon</title>
                <path
                  d="M12 1.56941L10.7914 0.36084L6 5.15227L1.20857 0.36084L0 1.56941L4.79143 6.36084L0 11.1523L1.20857 12.3608L6 7.56941L10.7914 12.3608L12 11.1523L7.20857 6.36084L12 1.56941Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      {focused &&
        localValue.length >= minSuggestionsLength &&
        standaloneSearchBoxState?.suggestions &&
        standaloneSearchBoxState.suggestions.length > 0 && (
          <div className={themeData.classes?.omniResultsWrapper}>
            {/* Standalone search suggestions */}
            <ul className={themeData.classes?.suggestionsWrapper}>
              {standaloneSearchBoxState.suggestions?.map((suggestion) => {
                const value = suggestion.rawValue;
                return (
                  <li key={value} className={themeData.classes?.suggestionItem}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        standaloneSearchBoxController?.current?.selectSuggestion(value);
                        setRedirectionTrigggered(true);
                      }}
                      dangerouslySetInnerHTML={{ __html: suggestion.highlightedValue }}
                      className="w-full text-left"
                      tabIndex={0}
                    />
                  </li>
                );
              })}
            </ul>

            {/* Instant results suggestions */}
            {instantResultsState?.results && instantResultsState.results.length > 0 && (
              <>
                <p className={themeData.classes?.instantResultsTitle}>
                  {suggestedResultsLabel.value}
                </p>
                <ul className={themeData.classes?.instantResultsWrapper}>
                  {instantResultsState?.results?.map((result) => {
                    return (
                      <li key={result.uniqueId} className={themeData.classes?.suggestionItem}>
                        <Link
                          href={result.clickUri}
                          target={result.clickUri.split('.').pop() === 'pdf' ? '_blank' : '_self'}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (result.clickUri.split('.').pop() === 'pdf') {
                              return;
                            }
                            toggleSearchBoxVisibility?.(false);
                            router.push(result.clickUri);
                          }}
                        >
                          {result.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        )}
    </div>
  );
};
