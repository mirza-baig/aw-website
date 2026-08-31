'use client';

import { resolveAttributeValue } from 'lib/tracking/resolve-attribute-value';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

type AttributeItem = {
  id: string;
  name: string;
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
        gtmEventName?: {
          value?: string;
        };
        children?: {
          results?: AttributeItem[];
        };
      };
    };
  };

  formValues?: Record<string, unknown>;
};

export default function SendGTMEvent(props: Props) {
  const datasource = props.fields?.data?.Datasource;
  const gtmEventName = datasource?.gtmEventName?.value;
  useEffect(() => {
    if (!gtmEventName) {
      console.warn('[GTM] No event name specified');
      return;
    }
    const attributeParams = (datasource?.children?.results ?? []).reduce(
      (acc, attribute) => {
        const key = attribute.key?.value;

        if (isNullOrWhitespace(key)) {
          return acc;
        }
        // Constant Attribute
        const value = attribute.constantValue?.value
          ? resolveAttributeValue(attribute.constantValue.value, key)
          : attribute.constantText?.value;

        if (value !== undefined) {
          acc[key] = value;
        }
        /* Field Attribute not handled as its the start event and we don't have the form values yet.
           The field attributes will be handled in the submit action. */

        return acc;
      },
      {} as Record<string, unknown>
    );

    const payload = {
      event: gtmEventName,
      ...attributeParams,
    };

    TagManager.dataLayer({
      dataLayer: payload,
    });

    console.log('[GTM] Initial Load Event:', payload);
  }, [gtmEventName, datasource, props.formValues]);

  return null;
}
