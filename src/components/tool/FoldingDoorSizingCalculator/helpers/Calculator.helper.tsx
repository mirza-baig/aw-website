import classNames from 'classnames';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import * as AWNumberUtil from 'src/lib/utils/number-utils/aw-number-utils';

import { FoldingDoorSizingCalculatorTheme } from './FoldingDoorSizingCalculator.theme';
import { FoldingDoorSizingCalculatorContext } from './FoldingDoorSizingCalculatorContext.helper';
import { StepButtons } from './StepButtons.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type FoldingDoorSizingCalculatorProps =
  Sitecore.Components.Tool.FoldingDoorSizingCalculator.FoldingDoorSizingCalculator;

type MinMaxes = {
  panelStyle: string;
  numberPanels: number;
  minWidthUnitDimensions: number;
  maxWidthUnitDimensions: number;
  panelWidthAdjustment: number;
  panelConfiguration: string;
  showExternalAccessMessage: boolean;
  minWidthRoughOpening: number;
  maxWidthRoughOpening: number;
};

type SelectOptions = {
  value: string;
  text: string;
};

type CalcForm = {
  calculateUsing: string;
  widthFeet: string;
  widthInches: string;
  widthFractions: string;
  heightFeet: string;
  heightInches: string;
  heightFractions: string;
  sillOptions: string;
  numberPanels: string;
  panelConfiguration: string;
  insectScreens: string;
  screenConfiguration: string;
};

export const Calculator = (props: FoldingDoorSizingCalculatorProps) => {
  const { themeData } = useTheme(FoldingDoorSizingCalculatorTheme());
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [scrollToResults, setScrollToResults] = useState(false);
  const { activeStep, setActiveStep } = useContext(FoldingDoorSizingCalculatorContext);
  const { isCalculated, setIsCalculated } = useContext(FoldingDoorSizingCalculatorContext);
  const { currentScreenWidth } = useCurrentScreenType();

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My Document',
  });

  // Track changes to the form that require an update to elements
  const [formUpdated, setFormUpdated] = useState<boolean>(false);
  const [showExternalAccessMessage, setShowExternalAccessMessage] = useState<boolean>(false);
  const [showScreenConfiguration, setShowScreenConfiguration] = useState<boolean>(false);
  const [showSillDepth, setShowSillDepth] = useState<boolean>(true);
  const [currentPanelStyle, setCurrentPanelStyle] = useState('contemporary');

  // Error & info messages
  const [errorMsgHeight, setErrorMsgHeight] = useState('');
  const [errorMsgWidth, setErrorMsgWidth] = useState('');
  const [heightIsValid, setHeightIsValid] = useState(true);
  const [widthIsValid, setWidthIsValid] = useState(true);
  const [maxPanelAreaExceeded, setMaxPanelAreaExceeded] = useState(false);

  //Options selected values
  const { panelStyle, setPanelStyle } = useContext(FoldingDoorSizingCalculatorContext);
  const { panelStyleText } = useContext(FoldingDoorSizingCalculatorContext);
  const [calcUsingValue, setCalcUsingValue] = useState<string>('rough_opening');
  const [sillOption, setSillOption] = useState<string>('high_performance');
  const [sillOptionText, setSillOptionText] = useState<string>('High Performance');
  const [widthLength, setWidthLength] = useState<number>(0);
  const [heightLength, setHeightLength] = useState<number>(0);
  const [numberPanels, setNumberPanels] = useState<string>('4');
  const [panelConfiguration, setPanelConfiguration] = useState<string>('2L2R');
  const [insectScreenValue, setInsectScreenValue] = useState<string>('none');
  const [insectScreenText, setInsectScreenText] = useState<string>('None');
  const [screenConfigurationText, setScreenConfigurationText] = useState<string>('Single Screen');

  //Calculator output values
  const [roughOpeningWidth, setRoughOpeningWidth] = useState<string>();
  const [roughOpeningHeight, setRoughOpeningHeight] = useState<string>();
  const [unitHeight, setUnitHeight] = useState<string>();
  const [unitWidth, setUnitWidth] = useState<string>();
  const [panelHeight, setPanelHeight] = useState<string>();
  const [panelWidth, setPanelWidth] = useState<string>();
  const [frameDepth, setFrameDepth] = useState<string>();
  const [panelThickness, setPanelThickness] = useState<string>();
  const [stileWidth, setStileWidth] = useState<string>();
  const [sillDepth, setSillDepth] = useState<string>();
  const [screenRoughOpeningHeight, setScreenRoughOpeningHeight] = useState<string>();
  const [screenRoughOpeningWidth, setScreenRoughOpeningWidth] = useState<string>();
  const [screenUnitSizeHeight, setScreenUnitSizeHeight] = useState<string>();
  const [screenUnitSizeWidth, setScreenUnitSizeWidth] = useState<string>();

  // Select option values
  const [numberPanelsOptions, setNumberPanelsOptions] = useState<Record<string, string>[]>([
    { value: '2', text: '2' },
    { value: '3', text: '3' },
    { value: '4', text: '4' },
    { value: '5', text: '5' },
    { value: '6', text: '6' },
    { value: '7', text: '7' },
    { value: '8', text: '8' },
    { value: '9', text: '9' },
    { value: '10', text: '10' },
    { value: '11', text: '11' },
    { value: '12', text: '12' },
    { value: '13', text: '13' },
    { value: '14', text: '14' },
    { value: '15', text: '15' },
    { value: '16', text: '16' },
  ]);

  const [panelConfigurationOptions, setPanelConfigurationOptions] = useState<
    Record<string, string>[]
  >([
    { value: '2L2R', text: '2L2R' },
    { value: '3L1R', text: '3L1R' },
    { value: '1L3R', text: '1L3R' },
    { value: '4L', text: '4L' },
    { value: '4R', text: '4R' },
  ]);

  const sillOptions = [
    { value: 'high_performance', text: 'High Performance' },
    { value: 'low_profile', text: 'Low Profile' },
    { value: 'flush', text: 'Flush' },
  ];

  const sillOptionsCoastal = [{ value: 'high_performance', text: 'High Performance' }];

  const [screenConfigOptions, setScreenConfigOptions] = useState<Record<string, string>[]>([
    { value: 'single', text: 'Single Screen' },
    { value: 'double', text: 'Double Screen' },
  ]);

  const [insectScreenOptions, setInsectScreenOptions] = useState<Record<string, string>[]>([
    { value: 'none', text: 'None' },
    { value: 'retractable', text: 'Retractable' },
  ]);

  // Calculator Functions
  const maxCoastalPanelAreaExceeded = (panelWidth: number, panelHeight: number) => {
    return panelWidth * panelHeight > 4145.652;
  };

  // Unit Width => Panel Width
  const calculatePanelWidth = (
    unitWidth: number,
    panelStyle: string,
    panelConfiguration: string
  ) => {
    const configurationRow = minMaxesData.filter(
      (row) => row.panelStyle === panelStyle && row.panelConfiguration === panelConfiguration
    );

    const panelWidth =
      (unitWidth - Number(configurationRow[0].panelWidthAdjustment)) /
      Number(configurationRow[0].numberPanels);

    return AWNumberUtil.truncate(panelWidth, 3);
  };

  const convertToFeetInchesAndFraction = (number: number, roundingDirection: number) => {
    const whole = Math.floor(number);

    let feet = Math.floor(whole / 12);
    let inches = whole % 12;
    let fraction = AWNumberUtil.decimalToEigth(number, { roundingDirection: roundingDirection });

    // Handle overflow if we rounded up
    if (fraction === '1') {
      inches += 1;
      fraction = '0';

      if (inches === 12) {
        feet += 1;
        inches = 0;
      }
    }

    let formatted = '';

    if (feet > 0) {
      formatted += String(feet) + "'";
    }

    if (inches > 0) {
      formatted += ' ' + String(inches);
    }
    if (fraction && fraction !== '0') {
      // Only add it if we have a value and it isn't 0
      formatted += ' ' + fraction;
    }
    if (inches > 0 || (fraction && fraction !== '0')) {
      // Add the inch marker if we added inches or fraction
      formatted += '"';
    }

    return formatted;
  };

  const formatNumber = (number: number) => {
    const rounded = AWNumberUtil.roundToEigth(number, AWNumberUtil.roundingDirections.closest);
    const formatted = convertToFeetInchesAndFraction(
      rounded,
      AWNumberUtil.roundingDirections.closest
    );
    return formatOutput(formatted, rounded);
  };

  const formatOutput = (formattedNumber: string, numberValue: number) => {
    const mm = numberValue * 25.4;
    return formattedNumber + ' \n ' + ' (' + String(mm.toFixed(3)) + ' mm)';
  };

  const roundNumber = (n: number) => {
    return Number(n.toFixed(3));
  };

  // Rough Opening Width => Unit Width
  const calculateUnitWidthFromRoughOpeningWidth = (roughOpeningWidth: number) => {
    return roughOpeningWidth - 0.75;
  };

  // Rough Opening Height => Unit Height
  const calculateUnitHeightFromRoughOpeningHeight = (roughOpeningHeight: number) => {
    return roughOpeningHeight - 0.75;
  };

  // Unit Width => Rough Opening Width
  const calculateRoughOpeningWidthFromUnitWidth = (unitWidth: number) => {
    return unitWidth + 0.75;
  };

  // Unit Height => Rough Opening Height
  const calculateRoughOpeningHeightFromUnitHeight = (unitHeight: number) => {
    return unitHeight + 0.75;
  };

  const minMaxWidths = [
    ['contemporary', 2, 38.25, 98.25, 2.338, '2L', true],
    ['contemporary', 2, 38.25, 98.25, 2.338, '2R', true],
    ['contemporary', 3, 56.625, 146.25, 2.619, '2L1R', false],
    ['contemporary', 3, 56.625, 146.25, 2.619, '1L2R', false],
    ['contemporary', 3, 56.625, 146.25, 2.369, '3L', false],
    ['contemporary', 3, 56.625, 146.25, 2.369, '3R', false],
    ['contemporary', 4, 75.875, 194.625, 2.994, '2L2R', true],
    ['contemporary', 4, 75.875, 194.625, 3.807, '3L1R', false],
    ['contemporary', 4, 75.875, 194.625, 3.807, '1L3R', false],
    ['contemporary', 4, 75.875, 194.625, 2.65, '4L', true],
    ['contemporary', 4, 75.875, 194.625, 2.65, '4R', true],
    ['contemporary', 5, 93, 242.625, 2.931, '3L2R', false],
    ['contemporary', 5, 93, 242.625, 2.931, '2L3R', false],
    ['contemporary', 5, 93, 242.625, 2.931, '4L1R', false],
    ['contemporary', 5, 93, 242.625, 2.931, '1L4R', false],
    ['contemporary', 5, 93, 242.625, 2.681, '5L', false],
    ['contemporary', 5, 93, 242.625, 2.681, '5R', false],
    ['contemporary', 6, 112.125, 290.875, 4.119, '3L3R', false],
    ['contemporary', 6, 112.125, 290.875, 3.306, '4L2R', true],
    ['contemporary', 6, 112.125, 290.875, 3.306, '2L4R', true],
    ['contemporary', 6, 112.125, 290.875, 4.119, '5L1R', false],
    ['contemporary', 6, 112.125, 290.875, 4.119, '1L5R', false],
    ['contemporary', 6, 112.125, 290.875, 2.962, '6L', true],
    ['contemporary', 6, 112.125, 290.875, 2.962, '6R', true],
    ['contemporary', 7, 129.25, 338.875, 3.243, '4L3R', false],
    ['contemporary', 7, 129.25, 338.875, 3.243, '3L4R', false],
    ['contemporary', 7, 129.25, 338.875, 3.243, '5L2R', false],
    ['contemporary', 7, 129.25, 338.875, 3.243, '2L5R', false],
    ['contemporary', 7, 129.25, 338.875, 3.243, '6L1R', false],
    ['contemporary', 7, 129.25, 338.875, 3.243, '1L6R', false],
    ['contemporary', 7, 129.25, 338.875, 2.993, '7L', false],
    ['contemporary', 7, 129.25, 338.875, 2.993, '7R', false],
    ['contemporary', 8, 148.5, 387.25, 3.618, '4L4R', true],
    ['contemporary', 8, 148.5, 387.25, 4.431, '5L3R', false],
    ['contemporary', 8, 148.5, 387.25, 4.431, '3L5R', false],
    ['contemporary', 8, 148.5, 387.25, 3.618, '6L2R', true],
    ['contemporary', 8, 148.5, 387.25, 3.618, '2L6R', true],
    ['contemporary', 8, 148.5, 387.25, 4.431, '7L1R', false],
    ['contemporary', 8, 148.5, 387.25, 4.431, '1L7R', false],
    ['contemporary', 8, 148.5, 387.25, 3.274, '8L', true],
    ['contemporary', 8, 148.5, 387.25, 3.274, '8R', true],
    ['contemporary', 9, 165.625, 435.5, 3.555, '5L4R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '4L5R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '6L3R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '3L6R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '7L2R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '2L7R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '8L1R', false],
    ['contemporary', 9, 165.625, 435.5, 3.555, '1L8R', false],
    ['contemporary', 10, 184.75, 483.875, 4.743, '5L5R', false],
    ['contemporary', 10, 184.75, 483.875, 3.93, '6L4R', true],
    ['contemporary', 10, 184.75, 483.875, 3.93, '4L6R', true],
    ['contemporary', 10, 184.75, 483.875, 4.743, '7L3R', false],
    ['contemporary', 10, 184.75, 483.875, 4.743, '3L7R', false],
    ['contemporary', 10, 184.75, 483.875, 3.93, '8L2R', true],
    ['contemporary', 10, 184.75, 483.875, 3.93, '2L8R', true],
    ['contemporary', 11, 201.875, 531.75, 3.867, '6L5R', false],
    ['contemporary', 11, 201.875, 531.75, 3.867, '5L6R', false],
    ['contemporary', 11, 201.875, 531.75, 3.867, '7L4R', false],
    ['contemporary', 11, 201.875, 531.75, 3.867, '4L7R', false],
    ['contemporary', 11, 201.875, 531.75, 3.867, '8L3R', false],
    ['contemporary', 11, 201.875, 531.75, 3.867, '3L8R', false],
    ['contemporary', 12, 221.125, 576, 4.242, '6L6R', true],
    ['contemporary', 12, 221.125, 576, 5.055, '7L5R', false],
    ['contemporary', 12, 221.125, 576, 5.055, '5L7R', false],
    ['contemporary', 12, 221.125, 576, 4.242, '8L4R', true],
    ['contemporary', 12, 221.125, 576, 4.242, '4L8R', true],
    ['contemporary', 13, 238.25, 576, 4.179, '7L6R', false],
    ['contemporary', 13, 238.25, 576, 4.179, '6L7R', false],
    ['contemporary', 13, 238.25, 576, 4.179, '8L5R', false],
    ['contemporary', 13, 238.25, 576, 4.179, '5L8R', false],
    ['contemporary', 14, 257.375, 576, 5.367, '7L7R', false],
    ['contemporary', 14, 257.375, 576, 4.554, '8L6R', true],
    ['contemporary', 14, 257.375, 576, 4.554, '6L8R', true],
    ['contemporary', 15, 274.5, 576, 4.491, '8L7R', false],
    ['contemporary', 15, 274.5, 576, 4.491, '7L8R', false],
    ['contemporary', 16, 292.875, 576, 4.866, '8L8R', true],
    ['traditional', 2, 38.25, 80.125, 2.338, '2L', true],
    ['traditional', 2, 38.25, 80.125, 2.338, '2R', true],
    ['traditional', 3, 56.625, 119.25, 2.619, '2L1R', false],
    ['traditional', 3, 56.625, 119.25, 2.619, '1L2R', false],
    ['traditional', 3, 56.625, 119.25, 2.369, '3L', false],
    ['traditional', 3, 56.625, 119.25, 2.369, '3R', false],
    ['traditional', 4, 75.875, 158.5, 2.994, '2L2R', true],
    ['traditional', 4, 75.875, 158.5, 3.807, '3L1R', false],
    ['traditional', 4, 75.875, 158.5, 3.807, '1L3R', false],
    ['traditional', 4, 75.875, 158.5, 2.65, '4L', true],
    ['traditional', 4, 75.875, 158.5, 2.65, '4R', true],
    ['traditional', 5, 93, 197.625, 2.931, '3L2R', false],
    ['traditional', 5, 93, 197.625, 2.931, '2L3R', false],
    ['traditional', 5, 93, 197.625, 2.931, '4L1R', false],
    ['traditional', 5, 93, 197.625, 2.931, '1L4R', false],
    ['traditional', 5, 93, 197.625, 2.681, '5L', false],
    ['traditional', 5, 93, 197.625, 2.681, '5R', false],
    ['traditional', 6, 112.125, 236.75, 4.119, '3L3R', false],
    ['traditional', 6, 112.125, 236.75, 3.306, '4L2R', true],
    ['traditional', 6, 112.125, 236.75, 3.306, '2L4R', true],
    ['traditional', 6, 112.125, 236.75, 4.119, '5L1R', false],
    ['traditional', 6, 112.125, 236.75, 4.119, '1L5R', false],
    ['traditional', 6, 112.125, 236.75, 2.962, '6L', true],
    ['traditional', 6, 112.125, 236.75, 2.962, '6R', true],
    ['traditional', 7, 129.25, 275.875, 3.243, '4L3R', false],
    ['traditional', 7, 129.25, 275.875, 3.243, '3L4R', false],
    ['traditional', 7, 129.25, 275.875, 3.243, '5L2R', false],
    ['traditional', 7, 129.25, 275.875, 3.243, '2L5R', false],
    ['traditional', 7, 129.25, 275.875, 3.243, '6L1R', false],
    ['traditional', 7, 129.25, 275.875, 3.243, '1L6R', false],
    ['traditional', 7, 129.25, 275.875, 2.993, '7L', false],
    ['traditional', 7, 129.25, 275.875, 2.993, '7R', false],
    ['traditional', 8, 148.5, 315.125, 3.618, '4L4R', true],
    ['traditional', 8, 148.5, 315.125, 4.431, '5L3R', false],
    ['traditional', 8, 148.5, 315.125, 4.431, '3L5R', false],
    ['traditional', 8, 148.5, 315.125, 3.618, '6L2R', true],
    ['traditional', 8, 148.5, 315.125, 3.618, '2L6R', true],
    ['traditional', 8, 148.5, 315.125, 4.431, '7L1R', false],
    ['traditional', 8, 148.5, 315.125, 4.431, '1L7R', false],
    ['traditional', 8, 148.5, 315.125, 3.274, '8L', true],
    ['traditional', 8, 148.5, 315.125, 3.274, '8R', true],
    ['traditional', 9, 165.625, 354.5, 3.555, '5L4R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '4L5R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '6L3R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '3L6R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '7L2R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '2L7R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '8L1R', false],
    ['traditional', 9, 165.625, 354.5, 3.555, '1L8R', false],
    ['traditional', 10, 184.75, 393.875, 4.743, '5L5R', false],
    ['traditional', 10, 184.75, 393.875, 3.93, '6L4R', true],
    ['traditional', 10, 184.75, 393.875, 3.93, '4L6R', true],
    ['traditional', 10, 184.75, 393.875, 4.743, '7L3R', false],
    ['traditional', 10, 184.75, 393.875, 4.743, '3L7R', false],
    ['traditional', 10, 184.75, 393.875, 3.93, '8L2R', true],
    ['traditional', 10, 184.75, 393.875, 3.93, '2L8R', true],
    ['traditional', 11, 201.875, 432.75, 3.867, '6L5R', false],
    ['traditional', 11, 201.875, 432.75, 3.867, '5L6R', false],
    ['traditional', 11, 201.875, 432.75, 3.867, '7L4R', false],
    ['traditional', 11, 201.875, 432.75, 3.867, '4L7R', false],
    ['traditional', 11, 201.875, 432.75, 3.867, '8L3R', false],
    ['traditional', 11, 201.875, 432.75, 3.867, '3L8R', false],
    ['traditional', 12, 221.125, 472.125, 4.242, '6L6R', true],
    ['traditional', 12, 221.125, 472.125, 5.055, '7L5R', false],
    ['traditional', 12, 221.125, 472.125, 5.055, '5L7R', false],
    ['traditional', 12, 221.125, 472.125, 4.242, '8L4R', true],
    ['traditional', 12, 221.125, 472.125, 4.242, '4L8R', true],
    ['traditional', 13, 238.25, 511.125, 4.179, '7L6R', false],
    ['traditional', 13, 238.25, 511.125, 4.179, '6L7R', false],
    ['traditional', 13, 238.25, 511.125, 4.179, '8L5R', false],
    ['traditional', 13, 238.25, 511.125, 4.179, '5L8R', false],
    ['traditional', 14, 257.375, 550.5, 5.367, '7L7R', false],
    ['traditional', 14, 257.375, 550.5, 4.554, '8L6R', true],
    ['traditional', 14, 257.375, 550.5, 4.554, '6L8R', true],
    ['traditional', 15, 274.5, 576, 4.491, '8L7R', false],
    ['traditional', 15, 274.5, 576, 4.491, '7L8R', false],
    ['traditional', 16, 292.875, 576, 4.866, '8L8R', true],
    ['coastal', 2, 34.375, 98.25, 2.338, '2L', true],
    ['coastal', 2, 34.375, 98.25, 2.338, '2R', true],
    ['coastal', 3, 50.625, 146.25, 2.619, '2L1R', false],
    ['coastal', 3, 50.625, 146.25, 2.619, '1L2R', false],
    ['coastal', 3, 50.625, 146.25, 2.369, '3L', false],
    ['coastal', 3, 50.625, 146.25, 2.369, '3R', false],
    ['coastal', 4, 67.875, 194.625, 2.994, '2L2R', true],
    ['coastal', 4, 67.875, 194.625, 3.807, '3L1R', false],
    ['coastal', 4, 67.875, 194.625, 3.807, '1L3R', false],
    ['coastal', 4, 67.875, 194.625, 2.65, '4L', true],
    ['coastal', 4, 67.875, 194.625, 2.65, '4R', true],
    ['coastal', 5, 83, 242.625, 2.931, '3L2R', false],
    ['coastal', 5, 83, 242.625, 2.931, '2L3R', false],
    ['coastal', 5, 83, 242.625, 2.931, '4L1R', false],
    ['coastal', 5, 83, 242.625, 2.931, '1L4R', false],
    ['coastal', 5, 83, 242.625, 2.681, '5L', false],
    ['coastal', 5, 83, 242.625, 2.681, '5R', false],
    ['coastal', 6, 100.125, 288, 4.119, '3L3R', false],
    ['coastal', 6, 100.125, 288, 3.306, '4L2R', true],
    ['coastal', 6, 100.125, 288, 3.306, '2L4R', true],
    ['coastal', 6, 100.125, 288, 4.119, '5L1R', false],
    ['coastal', 6, 100.125, 288, 4.119, '1L5R', false],
    ['coastal', 6, 100.125, 288, 2.962, '6L', true],
    ['coastal', 6, 100.125, 288, 2.962, '6R', true],
    ['coastal', 7, 115.25, 288, 3.243, '4L3R', false],
    ['coastal', 7, 115.25, 288, 3.243, '3L4R', false],
    ['coastal', 7, 115.25, 288, 3.243, '5L2R', false],
    ['coastal', 7, 115.25, 288, 3.243, '2L5R', false],
    ['coastal', 7, 115.25, 288, 3.243, '6L1R', false],
    ['coastal', 7, 115.25, 288, 3.243, '1L6R', false],
    ['coastal', 7, 115.25, 288, 2.993, '7L', false],
    ['coastal', 7, 115.25, 288, 2.993, '7R', false],
    ['coastal', 8, 132.5, 288, 3.618, '4L4R', true],
    ['coastal', 8, 132.5, 288, 4.431, '5L3R', false],
    ['coastal', 8, 132.5, 288, 4.431, '3L5R', false],
    ['coastal', 8, 132.5, 288, 3.618, '6L2R', true],
    ['coastal', 8, 132.5, 288, 3.618, '2L6R', true],
    ['coastal', 8, 132.5, 288, 4.431, '7L1R', false],
    ['coastal', 8, 132.5, 288, 4.431, '1L7R', false],
    ['coastal', 8, 132.5, 288, 3.274, '8L', true],
    ['coastal', 8, 132.5, 288, 3.274, '8R', true],
    ['coastal', 9, 147.625, 288, 3.555, '5L4R', false],
    ['coastal', 9, 147.625, 288, 3.555, '4L5R', false],
    ['coastal', 9, 147.625, 288, 3.555, '6L3R', false],
    ['coastal', 9, 147.625, 288, 3.555, '3L6R', false],
    ['coastal', 9, 147.625, 288, 3.555, '7L2R', false],
    ['coastal', 9, 147.625, 288, 3.555, '2L7R', false],
    ['coastal', 9, 147.625, 288, 3.555, '8L1R', false],
    ['coastal', 9, 147.625, 288, 3.555, '1L8R', false],
    ['coastal', 10, 164.75, 288, 4.743, '5L5R', false],
    ['coastal', 10, 164.75, 288, 3.93, '6L4R', true],
    ['coastal', 10, 164.75, 288, 3.93, '4L6R', true],
    ['coastal', 10, 164.75, 288, 4.743, '7L3R', false],
    ['coastal', 10, 164.75, 288, 4.743, '3L7R', false],
    ['coastal', 10, 164.75, 288, 3.93, '8L2R', true],
    ['coastal', 10, 164.75, 288, 3.93, '2L8R', true],
    ['coastal', 11, 179.875, 288, 3.867, '6L5R', false],
    ['coastal', 11, 179.875, 288, 3.867, '5L6R', false],
    ['coastal', 11, 179.875, 288, 3.867, '7L4R', false],
    ['coastal', 11, 179.875, 288, 3.867, '4L7R', false],
    ['coastal', 11, 179.875, 288, 3.867, '8L3R', false],
    ['coastal', 11, 179.875, 288, 3.867, '3L8R', false],
    ['coastal', 12, 197.125, 288, 4.242, '6L6R', true],
    ['coastal', 12, 197.125, 288, 5.055, '7L5R', false],
    ['coastal', 12, 197.125, 288, 5.055, '5L7R', false],
    ['coastal', 12, 197.125, 288, 4.242, '8L4R', true],
    ['coastal', 12, 197.125, 288, 4.242, '4L8R', true],
    ['coastal', 13, 212.25, 288, 4.179, '7L6R', false],
    ['coastal', 13, 212.25, 288, 4.179, '6L7R', false],
    ['coastal', 13, 212.25, 288, 4.179, '8L5R', false],
    ['coastal', 13, 212.25, 288, 4.179, '5L8R', false],
    ['coastal', 14, 229.375, 288, 5.367, '7L7R', false],
    ['coastal', 14, 229.375, 288, 4.554, '8L6R', true],
    ['coastal', 14, 229.375, 288, 4.554, '6L8R', true],
    ['coastal', 15, 244.5, 288, 4.491, '8L7R', false],
    ['coastal', 15, 244.5, 288, 4.491, '7L8R', false],
    ['coastal', 16, 260.875, 288, 4.866, '8L8R', true],
  ];

  const minMaxesData = minMaxWidths.map((item) => {
    const minWidth = item[2];
    const maxWidth = item[3];

    const minWidthRO = roundNumber(calculateRoughOpeningWidthFromUnitWidth(Number(minWidth)));
    const maxWidthRO = roundNumber(calculateRoughOpeningWidthFromUnitWidth(Number(maxWidth)));

    const container = {
      panelStyle: String(item[0]),
      numberPanels: Number(item[1]),
      minWidthUnitDimensions: Number(item[2]),
      maxWidthUnitDimensions: Number(item[3]),
      panelWidthAdjustment: Number(item[4]),
      panelConfiguration: String(item[5]),
      showExternalAccessMessage: Boolean(item[6]),
      minWidthRoughOpening: Number(minWidthRO),
      maxWidthRoughOpening: Number(maxWidthRO),
    };

    return container;
  });

  const {
    register,
    handleSubmit,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<CalcForm>({
    mode: 'onChange',
    defaultValues: {
      calculateUsing: 'rough_opening',
      widthFeet: '',
      widthInches: '0',
      widthFractions: '0',
      heightFeet: '',
      heightInches: '0',
      heightFractions: '0',
      sillOptions: 'high_performance',
      numberPanels: '4',
      panelConfiguration: '2L2R',
      insectScreens: 'none',
      screenConfiguration: 'single',
    },
  });

  const resetForm = () => {
    // Reset form fields
    resetField('calculateUsing');
    resetField('widthFeet');
    resetField('widthInches');
    resetField('widthFractions');
    resetField('heightFeet');
    resetField('heightInches');
    resetField('heightFractions');
    resetField('sillOptions');
    resetField('numberPanels');
    resetField('panelConfiguration');
    resetField('insectScreens');
    resetField('screenConfiguration');

    setActiveStep(0);
    setIsCalculated(false);
    setScrollToResults(false);
    setHeightIsValid(true);
    setWidthIsValid(true);
    setShowScreenConfiguration(false);
    setPanelStyle('contemporary');
  };

  // Begin Handle input changes
  const handleCalcUsingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const calcUsingValue = event.target.value;

    setCalcUsingValue(calcUsingValue);
    setFormUpdated(true);
  };

  const handleNumberPanelsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const numberPanelsValue = event.target.value;

    setNumberPanels(numberPanelsValue);
    setFormUpdated(true);
  };

  const handlePanelConfigurationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const panelConfigurationValue = event.target.value;

    setPanelConfiguration(panelConfigurationValue);
    setFormUpdated(true);
  };

  const handleSillOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const sillOptionText = event.target[event.target.selectedIndex].innerHTML;
    const sillOptionValue = event.target.value;
    const showSillOption = sillOptionValue !== 'flush';

    setSillOptionText(sillOptionText);
    setSillOption(sillOptionValue);
    setShowSillDepth(showSillOption);
    setFormUpdated(true);
  };

  const handleDimensionInputChange = (
    event: FormEvent<HTMLInputElement>,
    inputDirection: string
  ) => {
    if (inputDirection === 'width') {
      onDimensionFieldChange(
        inputDirection,
        event.currentTarget.value,
        getValues('widthInches'),
        getValues('widthFractions')
      );
    } else if (inputDirection === 'height') {
      onDimensionFieldChange(
        inputDirection,
        event.currentTarget.value,
        getValues('heightInches'),
        getValues('heightFractions')
      );
    }
  };

  const handleDimensionSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    inputDirection: string,
    inputType: string
  ) => {
    if (inputDirection === 'width') {
      if (inputType === 'inches') {
        onDimensionFieldChange(
          inputDirection,
          getValues('widthFeet'),
          event.target.value,
          getValues('widthFractions')
        );
      } else if (inputType === 'fractions') {
        onDimensionFieldChange(
          inputDirection,
          getValues('widthFeet'),
          getValues('widthInches'),
          event.target.value
        );
      }
    } else if (inputDirection === 'height') {
      if (inputType === 'inches') {
        onDimensionFieldChange(
          inputDirection,
          getValues('heightFeet'),
          event.target.value,
          getValues('heightFractions')
        );
      } else if (inputType === 'fractions') {
        onDimensionFieldChange(
          inputDirection,
          getValues('heightFeet'),
          getValues('heightInches'),
          event.target.value
        );
      }
    }
  };

  const onDimensionFieldChange = (
    inputType: string,
    feet: string,
    inches: string,
    frac: string
  ) => {
    if (feet.length > 0 || inches !== '0' || frac !== '0') {
      const length = Number(feet) * 12 + Number(inches) + Number(frac);

      if (inputType === 'width') {
        setWidthLength(length);
      } else if (inputType === 'height') {
        setHeightLength(length);
      }
    }
    setFormUpdated(true);
  };

  const handleInsectScreensChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const insectScreenValue = event.target.value;
    const insectScreenText = event.target[event.target.selectedIndex].innerHTML;

    setInsectScreenValue(insectScreenValue);
    setInsectScreenText(insectScreenText);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    insectScreenValue === 'none'
      ? setShowScreenConfiguration(false)
      : setShowScreenConfiguration(true);

    setFormUpdated(true);
  };

  const handleScreenConfigurationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setScreenConfigurationText(event.target[event.target.selectedIndex].innerHTML);
    setFormUpdated(true);
  };

  // End Handle input changes

  const clearCalculations = () => {
    setRoughOpeningWidth('-');
    setRoughOpeningHeight('-');
    setUnitWidth('-');
    setUnitHeight('-');
    setPanelWidth('-');
    setPanelHeight('-');
    setFrameDepth('-');
    setPanelThickness('-');
    setStileWidth('-');
    setSillDepth('-');
    setScreenRoughOpeningWidth('-');
    setScreenRoughOpeningHeight('-');
    setScreenUnitSizeWidth('-');
    setScreenUnitSizeHeight('-');
  };

  const onSubmit = () => {
    let frameDepthFormatted = '';
    let frameDepthRounded = 0;
    let panelHeight = '';
    let panelThicknessFormatted = '';
    let panelThicknessRounded = 0;
    let panelWidth = '';
    let roughOpeningHeight = '';
    let roughOpeningWidth = '';
    let screenRoughOpeningWidth = '';
    let screenRoughOpeningHeight = '';
    let screenUnitSizeWidth = '';
    let screenUnitSizeHeight = '';
    let sillDepthFormatted = '';
    let sillDepthRounded = 0;
    let stileWidthFormatted = '';
    let stileWidthRounded = 0;
    let unitWidth = '';
    let unitHeight = '';

    switch (calcUsingValue) {
      case 'rough_opening':
        roughOpeningWidth = widthLength.toString();
        roughOpeningHeight = heightLength.toString();

        unitWidth = calculateUnitWidthFromRoughOpeningWidth(widthLength).toString();
        unitHeight = calculateUnitHeightFromRoughOpeningHeight(heightLength).toString();

        break;
      case 'unit_dimensions':
        unitWidth = widthLength.toString();
        unitHeight = heightLength.toString();

        roughOpeningWidth = calculateRoughOpeningWidthFromUnitWidth(widthLength).toString();
        roughOpeningHeight = calculateRoughOpeningHeightFromUnitHeight(heightLength).toString();

        break;
    }

    // Panel Width
    panelWidth = calculatePanelWidth(Number(unitWidth), panelStyle, panelConfiguration);

    // Panel Height
    if (sillOption === 'high_performance') {
      panelHeight = (Number(unitHeight) - 4.343).toString();
    } else if (sillOption === 'low_profile') {
      panelHeight = (Number(unitHeight) - 3.843).toString();
    } else if (sillOption === 'flush') {
      panelHeight = (Number(unitHeight) - 3.343).toString();
    }

    // Panel Thickness
    if (panelStyle === 'contemporary' || panelStyle === 'coastal') {
      panelThicknessFormatted = '2 1/4"';
      panelThicknessRounded = 2.25;
    } else if (panelStyle === 'traditional') {
      panelThicknessFormatted = '1 3/4"';
      panelThicknessRounded = 1.75;
    }

    // Stile Width
    if (panelStyle === 'contemporary') {
      stileWidthFormatted = '3 11/16"';
      stileWidthRounded = 3.6875;
    } else if (panelStyle === 'traditional') {
      stileWidthFormatted = '4 11/16"';
      stileWidthRounded = 4.6875;
    } else if (panelStyle === 'coastal') {
      stileWidthFormatted = '3 7/8"';
      stileWidthRounded = 3.875;
    }

    // Sill Depth
    if (insectScreenValue === 'none') {
      if (sillOption === 'high_performance') {
        sillDepthFormatted = '8 3/32"';
        sillDepthRounded = 8.09375;
      } else if (sillOption === 'flush') {
        sillDepthFormatted = '-';
      } else if (sillOption === 'low_profile') {
        sillDepthFormatted = '6 9/16"';
        sillDepthRounded = 6.5625;
      }
    } else if (insectScreenValue === 'retractable') {
      // Sill Depth + 3 1/2"
      if (sillOption === 'high_performance') {
        sillDepthFormatted = '11 19/32"';
        sillDepthRounded = 8.09375 + 3.5;
      } else if (sillOption === 'flush') {
        sillDepthFormatted = '-';
      } else if (sillOption === 'low_profile') {
        sillDepthFormatted = '10 1/16"';
        sillDepthRounded = 6.5625 + 3.5;
      }
    }

    // Frame Depth
    if (insectScreenValue === 'none') {
      frameDepthFormatted = '6 9/16"';
      frameDepthRounded = 6.5625;
    } else if (insectScreenValue == 'retractable') {
      // Frame Depth + 3 1/2"
      frameDepthFormatted = '10 1/16"';
      frameDepthRounded = 6.5625 + 3.5;
    }

    // Screen Unit Size and Screen Rough Opening Size
    if (insectScreenValue === 'retractable') {
      screenUnitSizeWidth = (Number(unitWidth) + 6.64).toString();
      screenRoughOpeningWidth = (Number(unitWidth) + 7.39).toString();

      if (sillOption == 'high_performance') {
        screenUnitSizeHeight = (Number(unitHeight) - 0.203).toString();
        screenRoughOpeningHeight = (Number(unitHeight) + 0.75).toString();
      } else if (sillOption == 'low_profile' || sillOption == 'flush') {
        screenUnitSizeHeight = (Number(unitHeight) + 1.731).toString();
        screenRoughOpeningHeight = (Number(screenUnitSizeHeight) + 0.75).toString();
      }
    }

    if (
      panelStyle === 'coastal' &&
      maxCoastalPanelAreaExceeded(Number(panelWidth), Number(panelHeight))
    ) {
      setMaxPanelAreaExceeded(true);
      setIsCalculated(false);
    } else {
      setMaxPanelAreaExceeded(false);

      setRoughOpeningHeight(formatNumber(Number(roughOpeningHeight)));
      setRoughOpeningWidth(formatNumber(Number(roughOpeningWidth)));
      setUnitHeight(formatNumber(Number(unitHeight)));
      setUnitWidth(formatNumber(Number(unitWidth)));
      setPanelHeight(formatNumber(Number(panelHeight)));
      setPanelWidth(formatNumber(Number(panelWidth)));
      setFrameDepth(formatOutput(frameDepthFormatted, frameDepthRounded));
      setPanelThickness(formatOutput(panelThicknessFormatted, panelThicknessRounded));
      setStileWidth(formatOutput(stileWidthFormatted, stileWidthRounded));
      setSillDepth(formatOutput(sillDepthFormatted, sillDepthRounded));
      setScreenRoughOpeningHeight(formatNumber(Number(screenRoughOpeningHeight)));
      setScreenRoughOpeningWidth(formatNumber(Number(screenRoughOpeningWidth)));
      setScreenUnitSizeHeight(formatNumber(Number(screenUnitSizeHeight)));
      setScreenUnitSizeWidth(formatNumber(Number(screenUnitSizeWidth)));

      setIsCalculated(true);
      setScrollToResults(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    insectScreenValue === 'none'
      ? setShowScreenConfiguration(false)
      : setShowScreenConfiguration(true);
  }, [insectScreenValue]);

  useEffect(() => {
    const updateScreenConfiguration = () => {
      const width = widthLength;

      let screenUnitSizeWidth = 0;
      let unitWidth = 0;

      switch (calcUsingValue) {
        case 'rough_opening':
          unitWidth = calculateUnitWidthFromRoughOpeningWidth(width);

          break;
        case 'unit_dimensions':
          unitWidth = width;

          break;
      }

      screenUnitSizeWidth = Number(unitWidth) + 6.64;

      // Check if Double Screen max is exceeded
      if (screenUnitSizeWidth > 354.842) {
        setInsectScreenOptions([{ value: 'none', text: 'None' }]);
        resetField('insectScreens', { defaultValue: 'none' });
        setInsectScreenValue('none');
        setInsectScreenText('None');
      } else {
        setInsectScreenOptions([
          { value: 'none', text: 'None' },
          { value: 'retractable', text: 'Retractable' },
        ]);
      }

      // Check if Single Screen max is exceeded
      if (screenUnitSizeWidth > 181.535) {
        setScreenConfigOptions([{ value: 'double', text: 'Double Screen' }]);
      } else {
        setScreenConfigOptions([
          { value: 'single', text: 'Single Screen' },
          { value: 'double', text: 'Double Screen' },
        ]);
      }
    };

    const updateForm = () => {
      // Reset valid flags
      setHeightIsValid(true);
      setWidthIsValid(true);

      // Used within the function
      let heightValid = true;
      let widthValid = true;

      // Do some validation for screen max widths
      updateScreenConfiguration();

      // Min/Max Height
      if (heightLength > 0) {
        let minHeight = 0;

        if (panelStyle === 'contemporary') {
          minHeight = 41.375;
        } else if (panelStyle === 'traditional') {
          minHeight = 36.25;
        } else if (panelStyle === 'coastal') {
          minHeight = 41.875;
        }

        let maxHeight = 119.5;

        switch (calcUsingValue) {
          case 'rough_opening':
            minHeight = calculateRoughOpeningHeightFromUnitHeight(Number(minHeight));
            maxHeight = calculateRoughOpeningHeightFromUnitHeight(Number(maxHeight));
            break;
          case 'unit_dimentsion':
            // min/max are defined in unit dimensions
            break;
        }

        if (heightLength > 0) {
          if (Number(heightLength) < roundNumber(minHeight)) {
            const minFormatted = convertToFeetInchesAndFraction(
              minHeight,
              AWNumberUtil.roundingDirections.up
            );

            heightValid = false;
            setErrorMsgHeight(
              'Please enter a value greater than or equal to ' + minFormatted + '.'
            );
          } else if (heightLength > roundNumber(maxHeight)) {
            const maxFormatted = convertToFeetInchesAndFraction(
              maxHeight,
              AWNumberUtil.roundingDirections.down
            );

            heightValid = false;
            setErrorMsgHeight('Please enter a value less than or equal to ' + maxFormatted + '.');
          }
        }
      }

      // Min/Max Width
      let minWidthRow: MinMaxes;
      let maxWidthRow: MinMaxes;
      let minWidth = 0;
      let maxWidth = 0;
      let currentNumberPanels = numberPanels;

      const minMaxRows = minMaxesData.filter((row) => row.panelStyle === panelStyle);

      if (minMaxRows.length > 0) {
        switch (calcUsingValue) {
          case 'rough_opening':
            minWidthRow = minMaxRows.reduce(
              (total, currentValue) =>
                total.minWidthRoughOpening < currentValue.minWidthRoughOpening
                  ? total
                  : currentValue,
              minMaxRows[0] // initial value
            );

            maxWidthRow = minMaxRows.reduce(
              (total, currentValue) =>
                total.maxWidthRoughOpening > currentValue.maxWidthRoughOpening
                  ? total
                  : currentValue,
              minMaxRows[0] // initial value
            );

            minWidth = minWidthRow.minWidthRoughOpening;
            maxWidth = maxWidthRow.maxWidthRoughOpening;
            break;

          case 'unit_dimensions':
            minWidthRow = minMaxRows.reduce(
              (total, currentValue) =>
                total.minWidthUnitDimensions < currentValue.minWidthUnitDimensions
                  ? total
                  : currentValue,
              minMaxRows[0] // initial value
            );

            maxWidthRow = minMaxRows.reduce(
              (total, currentValue) =>
                total.maxWidthUnitDimensions > currentValue.maxWidthUnitDimensions
                  ? total
                  : currentValue,
              minMaxRows[0] // initial value
            );

            minWidth = minWidthRow.minWidthUnitDimensions;
            maxWidth = maxWidthRow.maxWidthUnitDimensions;
            break;
        }

        if (widthLength < roundNumber(minWidth) && widthLength > 0) {
          const minFormatted = convertToFeetInchesAndFraction(
            minWidth,
            AWNumberUtil.roundingDirections.up
          );

          widthValid = false;
          setErrorMsgWidth('Please enter a value greater than or equal to ' + minFormatted + '.');
        } else if (widthLength > roundNumber(maxWidth) && widthLength > 0) {
          const maxFormatted = convertToFeetInchesAndFraction(
            maxWidth,
            AWNumberUtil.roundingDirections.down
          );

          widthValid = false;
          setErrorMsgWidth('Please enter a value less than or equal to ' + maxFormatted + '.');
        }
      }

      // Update number of panels dropdown
      // Default to all valid options for our combination
      let numberPanelRows = minMaxesData.filter((row) => row.panelStyle === panelStyle);

      // If we have a valid width, then filter further
      if (widthValid && widthLength > 0) {
        switch (calcUsingValue) {
          case 'rough_opening':
            numberPanelRows = numberPanelRows.filter(
              (row) =>
                row.minWidthRoughOpening <= widthLength && row.maxWidthRoughOpening >= widthLength
            );

            break;
          case 'unit_dimensions':
            numberPanelRows = numberPanelRows.filter(
              (row) =>
                row.minWidthUnitDimensions <= widthLength &&
                row.maxWidthUnitDimensions >= widthLength
            );

            break;
        }
      }

      // Coastal - only show # of panels options with showExternalAccessMessage is true when height is under 79.25
      const coastalExteriorAccesMinHeight = 79.25;

      if (heightValid && panelStyle === 'coastal') {
        if (heightLength < coastalExteriorAccesMinHeight) {
          numberPanelRows = numberPanelRows.filter((row) => row.showExternalAccessMessage === true);
        }
      }

      // Get unique values for the numberPanels
      const numberPanelOptions = [...new Set(numberPanelRows.map((item) => item.numberPanels))];

      // Create the number of panels option list
      const numberPanelOptionList: SelectOptions[] = numberPanelOptions.map((item) => {
        return {
          value: item.toString(),
          text: item.toString(),
        };
      });

      // See if the selected option is in the list
      currentNumberPanels = numberPanelOptions.includes(Number(numberPanels))
        ? numberPanels
        : numberPanelOptionList[0].value;

      setNumberPanelsOptions(numberPanelOptionList);
      setNumberPanels(currentNumberPanels);
      resetField('numberPanels', { defaultValue: currentNumberPanels });

      // Update panel configuration dropdown
      // Default to all valid options for our combination
      let panelConfigurationRows = minMaxesData.filter(
        (row) => row.numberPanels === Number(currentNumberPanels) && row.panelStyle === panelStyle
      );

      //Coastal - only show panel configurations with showExternalAccessMessage is true when heightis under 79.25
      if (heightValid && panelStyle === 'coastal') {
        if (heightLength < coastalExteriorAccesMinHeight) {
          panelConfigurationRows = panelConfigurationRows.filter(
            (row) => row.showExternalAccessMessage === true
          );
        }
      }

      // Get unique values for the panelConfiguration
      const panelConfigurationOptions = [
        ...new Map(
          panelConfigurationRows.map((item) => [item.panelConfiguration, item.panelConfiguration])
        ).values(),
      ];

      // Create the number of panels option list
      const panelConfigurationOptionList: SelectOptions[] = panelConfigurationOptions.map(
        (item) => {
          return {
            value: item.toString(),
            text: item.toString(),
          };
        }
      );

      // See if the selected option is in the list
      const currentPanelConfiguration = panelConfigurationOptions.includes(panelConfiguration)
        ? panelConfiguration
        : panelConfigurationOptionList[0].value;

      setPanelConfigurationOptions(panelConfigurationOptionList);
      setPanelConfiguration(currentPanelConfiguration);
      resetField('panelConfiguration', { defaultValue: currentPanelConfiguration });

      // External Access Message
      const currentConfigurationRows = minMaxesData.filter(
        (row) => row.panelConfiguration === panelConfiguration && row.panelStyle === panelStyle
      );

      if (currentConfigurationRows.length > 0) {
        if (currentConfigurationRows[0].showExternalAccessMessage) {
          setShowExternalAccessMessage(true);
        } else {
          setShowExternalAccessMessage(false);
        }
      } else {
        setShowExternalAccessMessage(false);
      }

      setIsCalculated(false);
      setHeightIsValid(heightValid);
      setWidthIsValid(widthValid);

      clearCalculations();
    };
    const slickList = document.querySelector('.slick-list');
    if (slickList && slickList instanceof HTMLElement) {
      slickList.style.height = 'auto';
    }
    if (currentPanelStyle !== panelStyle) {
      updateForm();
      setCurrentPanelStyle(panelStyle);
      setFormUpdated(false);
    }

    if (formUpdated) {
      updateForm();
      setFormUpdated(false);
    }

    if (scrollToResults) {
      const elem = document.getElementById('resultsDiv');
      const sy = window.scrollY;
      let y =
        elem?.getBoundingClientRect().top === undefined
          ? 0
          : elem?.getBoundingClientRect().top + sy;

      if (currentScreenWidth <= getBreakpoint('ml')) {
        //account for nav bar height
        y = y - 59;
      }

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });

      setScrollToResults(false);
    }
  }, [
    calcUsingValue,
    currentPanelStyle,
    currentScreenWidth,
    formUpdated,
    heightIsValid,
    heightLength,
    insectScreenValue,
    isCalculated,
    minMaxesData,
    numberPanels,
    panelConfiguration,
    panelStyle,
    resetField,
    scrollToResults,
    setIsCalculated,
    showExternalAccessMessage,
    widthIsValid,
    widthLength,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classNames('col-span-12')}>
        <div>
          <div
            className={classNames(
              'mb-8 flex w-full justify-center md:mb-0',
              isCalculated ? 'block' : 'hidden'
            )}
          >
            <button
              type="button"
              onClick={resetForm}
              className="flex w-full items-center justify-start whitespace-nowrap font-sans text-text-link font-demi text-theme-text hover:underline hover:decoration-secondary hover:underline-offset-8 disabled:border-gray disabled:text-gray md:ml-0 md:w-fit md:justify-end md:px-0"
            >
              <span className="flex items-center">
                Start over
                <SvgIcon className="ml-xxs" icon="reset" />
              </span>
            </button>
          </div>
          <div
            className={classNames(
              'mb-6 hidden font-sans text-s font-heavy leading-[30px] md:block',
              isCalculated ? 'mt-6' : 'mt-[22px]'
            )}
          >
            Step Two: Enter Size Information
          </div>
          <div className={themeData.classes.formWrapper}>
            <div className={themeData.classes.columnSpan2}>
              <label className={themeData.classes.labelClass} htmlFor="calculateUsing">
                Calculate using known
              </label>
              <select
                disabled={activeStep !== 1}
                id="calculateUsing"
                className={themeData.classes.selectColumnSpan2}
                {...register('calculateUsing')}
                onChange={handleCalcUsingChange}
              >
                <option value="rough_opening">Rough Opening</option>
                <option value="unit_dimensions">Unit Dimensions</option>
              </select>
              <div className={themeData.classes.labelClass}>
                <a
                  tabIndex={activeStep === 1 ? 0 : -1}
                  className={themeData.classes.modalLinkButton}
                  href={props.fields?.measurementsExplainedPDFLink?.value.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.fields?.measurementsExplainedPDFLink?.value.text}
                </a>
              </div>
            </div>
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="widthFeet">
                Width*
              </label>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 mml:col-span-2">
                  <input
                    disabled={activeStep !== 1}
                    id="widthFeet"
                    type="text"
                    placeholder="Feet"
                    maxLength={25}
                    onBlurCapture={(e) => handleDimensionInputChange(e, 'width')}
                    className={`${
                      errors.widthFeet || widthIsValid === false
                        ? themeData.classes.errorInvalid
                        : themeData.classes.errorValid
                    }`}
                    {...register('widthFeet', {
                      required: 'This field is required.',
                      pattern: {
                        value: /^(\d*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/,
                        message: 'Please enter a valid number.',
                      },
                    })}
                  ></input>
                </div>
                <div className="col-span-2 mml:col-span-1">
                  <select
                    disabled={activeStep !== 1}
                    className={
                      errors.widthInches || widthIsValid === false
                        ? themeData.classes.errorInvalid
                        : themeData.classes.selectColumnSpan1
                    }
                    {...register('widthInches')}
                    name="widthInches"
                    defaultValue="0"
                    onChange={(e) => handleDimensionSelectChange(e, 'width', 'inches')}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                  </select>
                </div>
                <div className="col-span-2 mml:col-span-1">
                  <select
                    disabled={activeStep !== 1}
                    className={
                      errors.widthFractions || widthIsValid === false
                        ? themeData.classes.errorInvalid
                        : themeData.classes.selectColumnSpan1
                    }
                    {...register('widthFractions')}
                    name="widthFractions"
                    defaultValue="0"
                    onChange={(e) => handleDimensionSelectChange(e, 'width', 'fractions')}
                  >
                    <option value="0">0</option>
                    <option value="0.125">1 / 8</option>
                    <option value="0.25">1 / 4</option>
                    <option value="0.375">3 / 8</option>
                    <option value="0.5">1 / 2</option>
                    <option value="0.625">5 / 8</option>
                    <option value="0.75">3 / 4</option>
                    <option value="0.875">7 / 8</option>
                  </select>
                </div>
              </div>
              {errors.widthFeet && (
                <div className="text-body text-error">{errors.widthFeet.message}</div>
              )}
              {widthIsValid === false && (
                <div className="text-body text-error">{errorMsgWidth}</div>
              )}
            </div>
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="heightFeet">
                Height*
              </label>
              <div className="grid grid-cols-4 gap-4 ">
                <div className="col-span-4 mml:col-span-2">
                  <input
                    disabled={activeStep !== 1}
                    id="heightFeet"
                    type="text"
                    placeholder="Height"
                    maxLength={25}
                    onBlurCapture={(e) => handleDimensionInputChange(e, 'height')}
                    className={`${
                      errors.heightFeet || heightIsValid === false
                        ? themeData.classes.errorInvalid
                        : themeData.classes.errorValid
                    }`}
                    {...register('heightFeet', {
                      required: 'This field is required.',
                      pattern: {
                        value: /^(?:\d+(\.\d+)?|\.\d+)$/,
                        message: 'Please enter a valid number.',
                      },
                    })}
                  ></input>
                </div>
                <div className="col-span-2 mml:col-span-1">
                  <select
                    disabled={activeStep !== 1}
                    className={
                      errors.heightInches || heightIsValid === false
                        ? themeData.classes.errorInvalid
                        : themeData.classes.selectColumnSpan1
                    }
                    {...register('heightInches')}
                    name="heightInches"
                    defaultValue="0"
                    onChange={(e) => handleDimensionSelectChange(e, 'height', 'inches')}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                  </select>
                </div>
                <div className="col-span-2 mml:col-span-1">
                  <select
                    disabled={activeStep !== 1}
                    className={
                      errors.heightFractions || heightIsValid === false
                        ? themeData.classes.errorInvalid
                        : themeData.classes.selectColumnSpan1
                    }
                    {...register('heightFractions')}
                    name="heightFractions"
                    defaultValue="0"
                    onChange={(e) => handleDimensionSelectChange(e, 'height', 'fractions')}
                  >
                    <option value="0">0</option>
                    <option value="0.125">1 / 8</option>
                    <option value="0.25">1 / 4</option>
                    <option value="0.375">3 / 8</option>
                    <option value="0.5">1 / 2</option>
                    <option value="0.625">5 / 8</option>
                    <option value="0.75">3 / 4</option>
                    <option value="0.875">7 / 8</option>
                  </select>
                </div>
              </div>
              {errors.heightFeet && (
                <div className="text-body text-error">{errors.heightFeet.message}</div>
              )}
              {heightIsValid === false && (
                <div className="text-body text-error">{errorMsgHeight}</div>
              )}
            </div>
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="sillOptions">
                Sill Options
              </label>
              <select
                disabled={activeStep !== 1}
                id="sillOptions"
                className={themeData.classes.selectColumnSpan1}
                {...register('sillOptions')}
                onChange={handleSillOptionChange}
              >
                {/* Set Sill Options based on panel Style */}
                {(panelStyle === 'contemporary' || panelStyle === 'traditional') &&
                  sillOptions.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.text}
                      </option>
                    );
                  })}
                {panelStyle === 'coastal' &&
                  sillOptionsCoastal.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.text}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="numberPanels">
                # of panels
              </label>
              <select
                disabled={activeStep !== 1}
                id="numberPanels"
                className={themeData.classes.selectColumnSpan1}
                {...register('numberPanels')}
                onChange={handleNumberPanelsChange}
              >
                {numberPanelsOptions.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  );
                })}
              </select>
              {maxPanelAreaExceeded && (
                <div className="text-body text-error">
                  The options you selected exceed the maximum panel area allowed.
                </div>
              )}
            </div>
            <div className={themeData.classes.columnSpan2}>
              <label className={themeData.classes.labelClass} htmlFor="panelConfiguration">
                Panel Configuration
              </label>
              <select
                disabled={activeStep !== 1}
                id="panelConfiguration"
                className={themeData.classes.selectColumnSpan2}
                {...register('panelConfiguration')}
                onChange={handlePanelConfigurationChange}
              >
                {panelConfigurationOptions.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="insectScreens">
                Insect Screens
              </label>
              <select
                disabled={activeStep !== 1}
                id="insectScreens"
                className={themeData.classes.selectColumnSpan1}
                {...register('insectScreens')}
                onChange={handleInsectScreensChange}
              >
                {insectScreenOptions.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              className={classNames(
                themeData.classes.columnSpan1,
                showScreenConfiguration ? '' : 'hidden'
              )}
            >
              <label className={themeData.classes.labelClass} htmlFor="screenConfiguration">
                Screen Configuration
              </label>
              <select
                disabled={activeStep !== 1}
                id="screenConfiguration"
                className={themeData.classes.selectColumnSpan1}
                {...register('screenConfiguration')}
                onChange={handleScreenConfigurationChange}
              >
                {screenConfigOptions.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {activeStep === 1 && <StepButtons />}
        </div>
      </form>

      {/* Results output */}
      {isCalculated && (
        <div className="col-span-12">
          <div
            id="resultsDiv"
            className="col-span-12 mt-10 flex flex-row items-center justify-between"
          >
            <div className="mb-s font-sans text-s font-heavy leading-[30px] text-theme-text last:mb-0">
              <h2>Results:</h2>
            </div>
            <div className="mb-s hidden items-end pr-2 ml:relative ml:block">
              <button
                type="button"
                className={themeData.classes.printButton}
                onClick={reactToPrintFn}
              >
                <span className="mr-xxs text-darkprimary">
                  <SvgIcon icon="print" />
                </span>
                {'Print'}
              </button>
              <div ref={componentRef}></div>
            </div>
          </div>
          <div
            className={themeData.classes.resultsOutputWrapper}
            id="resultsOutput"
            ref={componentRef}
          >
            <div className={themeData.classes.printHeaderDiv}>
              <h2>Folding Outswing Door Sizing Calculator</h2>
            </div>
            <div className={themeData.classes.columnSpan1}>
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full pb-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    {/* Options Selected Table */}
                    <table className="min-w-full font-sans text-sm font-light">
                      <thead className={themeData.classes.tableHead}>
                        <tr>
                          <th colSpan={2} scope="col" className={themeData.classes.thLeft}>
                            Options Selected
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Panel Style</td>
                          <td className={themeData.classes.tdColumnLeft}>{panelStyleText}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}># of Panels</td>
                          <td className={themeData.classes.tdColumnLeft}>{numberPanels}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Panel Configuration</td>
                          <td className={themeData.classes.tdColumnLeft}>{panelConfiguration}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Sill Options</td>
                          <td className={themeData.classes.tdColumnLeft}>{sillOptionText}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Insect Screens</td>
                          <td className={themeData.classes.tdColumnLeft}>{insectScreenText}</td>
                        </tr>
                        {showScreenConfiguration && (
                          <tr className={themeData.classes.tableRow}>
                            <td className={themeData.classes.tdColumn}>Screen Configuration</td>
                            <td className={themeData.classes.tdColumnLeft}>
                              {screenConfigurationText}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {showExternalAccessMessage && (
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <div className={themeData.classes.warningMessage}>
                        {props.fields?.externalAccessMessage.value}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={themeData.classes.columnSpan1}>
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full pb-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    {/* Calculated Dimensions Table */}
                    <table className="min-w-full font-sans text-sm font-light ">
                      <thead className={themeData.classes.tableHead}>
                        <tr>
                          <th scope="col" className={themeData.classes.thLeft}>
                            Calculated Dimensions
                          </th>
                          <th scope="col" className={themeData.classes.thLeft}>
                            Width
                          </th>
                          <th scope="col" className={themeData.classes.thLeft}>
                            Height
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Rough Opening</td>
                          <td className={themeData.classes.tdColumnLeft}>{roughOpeningWidth}</td>
                          <td className={themeData.classes.tdColumnLeft}>{roughOpeningHeight}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Unit Size</td>
                          <td className={themeData.classes.tdColumnLeft}>{unitWidth}</td>
                          <td className={themeData.classes.tdColumnLeft}>{unitHeight}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Panel Size</td>
                          <td className={themeData.classes.tdColumnLeft}>{panelWidth}</td>
                          <td className={themeData.classes.tdColumnLeft}>{panelHeight}</td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Frame Depth</td>
                          <td colSpan={2} className={themeData.classes.tdColumnLeft}>
                            {frameDepth}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Panel Thickness</td>
                          <td colSpan={2} className={themeData.classes.tdColumnLeft}>
                            {panelThickness}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Stile Width</td>
                          <td colSpan={2} className={themeData.classes.tdColumnLeft}>
                            {stileWidth}
                          </td>
                        </tr>
                        {showSillDepth && (
                          <tr className={themeData.classes.tableRow}>
                            <td className={themeData.classes.tdColumn}>Sill Depth</td>
                            <td colSpan={2} className={themeData.classes.tdColumnLeft}>
                              {sillDepth}
                            </td>
                          </tr>
                        )}
                        {showScreenConfiguration && (
                          <>
                            <tr className={themeData.classes.tableRow}>
                              <td className={themeData.classes.tdColumn}>Screen Rough Opening</td>
                              <td className={themeData.classes.tdColumnLeft}>
                                {screenRoughOpeningWidth}
                              </td>
                              <td className={themeData.classes.tdColumnLeft}>
                                {screenRoughOpeningHeight}
                              </td>
                            </tr>
                            <tr className={themeData.classes.tableRow}>
                              <td className={themeData.classes.tdColumn}>Screen Unit Size</td>
                              <td className={themeData.classes.tdColumnLeft}>
                                {screenUnitSizeWidth}
                              </td>
                              <td className={themeData.classes.tdColumnLeft}>
                                {screenUnitSizeHeight}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className={themeData.classes.sitePrepGuideDiv}>
              <div className="mb-6 grow font-sans text-s font-heavy md:mb-0 md:text-m">
                <h2>Preparing for installation?</h2>
              </div>
              <div className="md:pl-6 md:pr-2">
                <a
                  href={props.fields?.sitePrepGuideLink?.value.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    type="button"
                    className={`${themeData.classes.submitButton} flex items-center`}
                  >
                    <span className="flex items-center">
                      Download site prep guide
                      <SvgIcon className="ml-xxs" icon="download" />
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
