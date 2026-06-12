export interface ProductState {
  ProductListQuestions: ProductListQuestion[];
  AvailableTiles: unknown[];
  FirstPage: number;
  LastPage: number;
  TotalPages: number;
  RecordCount: number;
  ProductListBackendName: string;
  SearchString: string;
}

export interface ProductListQuestion {
  DisplayName: string;
  BackendName: string;
  InfoLinkURL: string;
  HelpText: string | null; // can be null or empty string depending on the item
  AvailableAnswers: ProductAnswer[];
}

export interface ProductAnswer {
  DisplayName: string;
  BackendName: string;
  InfoLinkURL: string;
  IsSelected: boolean;
  HelpText: string | null;
  ImageURL: string;
  AssociatedTileCount: number;
}
