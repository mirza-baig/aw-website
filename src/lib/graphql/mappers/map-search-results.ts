import { ItemSearchResults } from '../types/item-search-results';

// Default to returning null because undefined is not supported in JSON and this is meant to be used from getStaticProps
export function mapSearchResults<TResult = unknown, TOutput = unknown>(
  searchResults: ItemSearchResults<TResult>,
  mapper: (child: TResult, index: number, array: TResult[]) => TOutput,
  defaultValue: TOutput[] | undefined | null = null
) {
  const result = searchResults?.results?.map(mapper) ?? defaultValue;
  return result;
}
