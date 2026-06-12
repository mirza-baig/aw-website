import { createContext, Dispatch, SetStateAction } from 'react';

import { DesignToolDataProps, DesignToolOptionDataProps } from './DesignTool.helper';
import { DesignToolProductProps, DesignToolProps, DesignToolStep } from './DesignTool.types';
import { AWViewModelBuilder } from './js/awviewmodelbuilder';
import { StormdoorViewModelBuilder } from './js/stormdoorviewmodelbuilder';
import { GetUrlParts } from './js/utils';

export class DesignToolRouter {
  routeData: DesignToolRouteData;
  setRouteData: Dispatch<SetStateAction<DesignToolRouteData>>;
  moduleData: DesignToolDataProps;
  shortenedUrl: string;

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

    if (urlParts && urlParts.attributeIndex) {
      return DesignToolStep.Design;
    } else if (urlParts && urlParts.option) {
      return DesignToolStep.Select;
    } else {
      return DesignToolStep.Start;
    }
  }

  getRouteForOption(option: DesignToolOptionDataProps) {
    return option.id;
  }

  setRouteDataFromOptionId(
    optionId: string,
    legacyAWViewModel?: AWViewModelBuilder | StormdoorViewModelBuilder | undefined
  ) {
    const moduleData = this.moduleData as DesignToolDataProps;
    const option = moduleData?.options?.filter(
      (currentOption: DesignToolOptionDataProps) => currentOption.id == optionId
    )[0];

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    option && this.setRouteDataFromOption(option, legacyAWViewModel);
  }

  setRouteDataFromOption(
    option: DesignToolOptionDataProps,
    legacyAWViewModel?: AWViewModelBuilder | StormdoorViewModelBuilder | undefined
  ) {
    if (option) {
      const moduleData = this.moduleData as DesignToolDataProps;
      const matchedOption = moduleData?.options?.filter(
        (currentOption: DesignToolOptionDataProps) => currentOption.id === option.id
      )[0] as DesignToolOptionDataProps;

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
    const moduleData = this.moduleData as DesignToolDataProps;
    const product = moduleData?.products?.filter(
      (currentProduct: DesignToolProductProps) => currentProduct.id == productId
    )[0];

    return product;
  };

  getBackRoute = (url: string): string => {
    const urlParts = GetUrlParts(url);
    const queryPart = urlParts.query ? `?${urlParts.query}` : '';

    const attributeIndex = parseInt(urlParts.attributeIndex);
    let option;
    if (this.routeData.product?.id === urlParts.option) {
      option = this.routeData.product;
    } else if (this.routeData.option?.id === urlParts.option) {
      option = this.routeData.option;
    }

    if (isNaN(attributeIndex) || attributeIndex <= 0) {
      return `${urlParts.pathName}${queryPart}#/${option?.parentId ? option?.parentId : ''}`;
    } else {
      return `${urlParts.pathName}${queryPart}#/${option?.id}/${attributeIndex - 1}`;
    }
  };

  setRouteDataFromProduct(
    product: DesignToolProductProps,
    attributeIndex: number,
    legacyAWViewModel?: AWViewModelBuilder | StormdoorViewModelBuilder | undefined
  ) {
    if (product) {
      const moduleData = this.moduleData as DesignToolDataProps;
      const matchedProduct = moduleData?.products?.filter(
        (currentProduct: DesignToolProductProps) => currentProduct.id === product.id
      )[0] as DesignToolProductProps;

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
}

export type DesignToolRouteData = {
  option: DesignToolOptionDataProps | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
  product: DesignToolProductProps | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  attributeIndex: number | undefined;
  legacyAWViewModel: AWViewModelBuilder | StormdoorViewModelBuilder | undefined;
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
