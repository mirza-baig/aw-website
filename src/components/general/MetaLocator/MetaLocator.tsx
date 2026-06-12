'use client';

import { event as trackEvent } from '@sitecore-content-sdk/events';
import Component from 'helpers/Component/Component';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useCallback, useEffect, useRef } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type MetaLocatorProps = Sitecore.Components.General.MetaLocator.MetaLocator;

type MetaLocatorMessageDetail = {
  eventName?: string;
  locationId?: string;
  locationName?: string;
  locationCity?: string;
  locationState?: string;
  locationZip?: string;
  locationPhone?: string;
  searchZip?: string;
};

function MetaLocator_Default(props: MetaLocatorProps) {
  const itemId = props.fields?.metaLocatorItemId?.value;
  const abandonTimeoutMinutes = Number(props.fields?.cdpInactivityMinutes?.value ?? 15);
  const abandonTimeoutMs = abandonTimeoutMinutes * 60 * 1000;

  const divRef = useRef<HTMLDivElement>(null);
  const mlPayloadRef = useRef<MetaLocatorMessageDetail | null>(null);
  const abandonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abandonFiredRef = useRef(false);

  useEffect(() => {
    sessionStorage.setItem('awWTBContactClicked', 'false');
  }, []);

  const clearAbandonTimeout = useCallback(() => {
    if (abandonTimeoutRef.current) {
      clearTimeout(abandonTimeoutRef.current);
      abandonTimeoutRef.current = null;
    }
  }, []);

  const baseExtensionData = useCallback((payload: MetaLocatorMessageDetail) => {
    return {
      timestamp: new Date().toISOString(),
      pageUrl: globalThis.location.href,
      referrer: document.referrer,
      dealerId: payload.locationId ?? '',
      dealerName: payload.locationName ?? '',
      dealerPhone: payload.locationPhone ?? '',
      dealerCity: payload.locationCity ?? '',
      dealerState: payload.locationState ?? '',
      dealerZip: payload.locationZip ?? '',
    };
  }, []);

  const fireMapPopupOpen = useCallback(
    (payload: MetaLocatorMessageDetail) => {
      const cdpPayload = {
        type: 'AW:WTB_MAP_POPUP_OPEN',
        channel: 'WEB',
        language: 'EN',
        extensionData: {
          ...baseExtensionData(payload),
          searchZip: payload.searchZip ?? '',
        },
      };

      trackEvent(cdpPayload).catch(console.debug);
    },
    [baseExtensionData]
  );

  const firePhoneClicked = useCallback(
    (payload: MetaLocatorMessageDetail) => {
      const cdpPayload = {
        type: 'AW:WTB_POPUP_CONTACT_CLICK',
        channel: 'WEB',
        language: 'EN',
        extensionData: {
          ...baseExtensionData(payload),
        },
      };

      trackEvent(cdpPayload).catch(console.debug);
    },
    [baseExtensionData]
  );

  const fireAbandon = useCallback(
    (payload: MetaLocatorMessageDetail) => {
      const cdpPayload = {
        type: 'AW:WTB_ABANDON',
        channel: 'WEB',
        language: 'EN',
        extensionData: {
          ...baseExtensionData(payload),
          elapsedMinutes: abandonTimeoutMinutes,
          searchZip: payload.searchZip ?? '',
        },
      };

      trackEvent(cdpPayload).catch(console.debug);
    },
    [abandonTimeoutMinutes, baseExtensionData]
  );

  const startAbandonTimeout = useCallback(() => {
    clearAbandonTimeout();
    abandonFiredRef.current = false;

    abandonTimeoutRef.current = setTimeout(() => {
      const contactClicked = sessionStorage.getItem('awWTBContactClicked') === 'true';
      const latestPayload = mlPayloadRef.current;

      if (contactClicked || abandonFiredRef.current || !latestPayload) {
        clearAbandonTimeout();
        return;
      }

      abandonFiredRef.current = true;
      fireAbandon(latestPayload);
      clearAbandonTimeout();
    }, abandonTimeoutMs);
  }, [abandonTimeoutMs, clearAbandonTimeout, fireAbandon]);

  useEffect(() => {
    const handleMetaLocatorIFrameMessage = (e: Event) => {
      const payload = (e as CustomEvent<MetaLocatorMessageDetail>).detail;

      if (
        !payload?.eventName ||
        (payload.eventName !== 'ml_markeropened' && payload.eventName !== 'ml_phoneClicked')
      ) {
        return;
      }

      mlPayloadRef.current = payload;

      if (payload.eventName === 'ml_markeropened') {
        sessionStorage.setItem('awWTBContactClicked', 'false');

        fireMapPopupOpen(payload);
        startAbandonTimeout();
      } else if (payload.eventName === 'ml_phoneClicked') {
        sessionStorage.setItem('awWTBContactClicked', 'true');
        clearAbandonTimeout();
        firePhoneClicked(payload);
      }
    };

    globalThis.addEventListener('ml-iframe-message', handleMetaLocatorIFrameMessage);

    return () => {
      globalThis.removeEventListener('ml-iframe-message', handleMetaLocatorIFrameMessage);
      clearAbandonTimeout();
    };
  }, [clearAbandonTimeout, fireMapPopupOpen, firePhoneClicked, startAbandonTimeout]);

  useEffect(() => {
    if (props.fields?.metaLocatorScript?.value) {
      try {
        const fragment = document
          .createRange()
          .createContextualFragment(props.fields.metaLocatorScript.value);
        divRef.current?.append(fragment);
      } catch (error) {
        console.error('Error creating fragment:', error);
      }
    }
    // Suggested deps are coming from layout service. We can ignore useEffect warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!itemId) {
    return <></>;
  }

  return (
    <Component
      variant="full"
      backgroundVariant=""
      sectionWrapperClasses=""
      gap="gap-x-0"
      padding="px-0"
      dataComponent="general/metaLocator"
      {...props}
    >
      <div className="col-span-12">
        <div data-metalocator="locator" data-metalocator-itemid={itemId}></div>
        <div className="body-copy col-span-12 **:max-w-full" ref={divRef}></div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(MetaLocator_Default);
