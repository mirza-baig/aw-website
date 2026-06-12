import classNames from 'classnames';
import { ProgressBar } from 'helpers/ProgressBar';
import { useTheme } from 'lib/context/ThemeContext';
import { FormPage } from 'lib/generic-form-builder/form-props';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { CSSProperties, Fragment } from 'react';
import { FiCheck } from 'react-icons/fi';

import { useGenericFormBuilderContext } from './GenericFormBuilderContext';
import { StepsTheme } from './Steps.Theme';

export type StepsProps = {
  steps: Array<FormPage>;
  wrapperClasses?: string;
};

interface ProcessedStep {
  step: FormPage;
  intervalSteps: IntervalStep[];
  actualIndex: number;
  nextVisibleStepIndex: number;
}

interface IntervalStep {
  step: FormPage;
  actualIndex: number;
}

/**
 * This comments provides definitions for key variables and terminologies used in handling a multi-step stepper with hidden interval steps.
 * Here are the definitions for some of the important ones:
 *
 * -> currentPage:    User's currentStep itex, when navigating through multistep form.
 * -> IntervalSteps:  List of intervalStep item, which consist of that step and actualindex of that inverval step.
 * -> processedSteps: It is proxy meta props created from actual steps, processedItem consists of step (actual step),
 *                      intervalSteps coming between current and next visible step, actual index of the step, actual index of next visible step.
 */

export const Steps = (props: StepsProps) => {
  const { currentPage } = useGenericFormBuilderContext();

  const { themeData } = useTheme(StepsTheme());
  const { currentScreenWidth } = useCurrentScreenType();

  const { steps } = props;

  if (!steps) {
    return <></>;
  }

  // get the intervalsteps between current and next visible step
  const getIntervalSteps = (currentIndex: number) => {
    const intervalSteps: IntervalStep[] = [];
    for (let i = currentIndex + 1; i < steps.length; i++) {
      if (!steps[i].includeInSteps) {
        intervalSteps.push({ step: steps[i], actualIndex: i });
      } else {
        break;
      }
    }
    return intervalSteps;
  };

  // get the processesSteps prosp for the mapping and interval step logic
  const getProcessedSteps = (): ProcessedStep[] => {
    return steps.reduce(
      (_processedSteps: ProcessedStep[], currentStep: FormPage, index: number) => {
        if (currentStep.includeInSteps) {
          const intervalSteps: IntervalStep[] = getIntervalSteps(index);
          _processedSteps.push({
            step: currentStep,
            intervalSteps,
            actualIndex: index,
            nextVisibleStepIndex: index + intervalSteps.length + 1,
          });
        }
        return _processedSteps;
      },
      []
    );
  };

  const processedSteps = getProcessedSteps();

  // get progress percentages for horizontal line in desktop
  const getDesktopStepBarProgress = (processedStep: ProcessedStep) => {
    const intervalStepsLength = processedStep?.intervalSteps?.length;
    if (intervalStepsLength === 0 && currentPage >= processedStep.nextVisibleStepIndex) {
      return 100;
    }

    const divisor = intervalStepsLength + 1;
    const currentIntervalStepindex =
      processedStep.intervalSteps.findIndex(
        (intervalStep) => currentPage === intervalStep.actualIndex
      ) + 1;

    return currentIntervalStepindex * (100 / divisor);
  };

  const getActiveVisibleStepIndex =
    processedSteps.findIndex((processedStep) => currentPage < processedStep.nextVisibleStepIndex) +
    1;

  return (
    <div
      className={classNames(
        'md:bg-light-gray',
        themeData.classes.stepsWrapper,
        props.wrapperClasses
      )}
    >
      {currentScreenWidth < getBreakpoint('md') ? (
        <ProgressBar
          percent={(Number(getActiveVisibleStepIndex) / processedSteps?.length) * 100}
          stepLabel={steps[currentPage].label}
          isComplete={currentPage + 1 > steps?.length}
          activeStep={
            currentPage + 1 > steps?.length ? processedSteps?.length : getActiveVisibleStepIndex
          }
          totalSteps={processedSteps?.length}
        />
      ) : (
        <div className={classNames('flex flex-row justify-center gap-x-s py-s')}>
          {processedSteps?.map((processedStep: ProcessedStep, visibleIndex: number) => {
            const actualIndex = processedStep.actualIndex;

            return (
              <Fragment key={`step-${visibleIndex}`}>
                <div className={classNames('relative w-[187px]')}>
                  <div
                    className={classNames(
                      'relative flex h-full flex-col items-center justify-between'
                    )}
                  >
                    <div className={classNames('flex h-full flex-col items-center justify-center')}>
                      <div className="z-10 h-full w-full">
                        <strong className={themeData.classes.stepLabel}>
                          {processedStep.step.label}
                        </strong>
                      </div>
                      <div
                        className={classNames(
                          'z-10 m-0 flex h-[40px] min-h-[40px] w-[40px] cursor-default items-center justify-center rounded-full border-2 p-0',
                          actualIndex === currentPage ||
                            (currentPage < processedStep.nextVisibleStepIndex &&
                              currentPage > actualIndex)
                            ? 'border-primary bg-white'
                            : '',
                          currentPage >= processedStep.nextVisibleStepIndex
                            ? 'border-primary bg-primary'
                            : '',
                          currentPage < processedStep.nextVisibleStepIndex
                            ? 'border-gray bg-white'
                            : '',
                          'relative before:absolute before:top-0 before:-left-[11px] before:h-full before:w-[9px] before:bg-light-gray after:bg-light-gray before:content-[""] after:absolute after:top-0 after:-right-[11px] after:h-full after:w-[9px]  after:content-[""]'
                        )}
                      >
                        <strong
                          className={classNames(
                            currentPage >= processedStep.nextVisibleStepIndex
                              ? 'hidden'
                              : themeData.classes.stepLabel,
                            'mb-0!'
                          )}
                        >
                          {visibleIndex + 1}
                        </strong>
                        {currentPage >= processedStep.nextVisibleStepIndex && <FiCheck size={24} />}
                      </div>
                    </div>
                    {visibleIndex < processedSteps.length - 1 && (
                      <span
                        style={
                          {
                            '--percent':
                              currentPage >= processedSteps[visibleIndex + 1]?.actualIndex
                                ? 100
                                : getDesktopStepBarProgress(processedStep),
                          } as CSSProperties
                        }
                        className={classNames(
                          'absolute left-[calc(50%+28px)] bottom-[20px] h-[2px] w-full max-w-[148px] bg-gray',
                          "after:absolute after:left-0 after:h-[2px] after:w-[calc(var(--percent)*1%)] after:bg-primary after:content-['']"
                        )}
                      />
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Steps;
