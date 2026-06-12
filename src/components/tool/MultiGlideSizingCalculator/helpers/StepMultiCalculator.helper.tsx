import classNames from 'classnames';
import clsx from 'clsx';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ModalWrapper from 'helpers/ModalWrapper/ModalWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowLeft } from 'react-icons/fi';
import { IoMdDownload } from 'react-icons/io';
import { useReactToPrint } from 'react-to-print';
import * as AWNumberUtil from 'src/lib/utils/number-utils/aw-number-utils';

import CalculatorResult from './CalculatorResult.helper';
import { MIN_MAX_WIDTHS, OPTIONS } from './Constant.helper';
import { MultiGlideSizingCalculatorTheme } from './MultiGlideSizingCalculator.theme';
type CalcForm = {
  calculateUsing: string; //known_size
  width: string; //ew
  widthInches: string;
  widthFraction: string;
  height: string; //eh
  heightInches: string;
  heightFraction: string;
  stackingDirection: string;
  sillOption: string;
  sillRamp: string;
  panelNumber: string;
  insectScreen: string;
  screenConfiguration: string;
  panelStackingLocation: string;
  thicknessFinishedFloorInches: string;
  thicknessFinishedFloorFraction: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const StepMultiCalculation = (props: any): JSX.Element => {
  const { themeData } = useTheme(MultiGlideSizingCalculatorTheme());
  const { fields, formData } = props;
  const isEE = useExperienceEditor();

  const table1Ref = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef: table1Ref,
  });
  const selectedPanelStyle = useMemo(() => formData?.selectedPanelStyle, [formData]);
  const panelStyle = selectedPanelStyle?.name;
  const selectedConfigurationOption = useMemo(
    () => formData?.selectedConfigurationOption,
    [formData]
  );
  const configuration = selectedConfigurationOption?.value;

  const singleScreenMaxWidth = 181.5;
  const doubleScreenMaxWidth = 354.813;

  //Modal settings
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  // Submit and update shared variables
  const [widthStates, setWidthStates] = useState({
    feet: 0,
    inches: 0,
    fraction: 0,
    msg: '',
    dimension: 0,
  });
  const [heightStates, setHeightStates] = useState({
    feet: 0,
    inches: 0,
    fraction: 0,
    msg: '',
    dimension: 0,
  });
  const [thicknessFinishedFloorStates, setThicknessFinishedFloorStates] = useState({
    inches: 0,
    fraction: 0,
    dimension: 0,
  });

  const [msgWidth, setMsgWidth] = useState('');
  const [msgHeight, setMsgHeight] = useState('');

  const [formStates, setFormStates] = useState({
    calculateUsing: 'rough_opening',
    width: '',
    widthInches: '0',
    widthFraction: '0',
    height: '',
    heightInches: '0',
    heightFraction: '0',
    stackingDirection: 'one_direction',
    sillOption: 'onfloor_drainage',
    sillRamp: 'none',
    insectScreen: 'none',
    screenConfiguration: 'single',
    panelStackingLocation: 'interior',
    thicknessFinishedFloor: '',
  });

  const [selectedPanelNumber, setSelectedPanelNumber] = useState(1);
  const [clearOpeningHeight, setClearOpeningHeight] = useState<string>('');
  const [clearOpeningWidth, setClearOpeningWidth] = useState<string>('');
  const [numberPanelList, setNumberPanelList] = useState([2, 3, 4, 5, 6]);
  const [jambDepth, setJambDepth] = useState<string>('');
  const [panelHeight, setPanelHeight] = useState<string>('');
  const [panelWidth, setPanelWidth] = useState<string>('');
  const [pocketDepth, setPocketDepth] = useState<string>('');
  const [pocketWidth, setPocketWidth] = useState<string>('');
  const [roughOpeningHeightSubfloor, setRoughOpeningHeightSubfloor] = useState<string>('');
  const [roughOpeningHeightRecess, setRoughOpeningHeightRecess] = useState<string>('');
  const [roughPocketWidth, setRoughPocketWidth] = useState<string>('');
  const [roughOpeningWidth, setRoughOpeningWidth] = useState<string>('');
  const [roughOpeningPocketWidth, setRoughOpeningPocketWidth] = useState<string>('');
  const [screenRoughOpeningWidth, setScreenRoughOpeningWidth] = useState<string>('');
  const [screenRoughOpeningHeight, setScreenRoughOpeningHeight] = useState<string>('');
  const [screenUnitSizeWidth, setScreenUnitSizeWidth] = useState<string>('');
  const [screenUnitSizeHeight, setScreenUnitSizeHeight] = useState<string>('');
  const [sillDepth, setSillDepth] = useState<string>('');
  const [unitHeight, setUnitHeight] = useState<string>('');
  const [unitWidth, setUnitWidth] = useState<string>('');
  const [thicknessFinishedFloor, setThicknessFinishedFloor] = useState('');

  const [screenConfigurationOption, setScreenConfigurationOption] = useState('both');
  const [isShowResults, setIsShowResults] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    resetField,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CalcForm>({
    mode: 'onChange',
    defaultValues: {
      calculateUsing: 'rough_opening',
      width: '',
      widthInches: '0',
      widthFraction: '0',
      height: '',
      heightInches: '0',
      heightFraction: '0',
      stackingDirection: 'one_direction',
      sillOption: 'onfloor_drainage',
      sillRamp: 'none',
      insectScreen: 'none',
      screenConfiguration: 'single',
      panelNumber: '4',
      panelStackingLocation: 'interior',
      thicknessFinishedFloorInches: '0',
      thicknessFinishedFloorFraction: '0',
    },
  });

  useEffect(() => {
    if (errors.width?.type === 'required') {
      setMsgWidth('This field is required');
    }

    if (errors.height?.type === 'required') {
      setMsgHeight('This field is required');
    }
  }, [errors]);

  useEffect(() => {
    const slickList = document.querySelector('.slick-list');
    if (slickList && slickList instanceof HTMLElement) {
      slickList.style.height = 'auto';
    }
  }, []);

  const clearCalculations = () => {
    setJambDepth('-');
    setPanelHeight('-');
    setPanelWidth('-');
    setPocketDepth('-');
    setPocketWidth('-');
    setRoughOpeningWidth('-');
    setRoughOpeningHeightSubfloor('-');
    setRoughOpeningHeightRecess('-');
    setSillDepth('-');
    setUnitWidth('-');
    setUnitHeight('-');
  };

  const openModal = (index: number) => {
    setIsLightboxVisible(true);
    setCurrentImageIndex(index);
  };

  const resetForm = () => {
    //Clear results table
    setJambDepth('-');
    setPanelHeight('-');
    setPanelWidth('-');
    setPocketDepth('-');
    setPocketWidth('-');
    setRoughOpeningWidth('-');
    setRoughOpeningHeightSubfloor('-');
    setRoughOpeningHeightRecess('-');
    setSillDepth('-');
    setUnitWidth('-');
    setUnitHeight('-');

    // Reset form fields
    resetField('calculateUsing');
    resetField('stackingDirection');
    resetField('sillOption');
    resetField('sillRamp');
    resetField('panelNumber');
    resetField('panelStackingLocation');
    resetField('width');
    resetField('widthInches');
    resetField('widthFraction');
    resetField('height');
    resetField('heightInches');
    resetField('heightFraction');
    resetField('insectScreen');
    resetField('screenConfiguration');
    resetField('thicknessFinishedFloorFraction');
    resetField('thicknessFinishedFloorFraction');

    setWidthStates({
      feet: 0,
      inches: 0,
      fraction: 0,
      msg: '',
      dimension: 0,
    });
    setHeightStates({
      feet: 0,
      inches: 0,
      fraction: 0,
      msg: '',
      dimension: 0,
    });
    setThicknessFinishedFloorStates({
      inches: 0,
      fraction: 0,
      dimension: 0,
    });

    setNumberPanelList([2, 3, 4, 5, 6]);
    setMsgWidth('');
    setMsgHeight('');

    props.onResetForm();
    props.onStepChange(0);

    setIsShowResults(false);
  };

  const calculateInsectScreenWidth = (
    configuration: string,
    stackingDirection: string,
    unitWidth: any,
    roughOpeningPocketWidth: any
  ) => {
    let screenUnitSizeWidth = 0;
    const unitWidthNum = Number(unitWidth);
    const roughOpeningPocketWidthNum = Number(roughOpeningPocketWidth);

    // Screen Unit Width
    if (configuration === 'stacking') {
      if (stackingDirection === 'one_direction') {
        screenUnitSizeWidth = unitWidthNum + 1.517 + 2.265;
      } else if (stackingDirection === 'two_direction') {
        screenUnitSizeWidth = unitWidthNum + 2.265 + 2.265;
      }
    } else if (stackingDirection === 'one_direction') {
      // Pocketing
      screenUnitSizeWidth = roughOpeningPocketWidthNum + 0.844 + 2.255;
    } else if (stackingDirection === 'two_direction') {
      screenUnitSizeWidth = roughOpeningPocketWidthNum + 2.255 + 2.255;
    }

    return screenUnitSizeWidth;
  };

  const calculateRoughOpeningHeights = (
    height: number,
    sillOptions: string,
    thicknessFinishedFloor: number
  ) => {
    if (sillOptions === 'flush') {
      const roughOpeningHeight = height + 1.5 - thicknessFinishedFloor;
      return {
        roughOpeningHeight,
        roughOpeningHeightRecess: roughOpeningHeight,
        roughOpeningHeightSubfloor: height,
      };
    } else {
      return {
        roughOpeningHeight: height,
        roughOpeningHeightRecess: 'N/A',
        roughOpeningHeightSubfloor: height,
      };
    }
  };

  const calculateSubfloorAndRecessHeights = (
    roughOpeningHeight: number,
    sillOptions: string,
    thicknessFinishedFloor: number
  ) => {
    if (sillOptions === 'flush') {
      return {
        roughOpeningHeightRecess: roughOpeningHeight,
        roughOpeningHeightSubfloor: roughOpeningHeight - 1.5 + thicknessFinishedFloor,
      };
    } else {
      return {
        roughOpeningHeightRecess: 'N/A',
        roughOpeningHeightSubfloor: roughOpeningHeight,
      };
    }
  };

  const calculateUnitDimensions = () => {
    const { calculateUsing, sillOption: sillOptions, stackingDirection } = formStates;
    const thicknessFinishedFloor = thicknessFinishedFloorStates.dimension;
    const numberPanels = selectedPanelNumber;

    const { dimension: width }: any = widthStates;
    const { dimension: height }: any = heightStates;

    let clearOpeningWidth: any = 0;
    let clearOpeningHeight: any = 0;
    let roughOpeningHeight: any = 0;
    let roughOpeningHeightSubfloor: any = 0;
    let roughOpeningHeightRecess: any = 0;
    let roughOpeningPocketWidth: any = 0;
    let roughOpeningWidth: any = 0;
    let unitWidth: any = 0;
    let unitHeight: any = 0;

    // Panel Overlap
    const panelOverlap: any = calculatePanelOverlap(panelStyle);

    // The excel document uses Unit Height for the Height input, but different values for the Width input:
    // Pocketing -> Rough Opening w/o Pocket
    // Stacking  -> Unit
    if (configuration === 'pocketing') {
      switch (calculateUsing) {
        case 'rough_opening': {
          roughOpeningWidth = Number(width);

          const roughHeights1 = calculateRoughOpeningHeights(
            Number(height),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeight = roughHeights1.roughOpeningHeight;
          roughOpeningHeightRecess = roughHeights1.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = roughHeights1.roughOpeningHeightSubfloor;

          roughOpeningPocketWidth = pocketing_calculateRoughOpeningPocketWidthFromRoughOpeningWidth(
            Number(roughOpeningWidth),
            stackingDirection,
            Number(numberPanels),
            Number(panelOverlap)
          );

          unitWidth = calculateUnitWidthFromRoughOpeningWidth(roughOpeningWidth);
          unitHeight = calculateUnitHeightFromRoughOpeningHeight(roughOpeningHeight, sillOptions);

          clearOpeningWidth = calculateClearOpeningWidthFromInputWidth(
            roughOpeningPocketWidth,
            configuration,
            stackingDirection,
            Number(numberPanels),
            panelOverlap,
            panelStyle
          );
          clearOpeningHeight = calculateClearOpeningHeightFromUnitHeight(
            Number(unitHeight),
            sillOptions
          );

          break;
        }
        case 'rough_opening_pocket': {
          roughOpeningPocketWidth = Number(width);

          const roughHeights2 = calculateRoughOpeningHeights(
            Number(height),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeight = roughHeights2.roughOpeningHeight;
          roughOpeningHeightRecess = roughHeights2.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = roughHeights2.roughOpeningHeightSubfloor;

          roughOpeningWidth = pocketing_calculateRoughOpeningWidthFromRoughOpeningPocketWidth(
            roughOpeningPocketWidth,
            stackingDirection,
            Number(numberPanels),
            panelOverlap
          );

          unitWidth = calculateUnitWidthFromRoughOpeningWidth(Number(roughOpeningWidth));
          unitHeight = calculateUnitHeightFromRoughOpeningHeight(
            Number(roughOpeningHeight),
            sillOptions
          );
          clearOpeningWidth = calculateClearOpeningWidthFromInputWidth(
            roughOpeningPocketWidth,
            configuration,
            stackingDirection,
            Number(numberPanels),
            panelOverlap,
            panelStyle
          );
          clearOpeningHeight = calculateClearOpeningHeightFromUnitHeight(
            Number(unitHeight),
            sillOptions
          );

          break;
        }
        case 'clear_opening': {
          clearOpeningWidth = Number.parseFloat(width);
          clearOpeningHeight = Number.parseFloat(height);

          roughOpeningPocketWidth = calculateInputWidthFromClearOpeningWidth(
            clearOpeningWidth,
            configuration,
            stackingDirection,
            numberPanels,
            panelOverlap,
            panelStyle
          );
          roughOpeningWidth = pocketing_calculateRoughOpeningWidthFromRoughOpeningPocketWidth(
            roughOpeningPocketWidth,
            stackingDirection,
            numberPanels,
            panelOverlap
          );
          unitWidth = calculateUnitWidthFromRoughOpeningWidth(roughOpeningWidth);

          unitHeight = calculateUnitHeightFromClearOpeningHeight(clearOpeningHeight, sillOptions);
          roughOpeningHeight = calculateRoughOpeningHeightFromUnitHeight(unitHeight, sillOptions);

          const subfloorHeights1 = calculateSubfloorAndRecessHeights(
            Number(roughOpeningHeight),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeightRecess = subfloorHeights1.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = subfloorHeights1.roughOpeningHeightSubfloor;

          break;
        }
        case 'unit_dimensions': {
          unitWidth = Number.parseFloat(width);
          unitHeight = Number.parseFloat(height);

          roughOpeningWidth = calculateRoughOpeningWidthFromUnitWidth(unitWidth);
          roughOpeningHeight = calculateRoughOpeningHeightFromUnitHeight(unitHeight, sillOptions);

          const subfloorHeights2 = calculateSubfloorAndRecessHeights(
            Number(roughOpeningHeight),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeightRecess = subfloorHeights2.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = subfloorHeights2.roughOpeningHeightSubfloor;

          roughOpeningPocketWidth = pocketing_calculateRoughOpeningPocketWidthFromRoughOpeningWidth(
            roughOpeningWidth,
            stackingDirection,
            Number(numberPanels),
            panelOverlap
          );

          clearOpeningWidth = calculateClearOpeningWidthFromInputWidth(
            roughOpeningPocketWidth,
            configuration,
            stackingDirection,
            Number(numberPanels),
            panelOverlap,
            panelStyle
          );
          clearOpeningHeight = calculateClearOpeningHeightFromUnitHeight(
            Number(unitHeight),
            sillOptions
          );

          break;
        }
      }
    } else {
      // Stacking
      roughOpeningPocketWidth = 'N/A';

      switch (calculateUsing) {
        case 'rough_opening': {
          roughOpeningWidth = Number(width);

          const roughHeights3 = calculateRoughOpeningHeights(
            Number(height),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeight = roughHeights3.roughOpeningHeight;
          roughOpeningHeightRecess = roughHeights3.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = roughHeights3.roughOpeningHeightSubfloor;

          unitWidth = calculateUnitWidthFromRoughOpeningWidth(roughOpeningWidth);
          unitHeight = calculateUnitHeightFromRoughOpeningHeight(roughOpeningHeight, sillOptions);

          clearOpeningWidth = calculateClearOpeningWidthFromInputWidth(
            unitWidth,
            configuration,
            stackingDirection,
            Number(numberPanels),
            panelOverlap,
            panelStyle
          );
          clearOpeningHeight = calculateClearOpeningHeightFromUnitHeight(
            Number(unitHeight),
            sillOptions
          );
          break;
        }
        case 'clear_opening': {
          clearOpeningWidth = Number.parseFloat(width);
          clearOpeningHeight = Number.parseFloat(height);

          unitWidth = calculateInputWidthFromClearOpeningWidth(
            clearOpeningWidth,
            configuration,
            stackingDirection,
            Number(numberPanels),
            panelOverlap,
            panelStyle
          );
          unitHeight = calculateUnitHeightFromClearOpeningHeight(
            Number(clearOpeningHeight),
            sillOptions
          );

          roughOpeningWidth = calculateRoughOpeningWidthFromUnitWidth(unitWidth);
          roughOpeningHeight = calculateRoughOpeningHeightFromUnitHeight(unitHeight, sillOptions);

          const subfloorHeights3 = calculateSubfloorAndRecessHeights(
            Number(roughOpeningHeight),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeightRecess = subfloorHeights3.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = subfloorHeights3.roughOpeningHeightSubfloor;

          break;
        }
        case 'unit_dimensions': {
          unitWidth = Number.parseFloat(width);
          unitHeight = Number.parseFloat(height);

          roughOpeningWidth = calculateRoughOpeningWidthFromUnitWidth(unitWidth);
          roughOpeningHeight = calculateRoughOpeningHeightFromUnitHeight(unitHeight, sillOptions);

          const subfloorHeights4 = calculateSubfloorAndRecessHeights(
            Number(roughOpeningHeight),
            sillOptions,
            Number(thicknessFinishedFloor)
          );
          roughOpeningHeightRecess = subfloorHeights4.roughOpeningHeightRecess;
          roughOpeningHeightSubfloor = subfloorHeights4.roughOpeningHeightSubfloor;

          clearOpeningWidth = calculateClearOpeningWidthFromInputWidth(
            unitWidth,
            configuration,
            stackingDirection,
            numberPanels,
            panelOverlap,
            panelStyle
          );
          clearOpeningHeight = calculateClearOpeningHeightFromUnitHeight(unitHeight, sillOptions);

          break;
        }
      }
    }

    return {
      unitWidth: unitWidth,
      unitHeight: unitHeight,
      roughOpeningWidth: roughOpeningWidth,
      roughOpeningHeight: roughOpeningHeight,
      roughOpeningHeightRecess: roughOpeningHeightRecess,
      roughOpeningHeightSubfloor: roughOpeningHeightSubfloor,
      roughOpeningPocketWidth: roughOpeningPocketWidth,
      clearOpeningWidth: clearOpeningWidth,
      clearOpeningHeight: clearOpeningHeight,
    };
  };

  // Rough Opening Width => Unit Width
  const calculateUnitWidthFromRoughOpeningWidth = (roughOpeningWidth: number) => {
    return roughOpeningWidth - 1;
  };

  // Rough Opening Height => Unit Height
  const calculateUnitHeightFromRoughOpeningHeight = (
    roughOpeningHeight: number,
    sillOptions: string
  ) => {
    if (sillOptions === 'flush') {
      return Number(roughOpeningHeight) - 0.75;
    } else {
      // onfloor_drainage
      return Number(roughOpeningHeight) - 0.5;
    }
  };

  // Unit Width => Rough Opening Width
  const calculateRoughOpeningWidthFromUnitWidth = (unitWidth: number) => {
    return unitWidth + 1;
  };

  // Unit Height => Rough Opening Height
  const calculateRoughOpeningHeightFromUnitHeight = (unitHeight: number, sillOptions: string) => {
    if (sillOptions === 'flush') {
      return Number(unitHeight) + 0.75;
    } else {
      // onfloor_drainage
      return Number(unitHeight) + 0.5;
    }
  };

  // Rough Opening with out Pocket Width => Rough Opening Width
  const pocketing_calculateRoughOpeningPocketWidthFromRoughOpeningWidth = (
    roughOpeningPocketWidth: number,
    stackingDirection: string,
    numberPanels: any,
    panelOverlap: number
  ) => {
    if (stackingDirection === 'one_direction') {
      return (
        (roughOpeningPocketWidth +
          (4.375 - panelOverlap * (numberPanels - 1)) / numberPanels -
          4.125) /
        (1 + 1 / numberPanels)
      );
    } else {
      // two_direction
      return (
        (roughOpeningPocketWidth +
          ((4.224 - panelOverlap * (numberPanels - 2)) * 2) / numberPanels -
          8.25) /
        (1 + 2 / numberPanels)
      );
    }
  };

  // Rough Opening Width => Rough Opening with out Pocket Width
  const pocketing_calculateRoughOpeningWidthFromRoughOpeningPocketWidth = (
    roughOpeningWidth: number,
    stackingDirection: string,
    numberPanels: any,
    panelOverlap: number
  ) => {
    if (stackingDirection === 'one_direction') {
      return (
        roughOpeningWidth * (1 + 1 / numberPanels) -
        (4.375 - panelOverlap * (numberPanels - 1)) / numberPanels +
        4.125
      );
    } else {
      // two_direction
      return (
        roughOpeningWidth * (1 + 2 / numberPanels) -
        ((4.224 - panelOverlap * (numberPanels - 2)) * 2) / numberPanels +
        8.25
      );
    }
  };

  // Clear Opening Height => Unit Height
  const calculateUnitHeightFromClearOpeningHeight = (
    clearOpeningHeight: number,
    sillOptions: string
  ) => {
    if (isOnFloorDrainage(sillOptions)) {
      return clearOpeningHeight + 3.363;
    } else {
      // flush
      return clearOpeningHeight + 3.863;
    }
  };

  // Unit Height => Clear Opening Height
  const calculateClearOpeningHeightFromUnitHeight = (unitHeight: any, sillOptions: string) => {
    if (isOnFloorDrainage(sillOptions)) {
      return Number.parseFloat(unitHeight) - 3.363;
    } else {
      // flush
      return Number.parseFloat(unitHeight) - 3.863;
    }
  };

  // Input Width => Clear Opening Width
  // Pocketing -> Rough Opening with out Pocket Width => Clear Opening Width
  // Stacking  -> Unit Width => Clear Opening Width
  const calculateClearOpeningWidthFromInputWidth = (
    inputWidth: any,
    configuration: string,
    stackingDirection: string,
    numberPanels: any,
    panelOverlap: any,
    panelStyle: string
  ) => {
    const inputWidthNum = Number.parseFloat(inputWidth);
    const numberPanelsNum = Number.parseFloat(numberPanels);
    const panelOverlapNum = Number.parseFloat(panelOverlap);

    if (configuration === 'stacking') {
      const panelStyleOffset = panelStyle === 'contemporary_ccp' ? 5.805 : 4.788;

      if (stackingDirection === 'one_direction') {
        const panelCalc =
          (inputWidthNum - 4.25 + panelOverlapNum * (numberPanelsNum - 1)) / numberPanelsNum;
        return inputWidthNum - panelCalc - panelStyleOffset;
      } else {
        // two_direction
        const panelCalc =
          (inputWidthNum - 4.974 + panelOverlapNum * (numberPanelsNum - 2)) / numberPanelsNum;
        const twoDirectionOffset = panelStyle === 'contemporary_ccp' ? 6.539 : 5.522;
        return inputWidthNum - 2 * panelCalc - twoDirectionOffset;
      }
    } else if (stackingDirection === 'one_direction') {
      // pocketing
      const offset = panelStyle === 'contemporary_ccp' ? 5.476 : 5.187;
      return inputWidthNum - offset;
    } else if (numberPanels === 2) {
      // pocketing, two_direction
      return inputWidthNum - 5.772;
    } else if (panelStyle === 'contemporary_ccp') {
      // pocketing, two_direction, more than two
      return inputWidthNum - 5.432;
    } else {
      // pocketing, two_direction, more than two, contemporary_cap or traditional
      return inputWidthNum - 5.171;
    }
  };

  // Clear Opening Width => Input Width
  // Pocketing -> Clear Opening Width => Rough Opening with out Pocket Width
  // Stacking  -> Clear Opening Width => Unit Width
  const calculateInputWidthFromClearOpeningWidth = (
    clearOpeningWidth: any,
    configuration: string,
    stackingDirection: string,
    numberPanels: any,
    panelOverlap: any,
    panelStyle: string
  ) => {
    const clearOpeningWidthNum = Number.parseFloat(clearOpeningWidth);
    const numberPanelsNum = Number.parseInt(numberPanels);
    const panelOverlapNum = Number.parseFloat(panelOverlap);

    if (configuration === 'stacking') {
      const panelStyleOffset = panelStyle === 'contemporary_ccp' ? 5.805 : 4.788;

      if (stackingDirection === 'one_direction') {
        return (
          ((clearOpeningWidthNum + panelStyleOffset) * numberPanelsNum -
            4.25 +
            panelOverlapNum * (numberPanelsNum - 1)) /
          (numberPanelsNum - 1)
        );
      } else {
        // stacking, two_direction
        const twoDirectionOffset = panelStyle === 'contemporary_ccp' ? 6.539 : 5.522;
        return (
          ((clearOpeningWidthNum + twoDirectionOffset) * numberPanelsNum -
            9.948 +
            2 * panelOverlapNum * (numberPanelsNum - 2)) /
          (numberPanelsNum - 2)
        );
      }
    } else if (stackingDirection === 'one_direction') {
      const offset = panelStyle === 'contemporary_ccp' ? 5.476 : 5.187;
      return clearOpeningWidthNum + offset;
    } else if (numberPanelsNum === 2) {
      // pocketing configuration, two_direction
      return clearOpeningWidthNum + 5.772;
    } else if (panelStyle === 'contemporary_ccp') {
      // pocketing configuration, two_direction, more than two
      return clearOpeningWidthNum + 5.432;
    } else {
      // pocketing configuration, two_direction, more than two, contemporary_cap or traditional
      return clearOpeningWidthNum + 5.171;
    }
  };

  // Input Width => Panel Width
  // Pocketing -> Rough Opening with out Pocket Width => Panel Width
  // Stacking  -> Unit Width => Panel Width
  const calculatePanelWidth = (
    inputWidth: any,
    configuration: string,
    stackingDirection: string,
    numberPanels: any,
    panelOverlap: any
  ) => {
    const inputWidthNum = Number.parseFloat(inputWidth);
    const numberPanelsNum = Number.parseInt(numberPanels);
    const panelOverlapNum = Number.parseFloat(panelOverlap);
    let panelWidth;

    if (configuration === 'stacking') {
      if (stackingDirection === 'one_direction') {
        panelWidth =
          (inputWidthNum - 4.25 + panelOverlapNum * (numberPanelsNum - 1)) / numberPanelsNum;
      } else {
        // two_direction
        panelWidth =
          (inputWidthNum - 4.974 + panelOverlapNum * (numberPanelsNum - 2)) / numberPanelsNum;
      }
    } else if (stackingDirection === 'one_direction') {
      // pocketing
      panelWidth =
        (inputWidthNum - 4.375 + panelOverlapNum * (numberPanelsNum - 1)) / numberPanelsNum;
    } else {
      // pocketing, two_direction
      panelWidth =
        (inputWidthNum - 4.224 + panelOverlapNum * (numberPanelsNum - 2)) / numberPanelsNum;
    }
    return AWNumberUtil.truncate(panelWidth, 3);
  };

  // Panel Overlap
  const calculatePanelOverlap = (panelStyle: string) => {
    if (panelStyle === 'traditional') {
      return 4.345;
    } else if (panelStyle === 'contemporary_cap') {
      return 2.75;
    } else if (panelStyle === 'contemporary_ccp') {
      return 2.187;
    } else {
      return 0;
    }
  };

  const roundNumber = (number: number) => {
    if (!isNaN(+number)) {
      return Number(number.toFixed(3));
    } else {
      return number;
    }
  };

  const convertToFeetInchesAndFraction = (number: number, roundingDirection: any) => {
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

  const formatNumber = (number: any) => {
    if (!isNaN(+number)) {
      const rounded = AWNumberUtil.roundToEigth(number, AWNumberUtil.roundingDirections.closest);
      const mm = rounded * 25.4;
      const formatted = convertToFeetInchesAndFraction(
        rounded,
        AWNumberUtil.roundingDirections.closest
      );
      return formatted + '<br>' + ' (' + String(mm.toFixed(3)) + 'mm)';
    } else {
      return String(number);
    }
  };
  const isOnFloorDrainage = (sillType: string) => {
    return sillType === 'onfloor_drainage' || sillType === 'onfloor_drainage_raised_threshold';
  };

  const calculateJambDepthOneDirection = (
    insectScreens: string,
    numberPanels: number,
    configuration: string
  ) => {
    if (insectScreens === 'none') {
      return numberPanels * 2.5 + 0.389;
    } else if (insectScreens === 'single') {
      return (numberPanels + 1) * 2.5 + 0.389;
    } else if (insectScreens === 'multi') {
      if (configuration === 'pocketing') {
        return numberPanels * 2 * 2.5 + 0.389;
      } else {
        return (numberPanels * 2 - 1) * 2.5 + 0.389;
      }
    } else if (insectScreens === 'retractable') {
      return numberPanels * 2.5 + 0.389 + 3.5;
    }
    return 0;
  };

  const calculateJambDepthTwoDirection = (
    insectScreens: string,
    numberPanels: number,
    configuration: string
  ) => {
    if (insectScreens === 'none') {
      return (numberPanels / 2) * 2.5 + 0.389;
    } else if (insectScreens === 'single') {
      if (configuration === 'pocketing') {
        return (numberPanels / 2 + 1) * 2.5 + 0.389;
      } else {
        return '-';
      }
    } else if (insectScreens === 'multi') {
      if (configuration === 'pocketing') {
        return numberPanels * 2.5 + 0.389;
      } else {
        return (numberPanels - 1) * 2.5 + 0.389;
      }
    } else if (insectScreens === 'retractable') {
      return (numberPanels / 2) * 2.5 + 0.389 + 3.5;
    }
    return 0;
  };

  const calculateJambDepth = (
    stackingDirection: string,
    insectScreens: string,
    numberPanels: number,
    configuration: string
  ) => {
    if (stackingDirection === 'one_direction') {
      return calculateJambDepthOneDirection(insectScreens, numberPanels, configuration);
    } else {
      return calculateJambDepthTwoDirection(insectScreens, numberPanels, configuration);
    }
  };

  const calculateSillDepth = (sillOptions: string, sillRamps: string, jambDepth: any) => {
    if (sillOptions === 'flush') {
      return 'N/A';
    }

    switch (sillRamps) {
      case 'none':
        return jambDepth + 0.75;
      case 'interior':
        return jambDepth + 1.4;
      case 'exterior':
        return jambDepth + 2.053;
      case 'both':
        return jambDepth + 3.453;
      default:
        return jambDepth;
    }
  };

  const calculatePocketDepthOneDirection = (insectScreens: string, numberPanels: number) => {
    if (insectScreens === 'none') {
      if (numberPanels === 1) {
        return (numberPanels + 1) * 2.5 + 1.938;
      } else {
        return numberPanels * 2.5 + 1.938;
      }
    } else if (insectScreens === 'single') {
      return (numberPanels + 1) * 2.5 + 1.938;
    } else if (insectScreens === 'multi') {
      return numberPanels * 2 * 2.5 + 1.938;
    }
    return 0;
  };

  const calculatePocketDepthTwoDirection = (insectScreens: string, numberPanels: number) => {
    if (insectScreens === 'none') {
      if (numberPanels === 2) {
        return numberPanels * 2.5 + 1.938;
      } else {
        return (numberPanels / 2) * 2.5 + 1.938;
      }
    } else if (insectScreens === 'single') {
      return (numberPanels / 2 + 1) * 2.5 + 1.938;
    } else if (insectScreens === 'multi') {
      return numberPanels * 2.5 + 1.938;
    }
    return 0;
  };

  const calculatePocketDepth = (
    configuration: string,
    stackingDirection: string,
    insectScreens: string,
    numberPanels: number
  ) => {
    if (configuration !== 'pocketing') {
      return 'N/A';
    }

    if (stackingDirection === 'one_direction') {
      return calculatePocketDepthOneDirection(insectScreens, numberPanels);
    } else {
      return calculatePocketDepthTwoDirection(insectScreens, numberPanels);
    }
  };

  const calculateScreenUnitHeight = (
    insectScreens: string,
    sillOptions: string,
    sillRamps: string,
    unitHeight: number
  ) => {
    if (insectScreens !== 'retractable') {
      return undefined;
    }

    if (sillOptions === 'onfloor_drainage_raised_threshold') {
      return unitHeight + 0.81;
    } else if (sillOptions === 'onfloor_drainage') {
      if (sillRamps === 'interior' || sillRamps === 'both') {
        return unitHeight + 0.81;
      } else if (sillRamps === 'none' || sillRamps === 'exterior') {
        return unitHeight + 0.81 + 0.973;
      }
    } else if (sillRamps === 'none') {
      return unitHeight + 0.81 + 0.473;
    }
    return undefined;
  };

  const calculatePanelDimensions = (params: {
    configuration: string;
    sillOptions: string;
    roughOpeningPocketWidth: string;
    unitWidth: string;
    unitHeight: string;
    stackingDirection: string;
    numberPanels: number;
    panelOverlap: number;
  }): { panelWidth: any; panelHeight: any } => {
    const {
      configuration,
      sillOptions,
      roughOpeningPocketWidth,
      unitWidth,
      unitHeight,
      stackingDirection,
      numberPanels,
      panelOverlap,
    } = params;

    let panelWidth: any;
    let panelHeight: any;

    if (configuration === 'pocketing') {
      panelWidth = calculatePanelWidth(
        Number.parseFloat(roughOpeningPocketWidth),
        configuration,
        stackingDirection,
        numberPanels,
        panelOverlap
      );
    } else {
      // Stacking
      panelWidth = calculatePanelWidth(
        Number.parseFloat(unitWidth),
        configuration,
        stackingDirection,
        numberPanels,
        panelOverlap
      );
    }

    if (sillOptions === 'flush') {
      panelHeight = AWNumberUtil.truncate(Number.parseFloat(unitHeight) - 3.644, 3);
    } else {
      // onfloor_drainage
      panelHeight = AWNumberUtil.truncate(Number.parseFloat(unitHeight) - 3.144, 3);
    }

    return { panelWidth, panelHeight };
  };

  const calculatePocketWidths = (
    configuration: string,
    panelWidth: number
  ): { roughPocketWidth: any; pocketWidth: any } => {
    let roughPocketWidth: any;
    let pocketWidth: any;

    if (configuration === 'pocketing') {
      roughPocketWidth = Number(panelWidth) + 4.125;
      pocketWidth = Number(panelWidth) + 5.5;
    } else {
      // Stacking
      roughPocketWidth = 'N/A';
      pocketWidth = 'N/A';
    }

    return { roughPocketWidth, pocketWidth };
  };

  const calculateScreenRoughOpenings = (
    insectScreens: string,
    screenUnitSizeWidth: number,
    screenUnitSizeHeight: number | undefined
  ): { screenRoughOpeningWidth: any; screenRoughOpeningHeight: any } => {
    let screenRoughOpeningWidth: any;
    let screenRoughOpeningHeight: any;

    if (insectScreens === 'retractable') {
      screenRoughOpeningWidth = screenUnitSizeWidth + 0.5 + 0.5;
      if (screenUnitSizeHeight !== undefined) {
        screenRoughOpeningHeight = screenUnitSizeHeight + 0.5;
      }
    }

    return { screenRoughOpeningWidth, screenRoughOpeningHeight };
  };

  const onSubmit = (data: CalcForm) => {
    if (widthStates.feet === 0) {
      setMsgWidth('This field is requied');
    }

    if (heightStates.feet === 0) {
      setMsgHeight('This field is requied');
    }

    if (msgWidth !== '' || msgHeight !== '' || widthStates.feet === 0 || heightStates.feet === 0) {
      setIsShowResults(false);
      return;
    }

    const jsonData = JSON.stringify(data, null, 2);
    const jsonObj = JSON.parse(jsonData);
    const insectScreens = jsonObj.insectScreen;
    const numberPanels = Number(jsonObj.panelNumber);
    const sillOptions = jsonObj.sillOption;
    const sillRamps = jsonObj.sillRamp;
    const stackingDirection = jsonObj.stackingDirection;
    const thicknessFinishedFloor_temp =
      Number.parseFloat(jsonObj.thicknessFinishedFloorInches) +
      Number.parseFloat(jsonObj.thicknessFinishedFloorFraction);

    // Panel Overlap
    const panelOverlap = calculatePanelOverlap(panelStyle);

    const unitDimensions = calculateUnitDimensions();

    const unitWidth_temp = unitDimensions.unitWidth;
    const unitHeight_temp = unitDimensions.unitHeight;
    const roughOpeningWidth_temp = unitDimensions.roughOpeningWidth;
    const roughOpeningHeightRecess_temp = unitDimensions.roughOpeningHeightRecess;
    const roughOpeningHeightSubfloor_temp = unitDimensions.roughOpeningHeightSubfloor;
    const roughOpeningPocketWidth_temp = unitDimensions.roughOpeningPocketWidth;
    const clearOpeningWidth_temp = unitDimensions.clearOpeningWidth;
    const clearOpeningHeight_temp: any = unitDimensions.clearOpeningHeight;

    // Calculate Jamb Depth
    const jambDepth_temp = calculateJambDepth(
      stackingDirection,
      insectScreens,
      numberPanels,
      configuration
    );

    // Calculate Sill Depth
    const sillDepth_temp = calculateSillDepth(sillOptions, sillRamps, jambDepth_temp);

    // Calculate Panel Dimensions
    const panelDimensions = calculatePanelDimensions({
      configuration,
      sillOptions,
      roughOpeningPocketWidth: roughOpeningPocketWidth_temp,
      unitWidth: unitWidth_temp,
      unitHeight: unitHeight_temp,
      stackingDirection,
      numberPanels,
      panelOverlap,
    });
    const panelWidth_temp = panelDimensions.panelWidth;
    const panelHeight_temp = panelDimensions.panelHeight;

    // Calculate Pocket Widths
    const pocketWidths = calculatePocketWidths(configuration, panelWidth_temp);
    const roughPocketWidth_temp = pocketWidths.roughPocketWidth;
    const pocketWidth_temp = pocketWidths.pocketWidth;

    // Calculate Pocket Depth
    const pocketDepth_temp = calculatePocketDepth(
      configuration,
      stackingDirection,
      insectScreens,
      numberPanels
    );

    // Screen Unit Width
    const screenUnitSizeWidth_temp = calculateInsectScreenWidth(
      configuration,
      stackingDirection,
      Number.parseFloat(unitWidth_temp),
      Number.parseFloat(roughOpeningPocketWidth_temp)
    );

    // Calculate Screen Unit Height
    const screenUnitSizeHeight_temp = calculateScreenUnitHeight(
      insectScreens,
      sillOptions,
      sillRamps,
      Number(unitHeight_temp)
    );

    // Calculate Screen Rough Openings
    const screenRoughOpenings = calculateScreenRoughOpenings(
      insectScreens,
      screenUnitSizeWidth_temp,
      screenUnitSizeHeight_temp
    );
    const screenRoughOpeningWidth_temp = screenRoughOpenings.screenRoughOpeningWidth;
    const screenRoughOpeningHeight_temp = screenRoughOpenings.screenRoughOpeningHeight;

    // Results
    setClearOpeningHeight(formatNumber(clearOpeningHeight_temp));
    setClearOpeningWidth(formatNumber(clearOpeningWidth_temp));
    setJambDepth(formatNumber(jambDepth_temp));
    setPanelHeight(formatNumber(panelHeight_temp));
    setPanelWidth(formatNumber(panelWidth_temp));
    setPocketDepth(formatNumber(pocketDepth_temp));
    setPocketWidth(formatNumber(pocketWidth_temp));
    setRoughOpeningHeightSubfloor(formatNumber(roughOpeningHeightSubfloor_temp));
    setRoughOpeningHeightRecess(formatNumber(roughOpeningHeightRecess_temp));
    setRoughPocketWidth(formatNumber(roughPocketWidth_temp));
    setRoughOpeningPocketWidth(formatNumber(roughOpeningPocketWidth_temp));
    setRoughOpeningWidth(formatNumber(roughOpeningWidth_temp));

    setScreenRoughOpeningWidth(formatNumber(screenRoughOpeningWidth_temp));
    setScreenRoughOpeningHeight(formatNumber(screenRoughOpeningHeight_temp));

    setScreenUnitSizeWidth(formatNumber(screenUnitSizeWidth_temp));
    setScreenUnitSizeHeight(formatNumber(screenUnitSizeHeight_temp));

    setSillDepth(formatNumber(sillDepth_temp));
    setUnitHeight(formatNumber(unitHeight_temp));
    setUnitWidth(formatNumber(unitWidth_temp));
    setThicknessFinishedFloor(formatNumber(thicknessFinishedFloor_temp));

    setIsShowResults(true);

    props.completeCallback();
  };

  const handleWidthChange = (e: any) => {
    setMsgWidth('');
    const feet = e.target.name === 'width' ? e.target.value : getValues('width').trim();
    const inches = e.target.name === 'widthInches' ? e.target.value : getValues('widthInches');
    const fraction =
      e.target.name === 'widthFraction' ? e.target.value : getValues('widthFraction');

    if (!feet) {
      setMsgWidth('This field is required');
    }

    const feetNum = Number.parseFloat(feet);
    const inchesNum = Number.parseFloat(inches);
    const fractionNum = Number.parseFloat(fraction);

    if (feetNum > 0 || inchesNum !== 0 || fractionNum !== 0) {
      const length = feetNum * 12 + inchesNum + fractionNum;
      const states = {
        feet: feetNum,
        inches: inchesNum,
        fraction: fractionNum,
        dimension: length,
      };

      setWidthStates({
        ...widthStates,
        ...states,
      });

      updateForm(e, states);
    }
  };

  const handleHeightChange = (e: any) => {
    setMsgHeight('');

    const feet = e.target.name === 'height' ? e.target.value : getValues('height').trim();
    const inches = e.target.name === 'heightInches' ? e.target.value : getValues('heightInches');
    const fraction =
      e.target.name === 'heightFraction' ? e.target.value : getValues('heightFraction');

    if (!feet) {
      setMsgHeight('This field is required');
    }

    const feetNum = Number.parseFloat(feet);
    const inchesNum = Number.parseFloat(inches);
    const fractionNum = Number.parseFloat(fraction);

    if (feetNum || inches !== '0' || fraction !== '0') {
      const length = feetNum * 12 + inchesNum + fractionNum;
      const states = {
        feet: feetNum,
        inches: inchesNum,
        fraction: fractionNum,
        dimension: length,
      };

      setHeightStates({
        ...heightStates,
        ...states,
      });

      updateForm(e, states);
    }
  };

  const handleThicknessChange = (e: any) => {
    const inches =
      e.target.name === 'thicknessFinishedFloorInches'
        ? e.target.value
        : getValues('thicknessFinishedFloorInches');
    const fraction =
      e.target.name === 'thicknessFinishedFloorFraction'
        ? e.target.value
        : getValues('thicknessFinishedFloorFraction');

    if (inches !== '0' || fraction !== '0') {
      const inchesNum = Number.parseFloat(inches);
      const fractionNum = Number.parseFloat(fraction);
      const length = inchesNum + fractionNum;
      const states = {
        inches: inchesNum,
        fraction: fractionNum,
        dimension: length,
      };

      setThicknessFinishedFloorStates({
        ...thicknessFinishedFloorStates,
        ...states,
      });

      updateForm(e, states);
    }
  };

  const onDimensionFieldChange = (e: any, type: any) => {
    if (type === 'width') {
      handleWidthChange(e);
    } else if (type === 'height') {
      handleHeightChange(e);
    } else if (type === 'thickness') {
      handleThicknessChange(e);
    }
  };

  const findMinMaxWidth = (rows: any[], minProp: string, maxProp: string) => {
    const minRow = rows.reduce(
      (total, currentValue) => (total[minProp] < currentValue[minProp] ? total : currentValue),
      { [minProp]: Number.MAX_VALUE }
    );
    const maxRow = rows.reduce(
      (total, currentValue) => (total[maxProp] > currentValue[maxProp] ? total : currentValue),
      { [maxProp]: Number.MIN_VALUE }
    );
    return { minWidth: minRow[minProp], maxWidth: maxRow[maxProp] };
  };

  const validateHeight = (height: number, calculateUsing: string, sillOptions: string) => {
    if (height <= 0) {
      return '';
    }

    let minHeight = isOnFloorDrainage(sillOptions) ? 47.5 : 48;
    let maxHeight = isOnFloorDrainage(sillOptions) ? 119.5 : 120;

    switch (calculateUsing) {
      case 'rough_opening':
      case 'rough_opening_pocket':
        minHeight = calculateRoughOpeningHeightFromUnitHeight(minHeight, sillOptions);
        maxHeight = calculateRoughOpeningHeightFromUnitHeight(maxHeight, sillOptions);
        break;
      case 'clear_opening':
        minHeight = calculateClearOpeningHeightFromUnitHeight(minHeight, sillOptions);
        maxHeight = calculateClearOpeningHeightFromUnitHeight(maxHeight, sillOptions);
        break;
      case 'unit_dimensions':
        // min/max are defined in unit dimensions
        break;
    }

    const minFormatted = convertToFeetInchesAndFraction(
      minHeight,
      AWNumberUtil.roundingDirections.up
    );
    const maxFormatted = convertToFeetInchesAndFraction(
      maxHeight,
      AWNumberUtil.roundingDirections.down
    );

    if (height < minHeight) {
      return 'Please enter a value greater than or equal to ' + minFormatted + '.';
    }
    if (height > maxHeight) {
      return 'Please enter a value less than or equal to ' + maxFormatted + '.';
    }
    return '';
  };

  const validateWidth = (width: number, calculateUsing: string, stackingDirection: string) => {
    if (width <= 0) {
      return '';
    }

    const minMaxRows = minMaxes.filter((element) => {
      return (
        element.stackingDirection === stackingDirection &&
        element.configuration === configuration &&
        element.panelStyle === panelStyle
      );
    });

    if (minMaxRows.length === 0) {
      return '';
    }

    let minWidth: any;
    let maxWidth: any;

    switch (calculateUsing) {
      case 'rough_opening': {
        const result = findMinMaxWidth(minMaxRows, 'minWidthRoughOpening', 'maxWidthRoughOpening');
        minWidth = result.minWidth;
        maxWidth = result.maxWidth;
        break;
      }
      case 'rough_opening_pocket': {
        const result = findMinMaxWidth(
          minMaxRows,
          'minWidthRoughOpeningWithOutPocket',
          'maxWidthRoughOpeningWithOutPocket'
        );
        minWidth = result.minWidth;
        maxWidth = result.maxWidth;
        break;
      }
      case 'clear_opening': {
        const result = findMinMaxWidth(minMaxRows, 'minWidthClearOpening', 'maxWidthClearOpening');
        minWidth = result.minWidth;
        maxWidth = result.maxWidth;
        break;
      }
      case 'unit_dimensions': {
        const result = findMinMaxWidth(
          minMaxRows,
          'minWidthUnitDimensions',
          'maxWidthUnitDimensions'
        );
        minWidth = result.minWidth;
        maxWidth = result.maxWidth;
        break;
      }
    }

    const minFormatted = convertToFeetInchesAndFraction(
      minWidth,
      AWNumberUtil.roundingDirections.up
    );
    const maxFormatted = convertToFeetInchesAndFraction(
      maxWidth,
      AWNumberUtil.roundingDirections.down
    );

    if (width < minWidth) {
      return 'Please enter a value greater than or equal to ' + minFormatted + '.';
    }
    if (width > maxWidth) {
      return 'Please enter a value less than or equal to ' + maxFormatted + '.';
    }
    return '';
  };

  const updateFormState = (e: any) => {
    if (e?.target?.name === 'panelNumber') {
      setSelectedPanelNumber(e.target.value);
    } else if (e?.target?.name !== 'width' && e?.target?.name !== 'height') {
      setFormStates({ ...formStates, [e.target.name]: e.target.value });
    }
  };

  const getFormValues = (e: any, dimensionStates: any) => {
    const calculateUsing =
      e?.target?.name === 'calculateUsing' ? e?.target?.value : getValues('calculateUsing');
    const height = e?.target?.name?.includes('height')
      ? dimensionStates?.dimension
      : heightStates.dimension;
    const width = e?.target?.name?.includes('width')
      ? dimensionStates.dimension
      : widthStates.dimension;
    const sillOptions =
      e?.target?.name === 'sillOption' ? e?.target?.value : getValues('sillOption');
    const stackingDirection =
      e?.target?.name === 'stackingDirection' ? e?.target?.value : getValues('stackingDirection');

    return { calculateUsing, height, width, sillOptions, stackingDirection };
  };

  const updateForm = (e?: any, dimensionStates?: any) => {
    setIsShowResults(false);
    setMsgWidth('');
    setMsgHeight('');

    updateFormState(e);

    const { calculateUsing, height, width, sillOptions, stackingDirection } = getFormValues(
      e,
      dimensionStates
    );

    const msgHeight = validateHeight(height, calculateUsing, sillOptions);
    const msgWidth = validateWidth(width, calculateUsing, stackingDirection);

    if (msgWidth !== '' || msgHeight !== '') {
      setMsgWidth(msgWidth);
      setMsgHeight(msgHeight);
      setIsShowResults(false);
    }

    const widthValid = true;

    // Update number of panels dropdown
    // Default to all valid options for our combination
    let numberPanelRows = minMaxes.filter((element) => {
      return (
        element.stackingDirection === stackingDirection &&
        element.configuration === configuration &&
        element.panelStyle === panelStyle
      );
    });

    // If we have a valid width, then filter further using the width
    if (widthValid && width) {
      const lookupWidth = Number(width);

      // Convert to array dimensions
      // Pocketing -> Rough Opening w/o Pocket
      // Stacking  -> Unit
      switch (calculateUsing) {
        case 'rough_opening':
          numberPanelRows = numberPanelRows.filter((element) => {
            return (
              element.minWidthRoughOpening <= lookupWidth &&
              element.maxWidthRoughOpening >= lookupWidth
            );
          });
          break;
        case 'rough_opening_pocket':
          numberPanelRows = numberPanelRows.filter((element) => {
            return (
              element.minWidthRoughOpeningWithOutPocket <= lookupWidth &&
              element.maxWidthRoughOpeningWithOutPocket >= lookupWidth
            );
          });
          break;
        case 'clear_opening':
          numberPanelRows = numberPanelRows.filter((element) => {
            return (
              element.minWidthClearOpening <= lookupWidth &&
              element.maxWidthClearOpening >= lookupWidth
            );
          });
          break;
        case 'unit_dimensions':
          numberPanelRows = numberPanelRows.filter((element) => {
            return (
              element.minWidthUnitDimensions <= lookupWidth &&
              element.maxWidthUnitDimensions >= lookupWidth
            );
          });
          break;
      }
    }

    if (e?.target?.name !== 'panelNumber') {
      // Convert to an array so we can populate the dropdown
      let numberPanelOptions = numberPanelRows.map((row: any) => {
        if (
          row.stackingDirection === stackingDirection &&
          row.configuration === configuration &&
          row.panelStyle === panelStyle
        ) {
          return row.numberOfPanels;
        }
      });
      numberPanelOptions = numberPanelOptions.length > 0 ? numberPanelOptions : [2, 3, 4, 5, 6];
      setNumberPanelList(numberPanelOptions);
      if (!numberPanelOptions.find((option) => Number(option) === Number(selectedPanelNumber))) {
        setSelectedPanelNumber(numberPanelOptions[0]);
        setValue('panelNumber', numberPanelOptions[0]);
      }
    }

    const unitDimensions = calculateUnitDimensions();
    const insectScreenWidth = calculateInsectScreenWidth(
      configuration,
      stackingDirection,
      Number(unitDimensions.unitWidth),
      Number(unitDimensions.roughOpeningPocketWidth)
    );

    if (insectScreenWidth > singleScreenMaxWidth) {
      setScreenConfigurationOption('doubleOnly');
      setValue('screenConfiguration', 'double');
    } else {
      setScreenConfigurationOption('both');
      setValue('screenConfiguration', 'single');
    }

    if (insectScreenWidth > doubleScreenMaxWidth) {
      console.log('exceeds max screen width');
    }
  };

  const minMaxes = MIN_MAX_WIDTHS.map((o: any) => {
    const panelOverlap = calculatePanelOverlap(o[2]);

    const obj: any = {
      stackingDirection: o[0],
      configuration: o[1],
      panelStyle: o[2],
      numberOfPanels: o[3],
    };

    if (obj.configuration === 'stacking') {
      // min/max are defined in unit dimensions
      obj.minWidthUnitDimensions = o[4];
      obj.maxWidthUnitDimensions = o[5];

      obj.minWidthRoughOpening = roundNumber(
        calculateRoughOpeningWidthFromUnitWidth(obj.minWidthUnitDimensions)
      );
      obj.maxWidthRoughOpening = roundNumber(
        calculateRoughOpeningWidthFromUnitWidth(obj.maxWidthUnitDimensions)
      );

      obj.minWidthClearOpening = roundNumber(
        calculateClearOpeningWidthFromInputWidth(
          obj.minWidthUnitDimensions,
          obj.configuration,
          obj.stackingDirection,
          obj.numberOfPanels,
          panelOverlap,
          obj.panelStyle
        )
      );
      obj.maxWidthClearOpening = roundNumber(
        calculateClearOpeningWidthFromInputWidth(
          obj.maxWidthUnitDimensions,
          obj.configuration,
          obj.stackingDirection,
          obj.numberOfPanels,
          panelOverlap,
          obj.panelStyle
        )
      );
    } else {
      // pocketing
      // min/max are defined in rough opening w/o pocket
      obj.minWidthRoughOpeningWithOutPocket = o[4];
      obj.maxWidthRoughOpeningWithOutPocket = o[5];

      obj.minWidthRoughOpening = roundNumber(
        pocketing_calculateRoughOpeningWidthFromRoughOpeningPocketWidth(
          obj.minWidthRoughOpeningWithOutPocket,
          obj.stackingDirection,
          obj.numberOfPanels,
          panelOverlap
        )
      );
      obj.maxWidthRoughOpening = roundNumber(
        pocketing_calculateRoughOpeningWidthFromRoughOpeningPocketWidth(
          obj.maxWidthRoughOpeningWithOutPocket,
          obj.stackingDirection,
          obj.numberOfPanels,
          panelOverlap
        )
      );

      obj.minWidthClearOpening = roundNumber(
        calculateClearOpeningWidthFromInputWidth(
          obj.minWidthRoughOpeningWithOutPocket,
          obj.configuration,
          obj.stackingDirection,
          obj.numberOfPanels,
          panelOverlap,
          obj.panelStyle
        )
      );
      obj.maxWidthClearOpening = roundNumber(
        calculateClearOpeningWidthFromInputWidth(
          obj.maxWidthRoughOpeningWithOutPocket,
          obj.configuration,
          obj.stackingDirection,
          obj.numberOfPanels,
          panelOverlap,
          obj.panelStyle
        )
      );

      obj.minWidthUnitDimensions = roundNumber(
        calculateUnitWidthFromRoughOpeningWidth(obj.minWidthRoughOpening)
      );
      obj.maxWidthUnitDimensions = roundNumber(
        calculateUnitWidthFromRoughOpeningWidth(obj.maxWidthRoughOpening)
      );
    }

    return obj;
  });

  if (!fields) {
    return <></>;
  }

  return (
    <div>
      <div className="mb-5 flex justify-center">
        <button
          type="button"
          onClick={resetForm}
          className={classNames(themeData.classes.resetButton)}
        >
          <span>Start over</span>
          <span className="ml-xxs">
            <SvgIcon icon="reset" />
          </span>
        </button>
      </div>
      <div className="font-bold">Step Three: Enter Size Information</div>
      <form onSubmit={handleSubmit(onSubmit)} className="col-span-12 mt-5">
        <div className={themeData.classes.formWrapper}>
          <div className={themeData.classes.columnSpan2}>
            <label className={themeData.classes.labelClass} htmlFor="calculateUsing">
              Calculate using known
            </label>
            <select
              className={themeData.classes.selectColumnSpan2}
              {...register('calculateUsing')}
              name="calculateUsing"
              defaultValue="rough_opening"
              onChange={updateForm}
            >
              {configuration === 'stacking' && (
                <>
                  <option value="rough_opening">Rough Opening</option>
                  <option value="clear_opening">Clear Opening</option>
                  <option value="unit_dimensions">Unit Dimensions</option>
                </>
              )}
              {configuration === 'pocketing' && (
                <>
                  <option value="rough_opening">Rough Opening</option>
                  <option value="rough_opening_pocket">Rough Opening Without Pocket</option>
                  <option value="clear_opening">Clear Opening</option>
                  <option value="unit_dimensions">Unit Dimensions</option>
                </>
              )}
            </select>
            <div className="mt-1">
              <button
                type="button"
                className="text-sm leading-[22px] text-[#CB4C0C]"
                onClick={() =>
                  window.open(
                    props.fields.MeasurementLink?.value?.href,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Measurements explained
              </button>
            </div>
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="width">
              Width*
            </label>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 mml:col-span-2">
                <input
                  type="text"
                  placeholder="Feet"
                  maxLength={25}
                  onInput={clearCalculations}
                  className={`${
                    errors.width || msgWidth
                      ? themeData.classes.errorInvalid
                      : themeData.classes.errorValid
                  }`}
                  {...register('width', {
                    required: 'This field is required.',
                    pattern: {
                      value: /^(0*[1-9]\d*(\.\d+)?|0+\.\d*[1-9]\d*)$/,
                      message: 'Width is not valid.',
                    },
                  })}
                  name="width"
                  onChange={(e) => onDimensionFieldChange(e, 'width')}
                ></input>
              </div>
              <div className="col-span-2 md:min-w-[62px] mml:col-span-1">
                <select
                  className={
                    errors.width || msgWidth
                      ? themeData.classes.errorInvalid
                      : themeData.classes.selectColumnSpan1
                  }
                  {...register('widthInches')}
                  name="widthInches"
                  defaultValue="0"
                  onChange={(e) => onDimensionFieldChange(e, 'width')}
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
              <div className="col-span-2 md:min-w-[82px] mml:col-span-1">
                <select
                  className={
                    errors.width || msgWidth
                      ? themeData.classes.errorInvalid
                      : themeData.classes.selectColumnSpan1
                  }
                  {...register('widthFraction')}
                  name="widthFraction"
                  defaultValue="0"
                  onChange={(e) => onDimensionFieldChange(e, 'width')}
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
            {msgWidth && <div className="text-body text-error">{msgWidth}</div>}
            <label className={themeData.classes.labelClass} htmlFor="width">
              <button
                className={themeData.classes.modalLinkButton}
                type="button"
                onClick={() => {
                  openModal(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    openModal(0);
                  }
                }}
              >
                {props.fields?.fractionChartLinkText?.value}
              </button>
            </label>
            {currentImageIndex === 0 && isLightboxVisible && (
              <ModalWrapper
                isModalOpen={currentImageIndex === 0 && isLightboxVisible}
                size="fluid"
                handleClose={() => setIsLightboxVisible(false)}
              >
                <div className="px-ml pb-ml pt-s">
                  <img
                    src={props.fields?.fractionChartImage?.value?.src ?? ''}
                    alt={props.fields?.fractionChartImage?.value?.alt}
                  />
                </div>
              </ModalWrapper>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="height">
              Height*
            </label>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 mml:col-span-2">
                <input
                  type="text"
                  placeholder="Feet"
                  maxLength={25}
                  onInput={clearCalculations}
                  className={`${
                    errors.height || msgHeight
                      ? themeData.classes.errorInvalid
                      : themeData.classes.errorValid
                  }`}
                  {...register('height', {
                    required: 'This field is required.',
                    pattern: {
                      value: /^(0*[1-9]\d*(\.\d+)?|0+\.\d*[1-9]\d*)$/,
                      message: 'Height is not valid.',
                    },
                  })}
                  name="height"
                  onChange={(e) => onDimensionFieldChange(e, 'height')}
                ></input>
              </div>
              <div className="col-span-2 md:min-w-[62px] mml:col-span-1">
                <select
                  className={
                    errors.height || msgHeight
                      ? themeData.classes.errorInvalid
                      : themeData.classes.selectColumnSpan1
                  }
                  {...register('heightInches')}
                  name="heightInches"
                  defaultValue="0"
                  onChange={(e) => onDimensionFieldChange(e, 'height')}
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
              <div className="col-span-2 md:min-w-[82px] mml:col-span-1">
                <select
                  className={
                    errors.height || msgHeight
                      ? themeData.classes.errorInvalid
                      : themeData.classes.selectColumnSpan1
                  }
                  {...register('heightFraction')}
                  name="heightFraction"
                  defaultValue="0"
                  onChange={(e) => onDimensionFieldChange(e, 'height')}
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
            {msgHeight && <div className="text-body text-error">{msgHeight}</div>}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="stackingDirection">
              Stacking Direction
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              {...register('stackingDirection')}
              name="stackingDirection"
              defaultValue="one_direction"
              onChange={updateForm}
            >
              <option value="one_direction">1-Way Left</option>
              <option value="one_direction">1-Way Right</option>
              <option value="two_direction">2-Way</option>
            </select>
            {errors.stackingDirection && (
              <div className="text-body text-error">{errors.stackingDirection.message}</div>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="sillOption">
              Sill Options
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              {...register('sillOption')}
              name="sillOption"
              defaultValue="onfloor_drainage"
              onChange={updateForm}
            >
              <option value="onfloor_drainage">On-Floor Drainage</option>
              <option value="onfloor_drainage_raised_threshold">
                On-Floor Drainage With Raised Threshold
              </option>
              <option value="flush">Flush</option>
            </select>
            {errors.sillOption && (
              <div className="text-body text-error">{errors.sillOption.message}</div>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="panelNumber">
              # Of Panels
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              {...register('panelNumber')}
              name="panelNumber"
              onChange={updateForm}
            >
              {numberPanelList.map((numberPanel) => (
                <option key={numberPanel} value={numberPanel}>
                  {numberPanel}
                </option>
              ))}
            </select>
            {errors.panelNumber && (
              <div className="text-body text-error">{errors.panelNumber.message}</div>
            )}
          </div>
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="sillRamps">
              Sill Ramps
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              {...register('sillRamp')}
              name="sillRamp"
              defaultValue="none"
              onChange={updateForm}
            >
              {isOnFloorDrainage(formStates.sillOption) ? (
                <>
                  <option value="none">None</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                  <option value="both">Both</option>
                </>
              ) : (
                <option value="none">None</option>
              )}
            </select>
            {errors.sillRamp && (
              <div className="text-body text-error">{errors.sillRamp.message}</div>
            )}
          </div>
          {configuration === 'stacking' && (
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="panelStackingLocation">
                Panel Stacking Location
              </label>
              <select
                className={themeData.classes.selectColumnSpan1}
                {...register('panelStackingLocation')}
                name="panelStackingLocation"
                defaultValue="interior"
                onChange={updateForm}
              >
                <option value="interior">Interior</option>
                {formStates.stackingDirection !== 'two_direction' && (
                  <option value="exterior">Exterior</option>
                )}
              </select>
              {errors.panelStackingLocation && (
                <div className="text-body text-error">{errors.panelStackingLocation.message}</div>
              )}
            </div>
          )}
          {formStates.sillOption === 'flush' && (
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="thicknessFinishedFloor">
                Thickness Of Finished Floor (In Inches)
              </label>
              <div className="grid grid-cols-4 gap-4">
                <select
                  className={themeData.classes.selectColumnSpan1}
                  {...register('thicknessFinishedFloorInches')}
                  name="thicknessFinishedFloorInches"
                  defaultValue="0"
                  onChange={(e) => onDimensionFieldChange(e, 'thickness')}
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
                <select
                  className={themeData.classes.selectColumnSpan1}
                  {...register('thicknessFinishedFloorFraction')}
                  name="thicknessFinishedFloorFraction"
                  defaultValue="0"
                  onChange={(e) => onDimensionFieldChange(e, 'thickness')}
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
          )}
          <div className={themeData.classes.columnSpan1}>
            <label className={themeData.classes.labelClass} htmlFor="insectScreens">
              Insect Screens
            </label>
            <select
              className={themeData.classes.selectColumnSpan1}
              {...register('insectScreen')}
              name="insectScreen"
              defaultValue="none"
              onChange={updateForm}
            >
              <option value="none">None</option>
              {configuration === 'stacking' ? (
                <>
                  {formStates.panelStackingLocation === 'interior' && (
                    <option value="multi">Multi-panel</option>
                  )}
                  <option value="retractable">Retractable</option>
                  {formStates.panelStackingLocation === 'exterior' && (
                    <option value="single">Single</option>
                  )}
                </>
              ) : (
                <>
                  <option value="multi">Multi-panel</option>
                  <option value="retractable">Retractable</option>
                  <option value="single">Single</option>
                </>
              )}
            </select>
            {errors.insectScreen && (
              <div className="text-body text-error">{errors.insectScreen.message}</div>
            )}
          </div>
          {formStates.insectScreen === 'retractable' && (
            <div className={themeData.classes.columnSpan1}>
              <label className={themeData.classes.labelClass} htmlFor="screenConfiguration">
                Screen Configuration
              </label>
              <select
                className={themeData.classes.selectColumnSpan1}
                {...register('screenConfiguration')}
                name="screenConfiguration"
                defaultValue="single"
                onChange={updateForm}
              >
                {screenConfigurationOption === 'both' && (
                  <option value="single">Single Screen</option>
                )}
                <option value="double">Double Screen</option>
              </select>
              {errors.screenConfiguration && (
                <div className="text-body text-error">{errors.screenConfiguration.message}</div>
              )}
            </div>
          )}
          {/* Submit section */}
          <div className={themeData.classes.submitWrapper}>
            {(!isShowResults || isShowResults) && (
              <button
                type="button"
                className={themeData.classes.prevButton}
                onClick={() => {
                  props.previousStep();
                  setIsShowResults(false);
                }}
              >
                <FiArrowLeft size={16} />
                <span className="ml-2">Previous</span>
              </button>
            )}
            {(!isShowResults || isShowResults) && (
              <button type="submit" className={themeData.classes.submitButton}>
                Calculate
              </button>
            )}
          </div>
          <div className="m-auto mt-[50px]"></div>
        </div>
      </form>
      {isShowResults && (
        <div className="mt-4">
          <div className="col-span-12 flex flex-row items-center justify-between">
            <div className="mb-s font-sans text-sm-m font-heavy text-theme-text last:mb-0 lg:text-m">
              <h1>Results:</h1>
            </div>
            <div className="mb-s hidden items-end pr-2 md:relative lg:block">
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
              <div ref={table1Ref}></div>
            </div>
          </div>
          <div
            className={clsx({
              [themeData.classes.resultsOutputWrapper]: true,
            })}
            id="resultsOutput"
          >
            <div className={(themeData.classes.columnSpan1, 'print:mx-5')} ref={table1Ref}>
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <div className="hidden print:mb-5 print:block">
                      MultiGlide Sizing Calculator Results
                    </div>
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
                          <td className={themeData.classes.tdColumn}>Configuration</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {selectedConfigurationOption?.title || '-'}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Stacking Direction</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {OPTIONS.stackingDirection[getValues('stackingDirection')] || '-'}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Panel Style</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {selectedPanelStyle?.text || '-'}
                          </td>
                        </tr>
                        {configuration === 'stacking' && (
                          <tr className={themeData.classes.tableRow}>
                            <td className={themeData.classes.tdColumn}>Panel Stacking Location</td>
                            <td className={themeData.classes.tdColumnCenter}>
                              {OPTIONS.panelStackingLocation[getValues('panelStackingLocation')] ||
                                '-'}
                            </td>
                          </tr>
                        )}
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}># Of Pannels</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {selectedPanelNumber || '-'}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Sill Options</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {OPTIONS.sillOptions[getValues('sillOption')] || '-'}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Sill Ramps</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {OPTIONS.sillRamps[getValues('sillRamp')] || '-'}
                          </td>
                        </tr>
                        <tr className={themeData.classes.tableRow}>
                          <td className={themeData.classes.tdColumn}>Insect Screens</td>
                          <td className={themeData.classes.tdColumnCenter}>
                            {OPTIONS.insectScreens[getValues('insectScreen')] || '-'}
                          </td>
                        </tr>
                        {formStates.insectScreen === 'retractable' && (
                          <tr className={themeData.classes.tableRow}>
                            <td className={themeData.classes.tdColumn}>Screen Configuration</td>
                            <td className={themeData.classes.tdColumnCenter}>
                              {OPTIONS.screenConfigurations[getValues('screenConfiguration')] ||
                                '-'}
                            </td>
                          </tr>
                        )}
                        {formStates.sillOption === 'flush' && (
                          <tr className={themeData.classes.tableRow}>
                            <td className={themeData.classes.tdColumn}>Thickness Finished Floor</td>
                            <td className={themeData.classes.tdColumnCenter}>
                              <div dangerouslySetInnerHTML={{ __html: thicknessFinishedFloor }} />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="hidden print:block">
                <CalculatorResult
                  data={{
                    formStates,
                    configuration,
                    clearOpeningWidth,
                    clearOpeningHeight,
                    roughOpeningWidth,
                    roughOpeningHeightSubfloor,
                    roughOpeningHeightRecess,
                    roughOpeningPocketWidth,
                    unitWidth,
                    unitHeight,
                    panelWidth,
                    panelHeight,
                    roughPocketWidth,
                    pocketWidth,
                    pocketDepth,
                    jambDepth,
                    sillDepth,
                    screenRoughOpeningWidth,
                    screenRoughOpeningHeight,
                    screenUnitSizeWidth,
                    screenUnitSizeHeight,
                  }}
                />
              </div>
            </div>
            <div className={themeData.classes.columnSpan1}>
              <CalculatorResult
                data={{
                  formStates,
                  configuration,
                  clearOpeningWidth,
                  clearOpeningHeight,
                  roughOpeningWidth,
                  roughOpeningHeightSubfloor,
                  roughOpeningHeightRecess,
                  roughOpeningPocketWidth,
                  unitWidth,
                  unitHeight,
                  panelWidth,
                  panelHeight,
                  roughPocketWidth,
                  pocketWidth,
                  pocketDepth,
                  jambDepth,
                  sillDepth,
                  screenRoughOpeningWidth,
                  screenRoughOpeningHeight,
                  screenUnitSizeWidth,
                  screenUnitSizeHeight,
                }}
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col items-center justify-between border border-black p-4 md:flex-row">
            <div className="mb-4 text-[20px] font-bold md:mb-0">Preparing for installation?</div>
            <LinkWrapper
              target="_blank"
              field={formData?.downloadLink}
              className={themeData.classes.submitButton}
              ariaLabel={{
                value: 'FormData Download Link',
              }}
            >
              <IoMdDownload size={20} />
            </LinkWrapper>
          </div>
        </div>
      )}
      {(props.fields?.footer || isEE) && (
        <div className="col-span-12">
          <RichTextWrapper field={props.fields?.footer} className={themeData.classes.footer} />
        </div>
      )}
    </div>
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
};
