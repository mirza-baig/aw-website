import {
  buildSearchParameterManager,
  buildSearchStatus,
  SearchEngine,
  SearchParameters,
  SearchStatus,
} from '@coveo/headless';

/**
 * Search parameters, defined in the url's hash, should not be restored until all components are registered.
 *
 * Additionally, a search should not be executed until search parameters are restored.
 *
 * @param engine - A headless search engine instance.
 * @returns An unsubscribe function to remove attached event listeners.
 */

export function deserialize(queryString: string): SearchParameters {
  const parameters: SearchParameters = { f: {} };

  const params = queryString.substring(1).split('&');

  params.forEach((param) => {
    const [key, value] = param.split('=');
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    if (decodedKey === 'q') {
      parameters.q = decodedValue;
    } else if (decodedKey.startsWith('f:')) {
      const facetName = decodedKey.substring(2);
      const facetValues = decodedValue.substring(1, decodedValue.length - 1).split(',');
      if (parameters.f) {
        parameters.f[facetName] = facetValues;
      }
    }
  });

  return parameters;
}

export function serialize(parameters: SearchParameters): string {
  let queryParam = parameters.q ? `q=${encodeURIComponent(parameters.q)}` : '';

  const facetParams = Object.entries(parameters)
    .reduce((acc, [key, value]) => {
      if (key.startsWith('f')) {
        Object.keys(value).forEach((facetId) => {
          const facetName = facetId;
          const facetValues = value[facetId]
            .map((facetValue: string) => encodeURIComponent(facetValue))
            .join(',');
          (acc as Array<string>).push(`f:${facetName}=[${facetValues}]`);
        });
      }
      return acc;
    }, [])
    .join('&');

  if (facetParams && queryParam) {
    queryParam += '&';
  }

  return queryParam + facetParams;
}

export function bindUrlManager(engine: SearchEngine, searchStatusController?: SearchStatus) {
  const _statusController = searchStatusController ?? buildSearchStatus(engine);

  const fragment = () => window.location.hash;
  const parameters = deserialize(fragment());

  const searchParameterManager = buildSearchParameterManager(engine, {
    initialState: { parameters },
  });
  const onHashChange = () => {
    const parameters = deserialize(fragment());
    const updatedParameters = {
      cq: searchParameterManager.state.parameters.cq,
      aq: searchParameterManager.state.parameters.aq,
      ...parameters,
    };
    searchParameterManager.synchronize(updatedParameters);
  };

  window.addEventListener('hashchange', onHashChange);
  const unsubscribeManager = searchParameterManager.subscribe(() => {
    const hash = `#${serialize(searchParameterManager.state.parameters)}`;

    if (!_statusController.state.firstSearchExecuted) {
      // The purpose of using `replaceState()` instead of `pushState()` in this case is to ensure that the URL reflects the current state of the search page on the first interface load.

      // If `pushState()` were used instead, users could possibly enter in a history loop, having to click the back button multiple times without being able to return to a previous page.
      // This situation happens with components such as the Tab component, which adds a new state to the browser history stack.

      // `replaceState` instead replaces the current state of the browser history with a new state, effectively updating the URL without adding a new entry to the history stack.
      // See https://docs.coveo.com/en/headless/latest/usage/synchronize-search-parameters-with-the-url/
      history.replaceState(history.state, document.title, hash);
      return;
    }

    history.pushState(history.state, document.title, hash);
  });

  return () => {
    window.removeEventListener('hashchange', onHashChange);
    unsubscribeManager();
  };
}
