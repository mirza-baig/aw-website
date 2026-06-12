'use client';

import { ShortDesignUrlContext } from 'components/tool/DesignTool/helpers/ShortDesignUrlContext';
import { useRenoworks } from 'lib/renoworks/renoworks-context';
import { useContext } from 'react';

import { RequestQuoteClient } from './RequestQuoteClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type RequestQuoteClientProps = {
  fields: Sitecore.Forms.Custom.RequestAQuote.RequestAQuote['fields'];
  cardsPlaceholders?: Record<string, React.ReactNode>;
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
    },
  };

  return <RequestQuoteClient {...enhancedProps} />;
}
