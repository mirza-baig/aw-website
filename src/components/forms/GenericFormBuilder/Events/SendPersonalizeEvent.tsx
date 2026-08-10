'use client';

import { event } from '@sitecore-content-sdk/events';
import { FormsConstants } from 'lib/constants/forms-constants';
import { StringConstants } from 'lib/constants/string-constants';
import { startTimer } from 'lib/personalize/abandon-timer';
import { buildPersonalizePayload } from 'lib/personalize/build-personalize-payload';
import { createAbandonPayload, setAbandonSession } from 'lib/personalize/form-abandon-event';
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
        abandonEventType?: {
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
  const abandonEventType = datasource?.abandonEventType?.value;

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

    // For Page Nav Abandon Event
    const getAbandonPayload = () =>
      createAbandonPayload({
        abandonEventType,
        attributes: getMappedAttributes(),
      });
    const clearFormAbandonSessions = () => {
      sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormStep);
      sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormTimeout);
      sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormCompleted);

      sessionStorage.removeItem(StringConstants.AW.ActiveJourneyKey);
      sessionStorage.removeItem(StringConstants.AW.GFBForm.AbandonPayloadKey);
    };
    const fireAbandonEvent = (isInactivity = false) => {
      const alreadyTriggered = sessionStorage.getItem(
        StringConstants.AW.GFBForm.AbandonEventTriggered
      );
      if (alreadyTriggered === 'true') {
        return;
      }
      sessionStorage.setItem(StringConstants.AW.GFBForm.AbandonEventTriggered, 'true');
      const storedAbandonPayload = getAbandonPayload();
      if (!storedAbandonPayload) {
        return;
      }
      const abandonPayload = {
        ...storedAbandonPayload,
        ext: {
          ...storedAbandonPayload?.ext,
          ...(isInactivity && {
            elapsedMinutes: abandonTimeoutMinutes,
          }),
        },
      };

      event(abandonPayload)
        .then(() => {
          console.log('[CDP] Form Abandon Event:', abandonPayload);
          if (isInactivity) {
            clearFormAbandonSessions();
          }
        })
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
        // START - Set the Abandon session
        const storedAbandonPayload = getAbandonPayload();
        setAbandonSession({
          journeyName: StringConstants.AW.GFBForm.JourneyName, //datasource?.journeyName?.value,
          abandonEventType,
          abandonPayloadKey: StringConstants.AW.GFBForm.AbandonPayloadKey,
          abandonEventTriggered: StringConstants.AW.GFBForm.AbandonEventTriggered,
          payload: storedAbandonPayload?.ext,
        });

        // START ABANDON TIMER
        startTimer(() => {
          fireAbandonEvent(true);
        }, abandonTimeoutMs);
      })
      .catch((err) => console.error('[CDP] Personalize Form Start Event Error:', err));

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{
        isInactivity?: boolean;
      }>;

      fireAbandonEvent(customEvent.detail?.isInactivity === true);
    };

    const handleBeforeUnload = () => {
      const alreadyTriggered = sessionStorage.getItem(
        StringConstants.AW.GFBForm.AbandonEventTriggered
      );
      if (alreadyTriggered === 'true') {
        return;
      }
      const formStep = sessionStorage.getItem(FormsConstants.AW.Form.CCPFormStep);
      if (formStep) {
        sessionStorage.setItem('formReload', 'true');
      }
      const isCompleted = sessionStorage.getItem(FormsConstants.AW.Form.CCPFormCompleted);

      if (isCompleted === 'true') {
        return;
      }

      fireAbandonEvent(false);
    };

    globalThis.addEventListener('aw_ccp_abandon', handler);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      globalThis.removeEventListener('aw_ccp_abandon', handler);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [eventType, datasource, abandonTimeoutMs, abandonTimeoutMinutes, abandonEventType]);

  return null;
}
