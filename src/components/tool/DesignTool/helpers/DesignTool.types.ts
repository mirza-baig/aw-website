import { ReactNode } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type DesignToolProps = Sitecore.Components.Tool.DesignTool.DesignTool & {
  placeholder: ReactNode;
};
export type DesignToolOptionProps = Sitecore.Components.Tool.DesignTool.DesignToolOption;
export type DesignToolProductProps = Sitecore.Components.Tool.DesignTool.DesignToolProduct;

export enum DesignToolStep {
  Start,
  Select,
  Design,
}
