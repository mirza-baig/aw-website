'use client';

import Component from 'helpers/Component/Component';
import { ProgressBar } from 'helpers/ProgressBar';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';

import { Calculator, FoldingDoorSizingCalculatorProps } from './helpers/Calculator.helper';
import { FoldingDoorSizingCalculatorContext } from './helpers/FoldingDoorSizingCalculatorContext.helper';
import { Stepper } from './helpers/FoldingDoorStepper.helper';
import { PanelStyle } from './helpers/PanelStyle.helper';
import styles from './helpers/slick.module.css';

function FoldingDoorSizingCalculator_Default(props: FoldingDoorSizingCalculatorProps): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [maxSteps, setMaxSteps] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  const [panelStyle, setPanelStyle] = useState('contemporary');
  const [panelStyleText, setPanelStyleText] = useState('Contemporary');

  const { currentScreenWidth } = useCurrentScreenType();

  const slider = useRef<Slider>(null);

  const sliderSettings = {
    accessibility: false,
    dots: false,
    infinite: false,
    touchMove: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };
  const stepLables = [['Select Panel Style'], ['Enter Size Information']];

  useEffect(() => {
    if (currentStep !== activeStep) {
      slider?.current?.slickGoTo(activeStep);
      setCurrentStep(activeStep);
    }

    if (scrollToTop) {
      const elem = document.getElementById('scrollToTopDiv');
      const sy = window.scrollY;
      let y =
        elem?.getBoundingClientRect().top === undefined
          ? 0
          : elem?.getBoundingClientRect().top + sy;

      if (currentScreenWidth <= getBreakpoint('ml')) {
        y = y - 59;
      }

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });

      setScrollToTop(false);
    }

    const slide = document.querySelector(
      '.slick-slide.slick-active.slick-current > div'
    ) as HTMLElement;
    if (slide) {
      slide.style.height = 'auto';
    }

    const activeSlide = document.querySelector(
      '.slick-slide.slick-active.slick-current'
    ) as HTMLElement;
    if (activeSlide) {
      activeSlide.style.height = 'fit-content';
    }
  }, [activeStep, currentScreenWidth, currentStep, scrollToTop]);

  // ✅ Memoize context value to prevent re-creation on every render
  const contextValue = useMemo(
    () => ({
      maxSteps,
      scrollToTop,
      activeStep,
      isCalculated,
      panelStyle,
      panelStyleText,
      setMaxSteps,
      setScrollToTop,
      setActiveStep,
      setIsCalculated,
      setPanelStyle,
      setPanelStyleText,
    }),
    [maxSteps, scrollToTop, activeStep, isCalculated, panelStyle, panelStyleText]
  );

  return (
    <Component variant="lg" dataComponent="tool/foldingdoorsizingcalculator" {...props}>
      <div className="col-span-12" id="scrollToTopDiv">
        <FoldingDoorSizingCalculatorContext.Provider value={contextValue}>
          <div className="hidden md:block">
            <Stepper />
          </div>
          <div className="md:hidden">
            <ProgressBar
              percent={(Number(activeStep + 1) / (maxSteps + 1)) * 100}
              stepLabel={stepLables[activeStep]}
              isComplete={isCalculated}
              activeStep={activeStep + 1}
              totalSteps={maxSteps + 1}
            />
          </div>
          <div className="mt-10">
            <div className={styles.sliderWrapper}>
              <Slider ref={slider} {...sliderSettings} swipeToSlide={false}>
                <PanelStyle {...props} />
                <Calculator {...props} />
              </Slider>
            </div>
          </div>
        </FoldingDoorSizingCalculatorContext.Provider>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(FoldingDoorSizingCalculator_Default);
