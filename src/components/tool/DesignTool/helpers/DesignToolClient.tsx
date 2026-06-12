'use client';

import { Item, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useAsPath } from 'lib/hooks/use-as-path';
import { JSX, ReactNode, useEffect, useState } from 'react';
import { DesignToolQueryItem } from 'src/app/api/aw/design-tool/design-tool-option-by-id/get-option-by-id';
import KampyleScript from 'src/helpers/KampyleScript/KampyleScript';
import { useTheme } from 'src/lib/context/ThemeContext';

import {
  DesignToolDataProps,
  DesignToolOptionDataProps,
  FilterForOption,
  FilterForProduct,
  mapDesignToolPropsToViewModelProps,
  MapOption,
  MapProduct,
} from './DesignTool.helper';
import { DesignToolTheme, DesignToolThemeSubType } from './DesignTool.theme';
import {
  DefaultDesignToolRouteData,
  DesignToolContext,
  DesignToolRouteData,
  DesignToolRouter,
} from './DesignToolContext.helper';
import { AWViewModelBuilder } from './js/awviewmodelbuilder';
import { AttributeParameters, Renoworks } from './js/renoworks-context';
import { StormdoorViewModelBuilder } from './js/stormdoorviewmodelbuilder';
import { GetUrlParts } from './js/utils';
import { HeaderLogo } from './partial/HeaderLogo.helper';
import { HeaderNav } from './partial/HeaderNav.helper';
import { MainBackground } from './partial/MainBackground.helper';
import { Design, DesignViewProps } from './views/Design.helper';
import { Select } from './views/Select.helper';
import { Start } from './views/Start.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

// Storms doors only have an exterior, so we need to handle that
const StormdoorProductPrefixes = ['aw_6_series_', 'aw_8_series_', 'aw_10_series_', 'emco_'];

const IsStormDoor = (productId: string) => {
  return StormdoorProductPrefixes.some((_) => productId?.startsWith(_));
};

const RenderCurrentView = (
  designToolRouter: DesignToolRouter,
  moduleData: DesignToolDataProps,
  props: DesignToolProps
): JSX.Element => {
  if (
    designToolRouter?.routeData?.option == undefined &&
    designToolRouter?.routeData?.product == undefined
  ) {
    return <Start {...moduleData}></Start>;
  } else if (
    designToolRouter.routeData?.option != undefined &&
    designToolRouter?.routeData?.product == undefined
  ) {
    return <Select {...designToolRouter.routeData?.option}></Select>;
  } else if (designToolRouter.routeData?.product != undefined) {
    const designViewProps: DesignViewProps = {
      attributeIndex: designToolRouter?.routeData?.attributeIndex ?? 0,
      product: designToolRouter?.routeData?.product,
      options: designToolRouter?.routeData.options.filter(
        (_: DesignToolOptionDataProps) => !_.parentId
      ),
      props: props,
    };
    return <Design {...designViewProps}></Design>;
  }

  return <></>;
};

type DesignToolProps = Sitecore.Components.Tool.DesignTool.DesignTool & {
  placeholder: ReactNode;
};

export function DesignToolClient(props: DesignToolProps): JSX.Element {
  const asPath = useAsPath();
  const [previewImage, setPreviewImage] = useState<boolean | undefined>(true);
  const moduleData = mapDesignToolPropsToViewModelProps(props);
  const [browserReady, setBrowserReady] = useState<boolean>(false);
  useEffect(() => setBrowserReady(true), [props]);

  const [routeData, setRouteData] = useState<DesignToolRouteData>(DefaultDesignToolRouteData);
  const [navigationVisible, setNavigationVisible] = useState<boolean>(false);

  const designToolRouter = new DesignToolRouter(moduleData, routeData, setRouteData);

  const { themeData } = useTheme(DesignToolTheme(navigationVisible));
  const theme = themeData as DesignToolThemeSubType;

  const { page } = useSitecore();
  const language = page.locale ?? 'en';

  const updateRouteData = (updateAWViewModel = true) => {
    const urlParts = GetUrlParts(asPath);
    let newAWViewModel = undefined;

    if (urlParts?.attributeIndex) {
      const attributeIndex = parseInt(urlParts.attributeIndex);
      const product = designToolRouter.getProductFromProductId(urlParts.option);
      if (updateAWViewModel) {
        newAWViewModel = IsStormDoor(product?.renoworksKey?.toLowerCase())
          ? new StormdoorViewModelBuilder(product, designToolRouter.moduleData)
          : new AWViewModelBuilder(product, designToolRouter.moduleData);
      }
      designToolRouter.setRouteDataFromProduct(product, attributeIndex, newAWViewModel);
    } else if (urlParts?.option) {
      if (updateAWViewModel) {
        newAWViewModel = new AWViewModelBuilder();
      }

      designToolRouter.setRouteDataFromOptionId(urlParts.option, newAWViewModel);
    } else {
      designToolRouter.clearRouteData();
    }
  };

  // add the designtool2 class to the body so that css overrides take place.
  useEffect(() => {
    document.body.classList.add('design-tool-2-module');
  });

  useEffect(() => {
    async function getProductsById() {
      try {
        const urlParts = GetUrlParts(asPath);
        let fetchPath = '/api/aw/design-tool/design-tool-option-by-id';
        if (urlParts?.attributeIndex) {
          fetchPath = '/api/aw/design-tool/design-tool-product-by-id';
        }
        if (urlParts?.option && urlParts?.option === designToolRouter?.routeData?.product?.id) {
          return;
        }

        try {
          const response = await fetch(fetchPath, {
            method: 'POST',
            body: JSON.stringify({
              itemId: urlParts?.option ?? props.rendering.dataSource,
              language,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const queryResultItem = (await response.json()) as Item & DesignToolQueryItem;

            let parentObj: DesignToolOptionDataProps | null;
            if (FilterForOption(queryResultItem)) {
              const mappedOption = MapOption(designToolRouter.routeData.options, queryResultItem);
              const parentIndex = designToolRouter.moduleData.options.findIndex(
                (option) => option?.id === mappedOption?.id
              );
              if (parentIndex > -1) {
                designToolRouter.moduleData.options[parentIndex] = mappedOption;
              } else {
                designToolRouter.moduleData.options.push(mappedOption);
              }
              parentObj = mappedOption;
            } else if (FilterForProduct(queryResultItem)) {
              const mappedProduct = MapProduct(designToolRouter.routeData.options, queryResultItem);
              const parentIndex = designToolRouter.moduleData.products.findIndex(
                (product) => product.id === mappedProduct?.id
              );
              if (parentIndex > -1) {
                designToolRouter.moduleData.products[parentIndex] = mappedProduct;
              } else {
                designToolRouter.moduleData.products.push(mappedProduct);
              }
              parentObj = mappedProduct;
            }

            const newOptions = queryResultItem.children
              .filter((_: Item & DesignToolQueryItem) => FilterForOption(_))
              .map((x) => MapOption(designToolRouter.routeData.options, x));

            newOptions.forEach((option) => {
              parentObj?.options?.push(option?.id);

              const index = designToolRouter.moduleData.options?.findIndex(
                (routeOption) => routeOption?.id === option?.id
              );
              if (index > -1) {
                designToolRouter.moduleData.options[index] = option;
              } else {
                designToolRouter.moduleData.options.push(option);
              }
            });

            const newProducts = queryResultItem.children
              .filter((_: Item & DesignToolQueryItem) => FilterForProduct(_))
              .map((x) => MapProduct(designToolRouter.routeData.options, x));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newProducts.forEach((product: any) => {
              parentObj?.products.push(product.id);

              const index = designToolRouter.moduleData.products.findIndex(
                (routeOption) => routeOption.id === product?.id
              );
              if (index > -1) {
                designToolRouter.moduleData.products[index] = product;
              } else {
                designToolRouter.moduleData.products.push(product);
              }
            });

            const updateProduct = routeData.legacyAWViewModel?.product?.id != urlParts.option;
            updateRouteData(updateProduct);
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
    getProductsById();
  }, [asPath]);

  const RenderCSSHidingBlock = () => {
    return (
      <style>
        {`body.design-tool-2-module {
            overflow-x: hidden;
          }

          @media screen and (min-width:672px)
          {
            body.design-tool-2-module header #header,
            body.design-tool-2-module section.breadcrumbs-module,
            body.design-tool-2-module:not(.design-tool-2-navigation-visible) footer #footer,
            body.design-tool-2-module:not(.design-tool-2-navigation-visible) #pre-footer
            {
              visibility: hidden;
              opacity: 0;
              height: 0;
              transition: visibility 0s linear 300ms, opacity 300ms;
              overflow: hidden;
            }

            body.design-tool-2-module header #header.visible,
            body.design-tool-2-module section.breadcrumbs-module.visible,
            body.design-tool-2-module.design-tool-2-navigation-visible footer #footer,
            body.design-tool-2-module.design-tool-2-navigation-visible #pre-footer
            {
              visibility: visible;
              opacity: 1;
              height: auto;
              transition: visibility 0s linear 0s, opacity 300ms;
            }

            body.designtool2-module a#backToTop
            {
              bottom: 60px;
            }
          }

          @media print {
            #header, #footer, #pre-footer {
              display: none;
            }
          }`}
      </style>
    );
  };

  const pathMapper = (path: string) => {
    const urlParts = GetUrlParts(path);

    const attributes: AttributeParameters = {};
    urlParts.query?.split('&').forEach((x: string) => {
      const queryKeyValue = x.split('=');
      attributes[queryKeyValue[0] as keyof unknown] = decodeURIComponent(queryKeyValue[1]);
    });

    return attributes;
  };

  return (
    <>
      {browserReady && (
        <div className={theme.classes.wrapper}>
          <DesignToolContext.Provider
            value={{
              designToolProps: props,
              designToolRouter: designToolRouter,
              viewModel: moduleData,
              routeData: routeData,
              setRouteData: setRouteData,
              renderingData: props.rendering,
              previewImage: previewImage,
              setPreviewImage: setPreviewImage,
            }}
          >
            <Renoworks
              product={designToolRouter?.routeData?.product}
              pathMapper={pathMapper}
              apiConfig={moduleData}
              pageSize={0}
            >
              <MainBackground {...moduleData}></MainBackground>
              <HeaderLogo
                props={moduleData}
                navigationVisible={navigationVisible}
                setNavigationVisible={setNavigationVisible}
              ></HeaderLogo>
              {(designToolRouter?.routeData?.option || designToolRouter?.routeData?.product) && (
                <div className={theme.classes.headerNavWrapper}>
                  <HeaderNav></HeaderNav>
                </div>
              )}
              <div className={theme.classes.stepWrapper}>
                {RenderCurrentView(designToolRouter, designToolRouter.moduleData, props)}
              </div>
              {RenderCSSHidingBlock()}
            </Renoworks>
            <KampyleScript />
          </DesignToolContext.Provider>
        </div>
      )}
    </>
  );
}
