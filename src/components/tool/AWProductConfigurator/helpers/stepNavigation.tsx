import type { Step } from './types/step';

interface StepNavigationProps {
  steps: Step[];
  activeStep: number | null;
  setActiveStep: (stepId: number) => void;
  onClearSelections: (clear: boolean) => void;
  onSaveLineItem: (saveLine: boolean) => void;
}

export default function StepNavigationComponent({
  steps,
  activeStep,
  setActiveStep,
  onClearSelections,
  onSaveLineItem,
}: Readonly<StepNavigationProps>) {
  // Get current index based on activeStep ID
  const currentIndex = steps.findIndex((step) => step.ID === activeStep);

  // Check if we're at first or last step
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].ID);
    }
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].ID);
    }
  };

  // Clear selections handler
  const handleClearSelections = () => {
    // Reset to first step
    onClearSelections(true);
  };

  // Save the line item to the quote
  const handleSaveLineItem = () => {
    onSaveLineItem(true);
  };

  return (
    <div className="mt-6 flex flex-col">
      <div className="grid grid-cols-2 gap-x-3">
        <div>
          {!isFirstStep && (
            <button
              onClick={handlePrevious}
              className="cursor-pointer mr-m flex w-full items-center justify-center whitespace-normal rounded-lg border-3 border-solid border-black px-m py-2.25 font-sans text-button font-heavy text-black hover:bg-black hover:text-theme-btn-text-hover"
            >
              <span className="mr-xxs">
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Left Arrow Icon</title>
                  <path d="M6.73657 1L1.7366 6L6.73657 11" stroke="currentColor" strokeWidth="2" />
                  <path d="M1.7366 6H14.7366" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span>PREVIOUS</span>
            </button>
          )}
        </div>
        <div>
          {!isLastStep && (
            <button
              onClick={handleNext}
              className="cursor-pointer mr-m flex w-full items-center justify-center whitespace-normal rounded-lg border-3 border-theme-btn-border bg-theme-btn-bg px-m py-2.25 font-sans text-button font-heavy text-black hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover"
            >
              <span>NEXT</span>
              <span className="ml-xxs">
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Right Arrow Icon</title>
                  <path
                    d="M8.26343 1L13.2634 6L8.26343 11"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></path>
                  <path d="M13.2634 6H0.263428" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </span>
            </button>
          )}
          {isLastStep && (
            <button
              onClick={handleSaveLineItem}
              className="cursor-pointer mr-m flex w-full items-center justify-center whitespace-normal rounded-lg border-3 border-theme-btn-border bg-theme-btn-bg px-m py-2.25 font-sans text-button font-heavy text-black hover:border-theme-btn-border-hover hover:bg-theme-btn-bg-hover hover:text-theme-btn-text-hover"
            >
              SAVE CONFIGURATION{' '}
              <span className="ml-xxs">
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Right Arrow Icon</title>
                  <path
                    d="M8.26343 1L13.2634 6L8.26343 11"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></path>
                  <path d="M13.2634 6H0.263428" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 mb-8 flex justify-center">
        <button
          onClick={handleClearSelections}
          className="cursor-pointer h-10 px-4 text-sm font-normal leading-5 hover:underline hover:underline-offset-8"
        >
          Clear Selections
          <svg
            viewBox="0 0 16 16"
            focusable="false"
            className="ml-2 inline-block h-4 w-4 shrink-0 align-middle leading-[1em] text-current"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="8" cy="8" r="7" fill="white" stroke="#F26924" strokeWidth="2"></circle>
              <path
                d="M6 6L10 10.2545"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
              <path
                d="M6 10.2861L9.92355 6.00042"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
              ></path>
            </svg>
          </svg>
        </button>
      </div>
    </div>
  );
}
