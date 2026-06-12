import { useAsPath } from 'lib/hooks/use-as-path';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AWViewModelBuilder } from './awviewmodelbuilder';
import { ViewModel } from './designtool';
import { StormdoorViewModelBuilder } from './stormdoorviewmodelbuilder';

export type AttributeParameters = { [name: string]: string };

export type RenoworksContextType = {
  viewModel: ViewModel | undefined;
  setProductAttributes: (parameters: AttributeParameters) => void;
  product: RenoworksProduct;
};

export const RenoworksContext = createContext<RenoworksContextType | undefined>(undefined);

// Storms doors only have an exterior, so we need to handle that
const StormdoorProductPrefixes = ['aw_6_series_', 'aw_8_series_', 'aw_10_series_', 'emco_'];

const IsStormDoor = (productId: string) => {
  return StormdoorProductPrefixes.some((_) => productId.startsWith(_));
};

export type RenoworksProduct = {
  renoworksKey: string;
  // text: {
  //   sizing: string;
  //   customSizing: string;
  //   disclaimer: string;
  // };
  // tertiaryLinks: {
  //   customSizesLink: string;
  // };
  configuration: [RenoworksProductConfiguartion] | undefined;
};

export type RenoworksProductConfiguartion = {
  renoworksName: string;
  dimensionMappings: RenoworksProductConfigurationDimensionMapping[];
};

export type RenoworksProductConfigurationDimensionMapping = {
  productNumber: string;
  width: string;
  height: string;
  grilleLightsWide: string;
  grilleLightsHigh: string;
  fractionalWidth: string;
  fractionalHeight: string;
};

export type RenoworksApiConfig = {
  host: string;
  prefix: string;
};

export type RenoworksProps = {
  product: RenoworksProduct;
  apiConfig: RenoworksApiConfig;
  pageSize?: number;
  pathMapper?: (path: string) => AttributeParameters;
};

export const Renoworks = ({
  product,
  apiConfig,
  pageSize,
  pathMapper,
  children,
}: PropsWithChildren<RenoworksProps>) => {
  const [viewModel, setViewModel] = useState<ViewModel | undefined>();
  const asPath = useAsPath().replace(/\+/g, '%20'); // router.asPath didn't encode spaces as '+', but rather '%20', so we need to replace them back
  const setProductAttributes = useCallback(
    (attributes: AttributeParameters) => {
      const viewModelBuilder = IsStormDoor(product.renoworksKey.toLowerCase())
        ? new StormdoorViewModelBuilder(product, apiConfig)
        : new AWViewModelBuilder(product, apiConfig, pageSize);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      viewModelBuilder.product &&
        viewModelBuilder
          .buildViewModelForQueryString(attributes)
          .then(() => {
            setViewModel(viewModelBuilder.viewModel);
          })
          .catch((err) => {
            // TODO: Handle this

            console.log(err);
          });
    },
    [product, apiConfig, pageSize]
  );

  useEffect(() => {
    if (!pathMapper) {
      return;
    }

    const attributes = pathMapper(asPath);

    setProductAttributes(attributes);
  }, [asPath, pathMapper, setProductAttributes]);

  return (
    <RenoworksContext.Provider value={{ viewModel, setProductAttributes, product }}>
      {children}
    </RenoworksContext.Provider>
  );
};

export const useRenoworks = () => {
  const context = useContext(RenoworksContext);

  if (!context) {
    throw new Error('useRenoworks must be used inside the Renoworks component');
  }

  return context;
};
