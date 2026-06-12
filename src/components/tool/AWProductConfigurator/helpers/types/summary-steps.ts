export interface SummarySteps {
  QASummary: QASummary[]; // Changed from Steps to QASummary
  ID: number;
  Name: string;
  Order: number;
  StopType: number;
}

export interface QASummary {
  QuestionName: string;
  AnswerText: string;
  UnitVisualIndicator: string | null;
  StopType: number;
  ID: string;
  UnitIndex: number;
  QuestionClassification: string;
  StepId: number;
}
