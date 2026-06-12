import { createContext, Dispatch, SetStateAction } from 'react';

export type AWProductConfiguratorContextProps = {
  width: string;
  height: string;
  interiorFrameColor: string;
  setWidth: Dispatch<SetStateAction<string>>;
  setHeight: Dispatch<SetStateAction<string>>;
  setInteriorFrameColor: Dispatch<SetStateAction<string>>;
};

export const AWProductConfiguratorContext = createContext<AWProductConfiguratorContextProps>(
  {} as AWProductConfiguratorContextProps
);
