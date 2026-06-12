import { JSX } from 'react';

import { SummarySteps } from './types/summary-steps';

interface Props {
  steps: SummarySteps[];
  selectedProduct?: string;
}

export default function SummaryComponent({ steps, selectedProduct }: Readonly<Props>): JSX.Element {
  return (
    <div className="flex flex-col gap-3 bg-light-gray p-4">
      <div className="font-semibold">{selectedProduct}</div>
      {steps.map((step) => (
        <div className="flex-col" key={step.ID}>
          <div className="bg-white">
            <div key={step.ID}>
              {/* Display the Name as the title */}
              <div className="border-gray-300 mx-3 border-b pt-2 font-semibold">
                <div className="mb-1 text-black">{step.Name}</div>
              </div>

              {/* Display QuestionName and AnswerText */}
              <div>
                {step.QASummary.map((qa) => (
                  <div
                    key={qa.ID}
                    className="flex flex-col gap-2 rounded p-3 sm:flex-row sm:items-start"
                  >
                    <div className="question-name w-1/2 text-sm font-medium text-dark-gray">
                      {qa.QuestionName}:
                    </div>
                    <div className="w-1/2 text-sm font-medium">{qa.AnswerText}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
