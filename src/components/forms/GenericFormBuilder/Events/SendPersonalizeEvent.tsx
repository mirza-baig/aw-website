'use client';

import { event } from '@sitecore-content-sdk/events';
import { buildPersonalizePayload } from 'lib/personalize/build-personalize-payload';
import { useEffect } from 'react';

type AttributeItem = {
  id: string;
  key?: {
    value?: string;
  };
  constantValue?: {
    value?: string;
  };
  constantText?: {
    value?: string;
  };
};

type Props = {
  fields?: {
    data?: {
      Datasource?: {
        eventType?: {
          value?: string;
        };
        children?: {
          results?: AttributeItem[];
        };
      };
    };
  };
};

export default function SendPersonalizeEvent(props: Props) {
  const datasource = props.fields?.data?.Datasource;
  const eventType = datasource?.eventType?.value;

  useEffect(() => {
    if (!eventType) {
      console.warn(
        '[CDP] No event type specified in datasource, skipping Personalization Start Event'
      );
      return;
    }

    const attributesList = datasource?.children?.results ?? [];
    const startPayload = buildPersonalizePayload({
      eventType,
      attributes: attributesList.map((item) => ({
        id: item.id,
        key: item.key?.value,
        constantValue: item.constantValue?.value,
        constantText: item.constantText?.value,
      })),
    });

    if (!startPayload) {
      return;
    }

    event(startPayload)
      .then(() => console.log('[CDP] Personalize Form Start Event Payload:', startPayload))
      .catch((err) => console.error('[CDP] Personalize Form Start Event Error:', err));
  }, [eventType, datasource]);

  return null;
}
