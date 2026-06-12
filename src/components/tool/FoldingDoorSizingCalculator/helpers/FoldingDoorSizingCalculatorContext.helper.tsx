import { createContext, Dispatch, SetStateAction } from 'react';

export type FoldingDoorSizingCalculatorContextProps = {
  maxSteps: number;
  activeStep: number;
  scrollToTop: boolean;
  isCalculated: boolean;
  panelStyle: string;
  panelStyleText: string;
  setMaxSteps: Dispatch<SetStateAction<number>>;
  setScrollToTop: Dispatch<SetStateAction<boolean>>;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setIsCalculated: Dispatch<SetStateAction<boolean>>;
  setPanelStyle: Dispatch<SetStateAction<string>>;
  setPanelStyleText: Dispatch<SetStateAction<string>>;
};

export const FoldingDoorSizingCalculatorContext =
  createContext<FoldingDoorSizingCalculatorContextProps>(
    {} as FoldingDoorSizingCalculatorContextProps
  );
