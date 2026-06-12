'use client';

import Component from 'helpers/Component/Component';
import { ProgressBar } from 'helpers/ProgressBar';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

import { MultiSlideSizingCalculatorTheme } from './helpers/MultiSlideSizingCalculator.theme';
import {
  MultiSlideSizingCalculatorProps,
  StepPanelStyle,
} from './helpers/MultiSlideStepPanelStyle.helper';
import Stepper from './helpers/MultiSlideStepper.helper';
import styles from './helpers/slick.module.css';
import { StepConfigurationOption } from './helpers/StepConfigurationOptions.helper';
import { StepSizingCalculator } from './helpers/StepSizingCalculator.helper';

export const MAX_STEPS = 2;

function MultiSlideSizingCalculator_Default(props: MultiSlideSizingCalculatorProps): JSX.Element {
  const { themeData } = useTheme(MultiSlideSizingCalculatorTheme());

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
  const [formData, setFormData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignFormData = (val: any) => {
    console.log(val);
    setIsResetForm(false);
    setFormData((data) => ({
      ...data,
      ...val,
    }));
  };

  const resetFormData = () => {
    setFormData({});
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
    <Component variant="lg" dataComponent="tool/multislidesizingcalculator" {...props}>
      <div className="col-span-12" ref={eleRef}>
        <div className={themeData.classes.formStep}>
          <div className="hidden md:block">
            <Stepper
              isComplete={isComplete}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              sliderRef={slider}
            />
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
        <div className="mt-5">
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
              <StepSizingCalculator
                formData={formData}
                activeStep={activeStep}
                fields={props.fields}
                onStepChange={handleStepChange}
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

export const Default = withDatasourceCheck(MultiSlideSizingCalculator_Default);
