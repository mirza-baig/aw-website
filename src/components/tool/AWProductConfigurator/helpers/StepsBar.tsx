import type { JSX, RefObject } from 'react';

import type { Step } from './types/step';

interface StepsBarProps {
  navText?: string;
  steps: Step[];
  activeStep: number | null;
  setActiveStep: (stepId: number) => void;
  navRefs?: RefObject<Record<string, HTMLButtonElement | null>>;
}

export default function StepsBarComponent({
  navText,
  steps,
  activeStep,
  setActiveStep,
  navRefs,
}: Readonly<StepsBarProps>): JSX.Element {
  return (
    <div className="flex h-16 w-full flex-row items-center justify-evenly overflow-x-scroll ml:overflow-x-auto">
      <div className="ml-6 mr-2 hidden h-full items-center justify-center px-4 font-futura-pt text-base font-semibold ml:flex ml:px-0 lg:ml-0 lg:text-lg">
        {navText}
      </div>
      <div className="hidden h-10.25 w-px gap-8 bg-gray ml:flex"></div>

      {steps.map((step) => {
        const isActive = step.ID === activeStep;
        return (
          <button
            key={`${step.ID}-${step.Name}`}
            type="button"
            className={`mx-4 flex h-full items-center px-4 md:mx-0 ${
              isActive ? 'border-b-4 border-b-[#F26924]' : 'border-b-0'
            } focus:outline-none focus-visible:ring focus-visible:ring-blue-500`}
            onClick={() => setActiveStep(step.ID)}
            ref={(el) => {
              if (navRefs?.current) {
                navRefs.current[step.ID] = el;
              }
            }}
            aria-pressed={isActive} // Use when this is a toggle-style control
            aria-current={isActive ? 'page' : undefined} // Use when indicating the current item in a set (e.g., nav)
          >
            <span
              className={`wrap-anywhere cursor-pointer whitespace-nowrap px-2 text-sm font-semibold hover:text-black md:px-0 ${
                isActive ? 'text-black' : 'text-[#9D968D]'
              } tracking-[0.02625rem]`}
            >
              {step.ID === 4645 ? 'Summary' : step.Name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
