import classNames from 'classnames';
import { FormStructureTheme } from 'helpers/CustomForms/FormStructure.Theme';
import { useTheme } from 'lib/context/ThemeContext';
import { FormsContext } from 'lib/custom-forms/FormContext';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import React, { CSSProperties, useContext } from 'react';
import IconStepCheck from 'src/helpers/SvgIcon/icons/icon--step-check';
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
  // Render step circles (shared between mobile and desktop)
  const renderStepCircles = (isMobile: boolean) => (
    <div className={classNames('flex flex-row justify-center gap-x-s py-s')}>
      {processedSteps?.map((processedStep: ProcessedStep, visibleIndex: number) => {
        const actualIndex = processedStep.actualIndex;
        return (
          <React.Fragment key={`step-${actualIndex}`}>
            <div className={classNames('relative', isMobile ? 'w-25' : 'w-46.75')}>
              <div
                className={classNames('relative flex h-full flex-col items-center justify-between')}
              >
                <div className={classNames('flex h-full flex-col items-center justify-center')}>
                  {/* Show label text only on desktop */}
                  {!isMobile && (
                    <div className="z-10 h-full w-full">
                      <strong className={themeData.classes.stepLabel}>
                        {processedStep.step.fields?.label?.value}
                      </strong>
                    </div>
                  )}
                  <div
                    className={classNames(
                      'z-10 m-0 flex cursor-default items-center justify-center rounded-full p-0',
                      isMobile
                        ? 'h-[32px] min-h-[32px] w-[32px]'
                        : 'h-[40px] min-h-[40px] w-[40px]',
                      // All states use icon which renders its own circle
                      'border-0',
                      `relative before:absolute before:top-0 before:-left-[11px] before:h-full before:w-[9px] ${
                        props.backgroundVariant === 'white'
                          ? 'before:bg-white after:bg-white'
                          : 'before:bg-light-gray after:bg-light-gray'
                      }
                    before:content-[""] after:absolute after:top-0 after:-right-[11px] after:h-full after:w-[9px]  after:content-[""]`
                    )}
                  >
                    {/* Inactive: gray circle with gray check */}
                    {currentStepIndex < processedStep.nextVisibleStepIndex &&
                      !(
                        actualIndex === currentStepIndex ||
                        (currentStepIndex < processedStep.nextVisibleStepIndex &&
                          currentStepIndex > actualIndex)
                      ) && <IconStepCheck size={isMobile ? 32 : 40} variant="inactive" />}
                    {/* Active: orange outline, orange check */}
                    {(actualIndex === currentStepIndex ||
                      (currentStepIndex < processedStep.nextVisibleStepIndex &&
                        currentStepIndex > actualIndex)) &&
                      currentStepIndex < processedStep.nextVisibleStepIndex && (
                        <IconStepCheck size={isMobile ? 32 : 40} variant="active" />
                      )}
                    {/* Completed: orange bg, white check */}
                    {currentStepIndex >= processedStep.nextVisibleStepIndex && (
                      <IconStepCheck size={isMobile ? 32 : 40} variant="completed" />
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
                      'absolute h-[2px] bg-gray',
                      isMobile
                        ? 'left-[calc(50%+22px)] bottom-[16px] w-full max-w-[68px]'
                        : 'left-[calc(50%+28px)] bottom-[20px] w-full max-w-[148px]',
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
  );
  const renderMobileSteps = () => {
    let currentVisibleStepNumber = 1;
    processedSteps.forEach((ps, idx) => {
      if (currentStepIndex >= ps.actualIndex) {
        currentVisibleStepNumber = idx + 1;
      }
    });
    const progressPercent = (currentVisibleStepNumber / processedSteps.length) * 100;
    return (
      <div className="flex w-full flex-col px-m py-s md:px-0">
        <div className="relative h-[8px] w-full overflow-hidden rounded-full bg-gray">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-xs text-right font-sans text-body font-heavy text-black">
          {currentVisibleStepNumber} / {processedSteps.length}
        </div>
      </div>
    );
  };
  return (
    <div
      className={classNames(
        bgVariant[props.backgroundVariant],
        themeData.classes.stepsWrapper,
        props.wrapperClasses
      )}
    >
      {currentScreenWidth < getBreakpoint('md') ? renderMobileSteps() : renderStepCircles(false)}
    </div>
  );
};
export default Steps;
