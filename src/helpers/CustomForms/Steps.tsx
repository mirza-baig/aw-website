import classNames from 'classnames';
import { ProgressBar } from 'helpers/ProgressBar';
import { useTheme } from 'lib/context/ThemeContext';
import { FormsContext } from 'lib/custom-forms/FormContext';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import React, { CSSProperties, useContext } from 'react';
import { FiCheck } from 'react-icons/fi';

import { FormStructureTheme } from './FormStructure.Theme';

export type BackgroundVariant = 'gray' | 'white';

export type StepsProps = {
  steps: Array<FormStep>;
  backgroundVariant: BackgroundVariant;
  wrapperClasses?: string;
};

type FormStep = Pick<FormFieldProps, 'fields'>;

interface ProcessedStep {
  step: FormStep;
  intervalSteps: IntervalStep[];
  actualIndex: number;
  nextVisibleStepIndex: number;
}

interface IntervalStep {
  step: FormStep;
  actualIndex: number;
}

/**
 * This comments provides definitions for key variables and terminologies used in handling a multi-step stepper with hidden interval steps.
 * Here are the definitions for some of the important ones:
 *
 * -> currentStepIndex: User's currentStep itex, when navigating through multistep form.
 * -> IntervalSteps:    list of intervalStep item, which consist of that step and actualindex of that inverval step.
 * -> processedSteps:   It is proxy meta props created from actual steps, processedItem consists of step (actual step),
 *                      intervalSteps coming between current and next visible step, actual index of the step, actual index of next visible step.
 */

const Steps = (props: StepsProps) => {
  const currentStepIndex = useContext(FormsContext).pageIndex;

  const { themeData } = useTheme(FormStructureTheme());
  const { currentScreenWidth } = useCurrentScreenType();

  const bgVariant: Record<BackgroundVariant, string> = {
    white: 'md:bg-white',
    gray: 'md:bg-light-gray',
  };

  const { steps } = props;

  if (!steps) {
    return <></>;
  }

  // get the intervalsteps between current and next visible step
  const getIntervalSteps = (currentIndex: number) => {
    const intervalSteps: IntervalStep[] = [];
    for (let i = currentIndex + 1; i < steps.length; i++) {
      if (steps[i]?.fields?.includeInSteps?.value) {
        break;
      } else {
        intervalSteps.push({ step: steps[i], actualIndex: i });
      }
    }
    return intervalSteps;
  };

  // get the processesSteps prosp for the mapping and interval step logic
  const getProcessedSteps = (): ProcessedStep[] => {
    return steps.reduce(
      (_processedSteps: ProcessedStep[], currentStep: FormStep, index: number) => {
        if (currentStep.fields?.includeInSteps?.value) {
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
    if (intervalStepsLength === 0 && currentStepIndex >= processedStep.nextVisibleStepIndex) {
      return 100;
    }

    const divisor = intervalStepsLength + 1;
    const currentIntervalStepindex =
      processedStep.intervalSteps.findIndex(
        (intervalStep) => currentStepIndex === intervalStep.actualIndex
      ) + 1;

    return currentIntervalStepindex * (100 / divisor);
  };

  const getActiveVisibleStepIndex =
    processedSteps.findIndex(
      (processedStep) => currentStepIndex < processedStep.nextVisibleStepIndex
    ) + 1;

  return (
    <div
      className={classNames(
        bgVariant[props.backgroundVariant],
        themeData.classes.stepsWrapper,
        props.wrapperClasses
      )}
    >
      {currentScreenWidth < getBreakpoint('md') ? (
        <ProgressBar
          percent={(Number(getActiveVisibleStepIndex) / processedSteps?.length) * 100}
          stepLabel={steps[currentStepIndex]?.fields?.label?.value}
          isComplete={currentStepIndex + 1 > steps?.length}
          activeStep={
            currentStepIndex + 1 > steps?.length
              ? processedSteps?.length
              : getActiveVisibleStepIndex
          }
          totalSteps={processedSteps?.length}
        />
      ) : (
        <div className={classNames('flex flex-row justify-center gap-x-s py-s')}>
          {processedSteps?.map((processedStep: ProcessedStep, visibleIndex: number) => {
            const actualIndex = processedStep.actualIndex;

            return (
              <React.Fragment key={`step-${visibleIndex}`}>
                <div className={classNames('relative w-[187px]')}>
                  <div
                    className={classNames(
                      'relative flex h-full flex-col items-center justify-between'
                    )}
                  >
                    <div className={classNames('flex h-full flex-col items-center justify-center')}>
                      <div className="z-10 h-full w-full">
                        <strong className={themeData.classes.stepLabel}>
                          {processedStep.step.fields?.label?.value}
                        </strong>
                      </div>
                      <div
                        className={classNames(
                          'z-10 m-0 flex h-[40px] min-h-[40px] w-[40px] cursor-default items-center justify-center rounded-full border-2 p-0',
                          actualIndex === currentStepIndex ||
                            (currentStepIndex < processedStep.nextVisibleStepIndex &&
                              currentStepIndex > actualIndex)
                            ? 'border-primary bg-white'
                            : '',
                          currentStepIndex >= processedStep.nextVisibleStepIndex
                            ? 'border-primary bg-primary'
                            : '',
                          currentStepIndex < processedStep.nextVisibleStepIndex
                            ? 'border-gray bg-white'
                            : '',
                          `relative before:absolute before:top-0 before:-left-[11px] before:h-full before:w-[9px] ${
                            props.backgroundVariant === 'white'
                              ? 'before:bg-white after:bg-white'
                              : 'before:bg-light-gray after:bg-light-gray'
                          }
                         before:content-[""] after:absolute after:top-0 after:-right-[11px] after:h-full after:w-[9px]  after:content-[""]`
                        )}
                      >
                        <strong
                          className={classNames(
                            currentStepIndex >= processedStep.nextVisibleStepIndex
                              ? 'hidden'
                              : themeData.classes.stepLabel,
                            'mb-0!'
                          )}
                        >
                          {visibleIndex + 1}
                        </strong>
                        {currentStepIndex >= processedStep.nextVisibleStepIndex && (
                          <FiCheck size={24} />
                        )}
                      </div>
                    </div>
                    {visibleIndex < processedSteps.length - 1 && (
                      <span
                        style={
                          {
                            '--percent':
                              currentStepIndex >= processedSteps[visibleIndex + 1]?.actualIndex
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
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Steps;
