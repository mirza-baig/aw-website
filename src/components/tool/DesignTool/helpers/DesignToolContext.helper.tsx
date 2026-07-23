import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { guidEquals } from 'lib/utils/string-utils/guid-equals';
import { createContext, Dispatch, SetStateAction } from 'react';

import { DesignToolDataProps, DesignToolOptionDataProps } from './DesignTool.helper';
import { DesignToolProductProps, DesignToolProps, DesignToolStep } from './DesignTool.types';
import { AWViewModelBuilder } from './js/awviewmodelbuilder';
import { StormdoorViewModelBuilder } from './js/stormdoorviewmodelbuilder';
import { GetUrlParts } from './js/utils';

export type LegacyAWViewModel = AWViewModelBuilder | StormdoorViewModelBuilder | undefined;

export class DesignToolRouter {
  routeData: DesignToolRouteData;
  setRouteData: Dispatch<SetStateAction<DesignToolRouteData>>;
  moduleData: DesignToolDataProps;
  shortenedUrl: string;

  NormalizeId = (value: string | undefined) => {
    return value?.toLowerCase().replace(/[\}\{-]/g, '');
  };

  constructor(
    moduleData: DesignToolDataProps,
    routeData: DesignToolRouteData,
    setRouteData: Dispatch<SetStateAction<DesignToolRouteData>>
  ) {
    this.routeData = routeData;
    this.setRouteData = setRouteData;

    this.moduleData = moduleData;
    this.shortenedUrl = '';
  }

  getStep(url: string) {
    const urlParts = GetUrlParts(url);

    if (urlParts?.attributeIndex) {
      return DesignToolStep.Design;
    } else if (urlParts?.option) {
      return DesignToolStep.Select;
    } else {
      return DesignToolStep.Start;
    }
  }

  getRouteForOption(option: DesignToolOptionDataProps) {
    return option.id;
  }

  setRouteDataFromOptionId(optionId: string, legacyAWViewModel?: LegacyAWViewModel) {
    const moduleData = this.moduleData;
    const option = moduleData?.options?.find(
      (currentOption: DesignToolOptionDataProps) => currentOption.id == optionId
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    option && this.setRouteDataFromOption(option, legacyAWViewModel);
  }

  setRouteDataFromOption(option: DesignToolOptionDataProps, legacyAWViewModel?: LegacyAWViewModel) {
    if (option) {
      const moduleData = this.moduleData;
      const matchedOption = moduleData?.options?.find(
        (currentOption: DesignToolOptionDataProps) => currentOption.id === option.id
      ) as DesignToolOptionDataProps;

      this.setRouteData({
        option: matchedOption,
        options:
          moduleData?.options?.filter(
            (currentOption: DesignToolOptionDataProps) =>
              option?.options?.indexOf(currentOption.id) > -1
          ) ?? [],
        product: undefined,
        products:
          moduleData?.products?.filter(
            (currentProduct: DesignToolProductProps) =>
              option?.products?.indexOf(currentProduct.id) > -1
          ) ?? [],
        attributeIndex: -1,
        legacyAWViewModel: legacyAWViewModel ?? this.routeData.legacyAWViewModel,
      });
    } else {
      this.clearRouteData();
    }
  }

  getRouteDataForProduct(product: DesignToolProductProps) {
    return `#/${product.id}/0`;
  }

  getProductFromProductId = (productId: string): DesignToolProductProps => {
    const moduleData = this.moduleData;
    const product = moduleData?.products?.find(
      (currentProduct: DesignToolProductProps) => currentProduct.id == productId
    );

    return product;
  };

  getBackRoute = (url: string): string => {
    const urlParts = GetUrlParts(url);

    const attributeIndex = Number.parseInt(urlParts.attributeIndex);
    let option;
    if (this.routeData.product?.id === urlParts.option) {
      option = this.routeData.product;
    } else if (this.routeData.option?.id === urlParts.option) {
      option = this.routeData.option;
    }
    // Removed queryPart that Carries old product query
    if (Number.isNaN(attributeIndex) || attributeIndex <= 0) {
      // If the parentId is the DesignToolStart item Id, then we want to go back to the start page,
      // otherwise we want to go back to the option parentId
      if (
        guidEquals(
          this.NormalizeId(option?.parentId),
          this.NormalizeId(
            SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Components.Tool
              .DesignTool.DesignToolStart.Id
          )
        )
      ) {
        return `${urlParts.pathName}#/`;
      } else {
        return `${urlParts.pathName}#/${option?.parentId ? option?.parentId : ''}`;
      }
    } else {
      return `${urlParts.pathName}#/${option?.id}/${attributeIndex - 1}`;
    }
  };

  setRouteDataFromProduct(
    product: DesignToolProductProps,
    attributeIndex: number,
    legacyAWViewModel?: LegacyAWViewModel
  ) {
    if (product) {
      const moduleData = this.moduleData;
      const matchedProduct = moduleData?.products?.find(
        (currentProduct: DesignToolProductProps) => currentProduct.id === product.id
      );

      this.setRouteData({
        option: undefined,
        options:
          moduleData?.options?.filter(
            (currentOption: DesignToolOptionDataProps) => currentOption.parentId === undefined
          ) ?? [],
        product: matchedProduct,
        products: [],
        attributeIndex: attributeIndex,
        legacyAWViewModel: legacyAWViewModel ?? this.routeData.legacyAWViewModel,
      });
    } else {
      this.clearRouteData();
    }
  }

  clearRouteData() {
    this.setRouteData(DefaultDesignToolRouteData);
  }

  goToStart(url: string) {
    const urlParts = GetUrlParts(url);
    // Replace the current history entry with a clean pathName + '#/' (no query string)
    globalThis.history.replaceState(null, '', `${urlParts.pathName}#/`);
    this.clearRouteData();
  }
}

export type DesignToolRouteData = {
  option: DesignToolOptionDataProps | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
  product: DesignToolProductProps | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  attributeIndex: number | undefined;
  legacyAWViewModel: LegacyAWViewModel;
};

export const DefaultDesignToolRouteData: DesignToolRouteData = {
  option: undefined,
  options: [],
  product: undefined,
  products: [],
  attributeIndex: undefined,
  legacyAWViewModel: undefined,
};

export type DesignToolStateProps = {
  designToolProps: DesignToolProps;
  viewModel: DesignToolDataProps;
  designToolRouter: DesignToolRouter;
  routeData: DesignToolRouteData;
  setRouteData: Dispatch<SetStateAction<DesignToolRouteData>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderingData: any;
  previewImage?: boolean;
  setPreviewImage: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

export const DesignToolContext = createContext<DesignToolStateProps>({} as DesignToolStateProps);
