'use client';

import { useRenoworks } from 'components/tool/DesignTool/helpers/js/renoworks-context';
import { ShortDesignUrlContext } from 'components/tool/DesignTool/helpers/ShortDesignUrlContext';
import { useContext } from 'react';

import { RequestQuoteClient } from './RequestQuoteClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type RequestQuoteClientProps = {
  fields: Sitecore.Forms.Custom.RequestAQuote.RequestAQuote['fields'];
  cardsPlaceholders?: Record<string, React.ReactNode>;
  params?: Record<string, string>;
};

export function FormWrapper(props: Readonly<RequestQuoteClientProps>) {
  const { product } = useRenoworks();
  const shortDesignUrl = useContext(ShortDesignUrlContext);

  const _injectedFields = {
    DESIGNSPECS: shortDesignUrl,
    DESIGNTOOLSERIES: product?.renoworksKey,
  };
  const enhancedProps = {
    ...(props ?? {}),
    fields: {
      ...(props?.fields ?? {}),
      _injectedFields,
      params: props?.params,
    },
  };

  return <RequestQuoteClient {...enhancedProps} />;
}
