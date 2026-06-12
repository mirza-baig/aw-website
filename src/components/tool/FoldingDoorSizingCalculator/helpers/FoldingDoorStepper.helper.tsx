import classNames from 'classnames';
import { useContext } from 'react';
import { FiCheck } from 'react-icons/fi';

import { FoldingDoorSizingCalculatorContext } from './FoldingDoorSizingCalculatorContext.helper';

export const Stepper = () => {
  const { activeStep, setActiveStep } = useContext(FoldingDoorSizingCalculatorContext);
  const { isCalculated, setIsCalculated } = useContext(FoldingDoorSizingCalculatorContext);
  const { maxSteps } = useContext(FoldingDoorSizingCalculatorContext);

  const activeButtonStyle =
    'm-0 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border-2 border-[#F26924] bg-white p-0';
  const completedButtonStyle =
    'm-0 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border-2 border-[#F26924] bg-[#F26924] p-0';
  const inactiveButtonStyle =
    'm-0 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border-2 border-[#C4BFB6] bg-white p-0';

  const handleStepChange = (step: number) => {
    if (step <= maxSteps) {
      setActiveStep(step);
      setIsCalculated(false);
    }
  };

  return (
    <div className="mt-5 bg-[#F8F6F4] pt-2">
      <div className="flex flex-row p-[16px] pb-[19px]">
        <div className="relative flex-1 pl-2 pr-2">
          <div className="flex justify-end">
            <div className="flex min-w-[187px] flex-col items-center">
              <div className="">
                <span className="mb-2 block text-center font-sans text-button font-semibold leading-4">
                  Step One
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleStepChange(0)}
                className={classNames(
                  activeStep === 0 ? activeButtonStyle : '',
                  activeStep > 0 ? completedButtonStyle : ''
                )}
              >
                <span
                  className={
                    activeStep > 0 ? 'hidden' : 'font-sans text-button font-heavy leading-4'
                  }
                >
                  1
                </span>
                {activeStep > 0 && <FiCheck size={24} />}
              </button>
            </div>
          </div>
        </div>
        <div className="relative flex-1 pl-2 pr-2">
          {/* <div className="absolute left-[calc((-50%+4em)+130px)] right-[calc((50%+4em)+130px)] top-[calc((6em-2px)/2)]"> */}
          <div className="absolute left-[-74px] top-[calc((6em-2px)/2)] w-[148px]">
            <span
              className={
                activeStep >= 1
                  ? 'block border-t-2 border-[#F26924]'
                  : 'block border-t-2 border-[#C4BFB6]'
              }
            ></span>
          </div>
          <div className="flex justify-start">
            <div className="flex min-w-[187px] flex-col items-center">
              <div className="">
                <span className="mb-2 block text-center font-sans text-button font-semibold leading-4">
                  Step Two
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleStepChange(1)}
                className={classNames(
                  activeStep === 1 ? activeButtonStyle : '',
                  isCalculated ? completedButtonStyle : '',
                  activeStep < 1 ? inactiveButtonStyle : ''
                )}
              >
                <span
                  className={isCalculated ? 'hidden' : 'font-sans text-button font-heavy leading-4'}
                >
                  2
                </span>
                {isCalculated && <FiCheck size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
