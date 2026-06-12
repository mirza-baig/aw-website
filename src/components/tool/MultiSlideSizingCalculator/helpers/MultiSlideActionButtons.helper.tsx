import { useTheme } from 'lib/context/ThemeContext';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { MAX_STEPS } from '../MultiSlideSizingCalculator';
import { MultiSlideSizingCalculatorTheme } from './MultiSlideSizingCalculator.theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MultiSlideSizingCalculatorActionButtons = (props: any) => {
  const { themeData } = useTheme(MultiSlideSizingCalculatorTheme());
  const { activeStep } = props;

  const handleBack = () => {
    props.onStepChange(activeStep - 1);
  };

  const handleNext = () => {
    props.nextStep();
  };

  const handleFinish = () => {
    props.lastStep();
  };

  return (
    <div className="m-auto flex items-center justify-between md:justify-start">
      <div>
        {activeStep > 0 && (
          <button className={themeData.classes.prevButton} onClick={handleBack}>
            <FiArrowLeft size={16} />
            <span className="ml-2">Previous</span>
          </button>
        )}
      </div>
      <div>
        {activeStep < MAX_STEPS && (
          <button className={themeData.classes.submitButton} onClick={handleNext}>
            <span className="mr-2">Next</span>
            <FiArrowRight size={16} />
          </button>
        )}
        {activeStep === MAX_STEPS && (
          <button type="button" className={themeData.classes.submitButton} onClick={handleFinish}>
            Calculate
          </button>
        )}
      </div>
    </div>
  );
};
