export type ItemSearchResults<TItem = unknown> = {
  total?: number;
  pageInfo?: {
    hasNext?: boolean;
    endCursor?: string;
  };
  results?: TItem[];
};
