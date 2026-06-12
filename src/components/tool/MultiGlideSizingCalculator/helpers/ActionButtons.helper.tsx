import { useTheme } from 'lib/context/ThemeContext';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { MAX_STEPS } from '../MultiGlideSizingCalculator';
import { MultiGlideSizingCalculatorTheme } from './MultiGlideSizingCalculator.theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MultiGlideSizingCalculatorActionButtons = (props: any) => {
  const { themeData } = useTheme(MultiGlideSizingCalculatorTheme());
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
    <div className="flex items-center justify-between md:justify-start">
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
          <button type="button" className={themeData.classes.submitButton} onClick={handleNext}>
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
