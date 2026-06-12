// Individual key/value extra fields present on Question or Answer
export interface ExtraField {
  Key: string;
  Value: string;
}

// A possible answer for a question
export interface Answer {
  ID: string; // UUID or string identifier
  Text: string;
  ImageURL: string;
  InfoLinkURL: string;
  HoverText: string;
  MarketingText: string | null;
  IsPreference: boolean;
  PreferenceType: string[]; // seems to be an array of strings
  IsPreferenceAllowed: boolean;
  ExtraFields: ExtraField[] | null;
}

// Question types observed in your data; keep as string if backend may add more
export type QuestionType = 'MultiChoice' | 'FreeEntry';

// Classification values observed in your data; keep as string union or plain string
export type QuestionClassification =
  | 'CommonQuestion'
  | 'RoomComment'
  | 'CommonDimension'
  | 'WindowSetDimension'
  | 'WrappingQuestion';

// A question within the step
export interface Question {
  QuestionText: string;
  QuestionType: QuestionType;
  IsNumeric: boolean;
  Answers: Answer[]; // empty array for FreeEntry questions
  InfoLinkURL: string;
  StopType: number;
  Locked: boolean;
  AllowsDifferentAnswers: boolean;
  UnitVisualIndicator: string | null;
  MarketingText: string | null; // sometimes "" (empty string), sometimes null
  ExtraFields: ExtraField[] | null;
  ID: string; // UUID
  SelectedAnswerID: string; // string ID or free-entry string like "35.5"
  UsingDifferentAnswers: boolean;
  UnitIndex: number;
  QuestionClassification: QuestionClassification;
}

// The step object itself
export interface ActiveStepData {
  Complete: boolean;
  Questions: Question[];
  ID: number;
  Name: string;
  Order: number;
  StopType: number;
}
