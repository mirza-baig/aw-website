'use client';

import config from 'aw.config.client';
import Component from 'helpers/Component/Component';
import KampyleScript from 'helpers/KampyleScript/KampyleScript';
import { MapProductConfiguration } from 'lib/design-tool/design-tool-utils';
import { AttributeParameters, Renoworks, RenoworksProduct } from 'lib/renoworks';
import { VisualizationReferralProvider } from 'lib/renoworks/visualization-referral-context';
import { ReactNode } from 'react';

import { Design } from './views/PDT_Design.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function getUrlParts(url: string) {
  const urlParsed = new URL(url, 'https://server');

  const pathRegex = new RegExp(/([^#?]*)(?:#\/(\d+))?(?:\?(.*))?/g);
  const matches = pathRegex.exec(urlParsed?.hash || '') ?? [];

  return {
    pathName: urlParsed?.pathname,
    attributeIndex: parseInt(matches[2]) || 0,
    query: urlParsed?.search?.replace('?', ''),
  };
}

type ProductDesignToolProps = Sitecore.Components.Tool.ProductDesignTool.ProductDesignTool & {
  placeholder: ReactNode;
  visualizerHandshakeUrlEnabled?: boolean;
};

// Define the ProductDesignTool component
export function ProductDesignToolClient(props: ProductDesignToolProps) {
  const productConfiguration = MapProductConfiguration(props.fields?.productConfiguration?.fields);

  const product: RenoworksProduct = {
    renoworksKey: props.fields?.product?.fields?.renoworksKey?.value?.toLowerCase(),
    configuration: productConfiguration ? [productConfiguration] : undefined,
  };

  const pathMapper = (path: string) => {
    const urlParts = getUrlParts(path);

    const attributes: AttributeParameters = {};
    urlParts.query.split('&').forEach((x: string) => {
      const queryKeyValue = x.split('=');
      attributes[queryKeyValue[0] as keyof unknown] = decodeURIComponent(queryKeyValue[1]);
    });
    return attributes;
  };

  const apiConfig = {
    host: config.renoworks.apiUrl,
    prefix: config.renoworks.rwd,
  };

  return (
    <Component variant="lg" dataComponent="tool/product-design-tool" {...props}>
      <VisualizationReferralProvider fields={props.fields}>
        <Renoworks
          product={product}
          pathMapper={pathMapper}
          apiConfig={apiConfig}
          pageSize={0}
          visualizerHandshakeUrlEnabled={props.visualizerHandshakeUrlEnabled}
        >
          <Design {...props} />
          <KampyleScript />
        </Renoworks>
      </VisualizationReferralProvider>
    </Component>
  );
}
