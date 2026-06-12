import classNames from 'classnames';
import { useTheme } from 'lib/context/ThemeContext';
import { useContext } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { FoldingDoorSizingCalculatorTheme } from './FoldingDoorSizingCalculator.theme';
import { FoldingDoorSizingCalculatorContext } from './FoldingDoorSizingCalculatorContext.helper';

export const StepButtons = () => {
  const { themeData } = useTheme(FoldingDoorSizingCalculatorTheme());
  const { activeStep, setActiveStep } = useContext(FoldingDoorSizingCalculatorContext);
  const { setIsCalculated } = useContext(FoldingDoorSizingCalculatorContext);
  const { maxSteps } = useContext(FoldingDoorSizingCalculatorContext);
  const { setScrollToTop } = useContext(FoldingDoorSizingCalculatorContext);

  const handleStepChange = (step: number) => {
    if (step <= maxSteps) {
      setIsCalculated(false);
      setActiveStep(step);
      setScrollToTop(true);
    }
  };

  return (
    <div
      className={classNames(
        'mb-2',
        activeStep === 0
          ? 'mt-[-8px] flex w-full flex-row justify-end space-x-4 md:mt-14 md:w-fit md:justify-start'
          : 'mt-[-8px] flex w-full flex-row justify-between space-x-4 md:mt-14 md:w-fit md:justify-start'
      )}
    >
      {activeStep > 0 && (
        <div className="">
          <button
            type="button"
            className={themeData.classes.prevButton}
            onClick={() => handleStepChange(activeStep - 1)}
          >
            <FiArrowLeft size={16} />
            <span className="ml-2">Previous</span>
          </button>
        </div>
      )}
      {(activeStep === 0 || activeStep < maxSteps) && (
        <button
          type="button"
          className={themeData.classes.submitButton}
          onClick={() => handleStepChange(activeStep + 1)}
        >
          <span className="mr-2">Next</span>
          <FiArrowRight size={16} />
        </button>
      )}
      {activeStep === maxSteps && (
        <div className="">
          <button type="submit" className={themeData.classes.submitButton}>
            <span className="mr-2">Calculate</span>
          </button>
        </div>
      )}
    </div>
  );
};
