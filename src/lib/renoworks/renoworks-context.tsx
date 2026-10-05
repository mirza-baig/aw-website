import { useAsPath } from 'lib/hooks/use-as-path';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AWViewModelBuilder } from './awviewmodelbuilder';
import { ViewModel } from './designtool';
import { buildVisualizerUrl, RenoworksProductConfig } from './product-config';
import { RenoworksKeyUsage, RenoworksProductSide } from './renoworks';
import { StormdoorViewModelBuilder } from './stormdoorviewmodelbuilder';

export type AttributeParameters = { [name: string]: string };

export type RenoworksContextType = {
  viewModel: ViewModel | undefined;
  setProductAttributes: (parameters: AttributeParameters) => void;
  product: RenoworksProduct;
  productConfig: RenoworksProductConfig | undefined;
  visualizerUrl: string | undefined;
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
  visualizerHandshakeUrlEnabled?: boolean;
};
const toPlainSettings = (encoded: string): string => {
  if (!encoded) {
    return '';
  }
  try {
    return decodeURIComponent(encoded.replaceAll('+', ' '));
  } catch {
    return encoded;
  }
};

export const Renoworks = ({
  product,
  apiConfig,
  pageSize,
  pathMapper,
  visualizerHandshakeUrlEnabled = false,
  children,
}: PropsWithChildren<RenoworksProps>) => {
  const [viewModel, setViewModel] = useState<ViewModel | undefined>();
  const asPath = useAsPath().replaceAll('+', '%20'); // router.asPath didn't encode spaces as '+', but rather '%20', so we need to replace them back
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

  const productConfig = useMemo<RenoworksProductConfig | undefined>(() => {
    if (!visualizerHandshakeUrlEnabled) {
      return undefined;
    }

    const key = product?.renoworksKey;
    const psv = viewModel?.renoworksResult?.productSettingValues;

    if (!key || !psv) {
      return undefined;
    }
    if (IsStormDoor(key.toLowerCase())) {
      return undefined;
    }

    const interior = psv.toRenoworks(
      RenoworksProductSide.Interior,
      RenoworksKeyUsage.ProductOptions
    );
    const exterior = psv.toRenoworks(
      RenoworksProductSide.Exterior,
      RenoworksKeyUsage.ProductOptions
    );

    if (!interior?.settings || !exterior?.settings) {
      return undefined;
    }

    return {
      exterior: {
        rwd: `exterior/${key}_EXT.rwd`,
        settings: toPlainSettings(exterior.settings),
      },
      interior: {
        rwd: `interior/${key}_INT.rwd`,
        settings: toPlainSettings(interior.settings),
      },
    };
  }, [viewModel, product, visualizerHandshakeUrlEnabled]);

  const visualizerUrl = useMemo<string | undefined>(() => {
    if (!productConfig) {
      return undefined;
    }
    try {
      return buildVisualizerUrl(productConfig);
    } catch (err) {
      // Missing env var or invalid pair — log and keep the URL undefined so
      // consumers can decide how to fall back.
      console.warn('[Renoworks] Failed to build visualizer URL', err);
      return undefined;
    }
  }, [productConfig]);

  const contextValue = useMemo(
    () => ({ viewModel, setProductAttributes, product, productConfig, visualizerUrl }),
    [viewModel, setProductAttributes, product, productConfig, visualizerUrl]
  );

  return <RenoworksContext.Provider value={contextValue}>{children}</RenoworksContext.Provider>;
};

export const useRenoworks = () => {
  const context = useContext(RenoworksContext);

  if (!context) {
    throw new Error('useRenoworks must be used inside the Renoworks component');
  }

  return context;
};
