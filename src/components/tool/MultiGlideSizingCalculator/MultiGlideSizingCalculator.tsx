'use client';

import Component from 'helpers/Component/Component';
import { ProgressBar } from 'helpers/ProgressBar';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import { MultiGlideSizingCalculatorTheme } from './helpers/MultiGlideSizingCalculator.theme';
import styles from './helpers/slick.module.css';
import { StepConfigurationOption } from './helpers/StepConfigurationOption.helper';
import { StepMultiCalculation } from './helpers/StepMultiCalculator.helper';
import { StepPanelStyle } from './helpers/StepPanelStyle.helper';
import Stepper from './helpers/Stepper.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type MultiGlideSizingCalculatorProps =
  Sitecore.Components.Tool.MultiGlideSizingCalculator.MultiGlideSizingCalculator;

export const MAX_STEPS = 2;

function MultiGlideSizingCalculator_Default(props: MultiGlideSizingCalculatorProps): JSX.Element {
  const { themeData } = useTheme(MultiGlideSizingCalculatorTheme());

  const slider = useRef<Slider>(null);
  const eleRef = useRef<HTMLDivElement>(null);
  const sliderSettings = {
    dots: false,
    infinite: false,
    touchMove: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const [isResetForm, setIsResetForm] = useState(false);
  const [formData, setformData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignFormData = (val: any) => {
    console.log(val);
    setIsResetForm(false);
    setformData((data) => ({
      ...data,
      ...val,
    }));
  };

  const resetFormData = () => {
    setformData({});
    setIsResetForm(true);
  };

  const handleStepChange = (step: number) => {
    eleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (step <= MAX_STEPS) {
      slider?.current?.slickGoTo(step);
      setActiveStep(step);
      setIsComplete(false);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
  };
  useEffect(() => {
    //Fix for slider adaptiveHeight
    const slide = document.querySelector(
      '.slick-slide.slick-active.slick-current > div'
    ) as HTMLElement;
    slide.style.height = 'auto';
    slide.style.margin = 'auto';
    const activeSlide = document.querySelector(
      '.slick-slide.slick-active.slick-current'
    ) as HTMLElement;
    activeSlide.style.height = 'fit-content';
  });
  return (
    <Component variant="lg" dataComponent="tool/multiglidesizingcalculator" {...props}>
      <div className="col-span-12" ref={eleRef}>
        <div className={themeData.classes.formStep}>
          <div className="hidden md:block">
            <Stepper isComplete={isComplete} activeStep={activeStep} />
          </div>
          <div className="md:hidden">
            <ProgressBar
              percent={(Number(activeStep + 1) / (MAX_STEPS + 1)) * 100}
              stepLabel={''}
              isComplete={isComplete}
              activeStep={activeStep + 1}
              totalSteps={MAX_STEPS + 1}
            />
          </div>
        </div>
        <div className="multiglid-slider-wrapper mt-5">
          <div className={styles.sliderWrapper}>
            <Slider ref={slider} {...sliderSettings} swipeToSlide={false}>
              <StepConfigurationOption
                fields={props.fields}
                activeStep={activeStep}
                isResetForm={isResetForm}
                onStepChange={handleStepChange}
                userCallback={assignFormData}
              />
              <StepPanelStyle
                data={formData}
                fields={props.fields}
                activeStep={activeStep}
                isResetForm={isResetForm}
                onStepChange={handleStepChange}
                userCallback={assignFormData}
              />
              <StepMultiCalculation
                formData={formData}
                activeStep={activeStep}
                fields={props.fields}
                onStepChange={handleStepChange}
                userCallback={assignFormData}
                onResetForm={resetFormData}
                previousStep={() => handleStepChange(activeStep - 1)}
                completeCallback={handleComplete}
              />
            </Slider>
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(MultiGlideSizingCalculator_Default);
