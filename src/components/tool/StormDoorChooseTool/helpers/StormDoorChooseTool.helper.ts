export interface Question {
  id: string;
  template: {
    name: string;
  };
  questionText: {
    value?: string;
  };
  answeredText: {
    value: string;
  };
  breadcrumbText: {
    value: string;
  };
  errorText: {
    value: string;
  };
}

export interface Answer {
  id: string;
  answerText: {
    value: string;
  };
  answerDescription: {
    value: string;
  };
  primaryImage: {
    title: string;
    src: string;
    height: number;
    width: number;
    alt: string;
  };
  primaryImageMobile: {
    title: string;
    src: string;
    height: number;
    width: number;
    alt: string;
  };
  primaryImageMobileFocusArea: {
    targetItem: {
      value: {
        value: string;
      };
    };
  };
}

export interface Answers {
  children: {
    results: Answer[];
  };
}

export interface QuestionData {
  question: Question;
  answers: Answers;
}
