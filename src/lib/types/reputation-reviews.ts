export type Reviews = {
  reviews?: {
    reviewer?: {
      name?: string;
    };
    rating?: number;
    comment?: string;
  }[];
};

export type Summary = {
  summary?: {
    overall?: {
      count?: number;
      rating?: number;
    };
  };
};
