'use client';

import { event } from '@sitecore-content-sdk/events';
import { FormsConstants } from 'lib/constants/forms-constants';
import { startTimer } from 'lib/personalize/abandon-tracker';
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
        cdpInactivityMinutes?: {
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

  const abandonTimeoutMinutes = Number(datasource?.cdpInactivityMinutes?.value ?? 15);
  const abandonTimeoutMs = abandonTimeoutMinutes * 60 * 1000; // Convert minutes to milliseconds

  useEffect(() => {
    if (!eventType) {
      console.warn(
        '[CDP] No event type specified in datasource, skipping Personalization Start Event'
      );
      return;
    }
    const getMappedAttributes = () => {
      const attributesList = datasource?.children?.results ?? [];

      return attributesList.map((item) => ({
        id: item.id,
        key: item.key?.value,
        constantValue: item.constantValue?.value,
        constantText: item.constantText?.value,
      }));
    };

    const fireAbandonEvent = () => {
      const formStep = Number(sessionStorage.getItem(FormsConstants.AW.Form.CCPFormStep) || 1);
      const abandonPayload = buildPersonalizePayload({
        eventType: 'AW:FORM_CCP_ABANDON',
        attributes: getMappedAttributes(),
        additionalExt: {
          elapsedMinutes: abandonTimeoutMinutes,
          stepAbandonedAt: formStep,
        },
      });

      if (!abandonPayload) {
        return;
      }

      event(abandonPayload)
        .then(() => console.log('[CDP] Form Abandon Event:', abandonPayload))
        .catch((err) => console.error('[CDP] Form Abandon Error:', err));
    };

    const startPayload = buildPersonalizePayload({
      eventType,
      attributes: getMappedAttributes(),
    });

    if (!startPayload) {
      return;
    }

    event(startPayload)
      .then(() => {
        console.log('[CDP] Personalize Form Start Event Payload:', startPayload);

        // clear all the session on payload start
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormStep);
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormTimeout);
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormCompleted);

        // store timeout globally
        sessionStorage.setItem(FormsConstants.AW.Form.CCPFormTimeout, String(abandonTimeoutMs));
        // START ABANDON TIMER
        startTimer(() => {
          fireAbandonEvent();
        }, abandonTimeoutMs);
      })
      .catch((err) => console.error('[CDP] Personalize Form Start Event Error:', err));

    const handler = () => {
      fireAbandonEvent();
    };

    globalThis.addEventListener('aw_ccp_abandon', handler);

    return () => {
      globalThis.removeEventListener('aw_ccp_abandon', handler);
    };
  }, [eventType, datasource, abandonTimeoutMs, abandonTimeoutMinutes]);

  return null;
}
