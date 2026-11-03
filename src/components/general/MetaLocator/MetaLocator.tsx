'use client';

import { event as trackEvent } from '@sitecore-content-sdk/events';
import { awHeaderMenuClasses } from 'components/site/AWHeader/helpers/aw-header-menu.types';
import Component from 'helpers/Component/Component';
import { StringConstants } from 'lib/constants/string-constants';
import { clearSessionStorageItems } from 'lib/utils/client-storage-utils/clear-session-storage-items';
import { setSessionStorageItems } from 'lib/utils/client-storage-utils/set-session-storage-items';
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

const metalocatorHostnamePattern =
  /^(?:locations\.andersenwindows\.com|[^.]+\.locationlandingpages\.com|admin\.metalocator\.com)$/;

function MetaLocatorNavFallback() {
  return (
    <script
      data-metalocator-nav-fallback=""
      dangerouslySetInnerHTML={{
        __html: `(function () {
  if (!new RegExp(${JSON.stringify(metalocatorHostnamePattern.source)}).test(location.hostname)) return;
  var menuClasses = ${JSON.stringify(awHeaderMenuClasses)};
  function init() {
    var header = document.getElementById('awHeader');
    var list = header && header.querySelector('.main-nav ul');
    var content = header && header.querySelector('.' + menuClasses.content);
    var panels = header && header.querySelectorAll('.' + menuClasses.panel);
    if (!list || !content || !panels.length) return;
    function close() {
      content.classList.replace(menuClasses.contentVisible, menuClasses.hidden);
      panels.forEach(function (panel) {
        panel.classList.replace(menuClasses.panelVisible, menuClasses.hidden);
        panel.setAttribute('aria-hidden', 'true');
      });
    }
    document.addEventListener('click', function (event) {
      if (document.documentElement.dataset.metalocatorReactReady === 'true') return;
      var item = event.target.closest('li');
      if (item && item.parentElement === list && item.querySelector(':scope > span')) {
        var title = item.dataset.navGroupTitle;
        if (!title) return;
        var matchingPanels = Array.prototype.filter.call(panels, function (panel) {
          return panel.dataset.navGroupTitle === title && panel.querySelector('.megamenu-section > *');
        });
        if (!matchingPanels.length) return;
        var wasOpen = matchingPanels.some(function (panel) {
          return panel.classList.contains(menuClasses.panelVisible);
        });
        close();
        if (!wasOpen) {
          content.classList.replace(menuClasses.hidden, menuClasses.contentVisible);
          matchingPanels.forEach(function (panel) {
            panel.classList.replace(menuClasses.hidden, menuClasses.panelVisible);
            panel.setAttribute('aria-hidden', 'false');
          });
        }
      } else if (!header.contains(event.target)) close();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.documentElement.dataset.metalocatorReactReady !== 'true') close();
    });
  }
  function swap(el, from, to) {
    if (!el) return;
    el.classList.remove(from);
    el.classList.add(to);
  }
  function initMobile() {
    var hidden = menuClasses.hidden;
    var shown = menuClasses.contentVisible;
    function each(root, selector, fn) {
      Array.prototype.forEach.call(root.querySelectorAll(selector), fn);
    }
    function closeSubmenus(scope) {
      each(scope, '[data-mobile-submenu]', function (el) { swap(el, shown, hidden); });
      each(scope, '[data-mobile-nav-list]', function (el) { swap(el, hidden, shown); });
    }
    function closePanels(header) {
      closeSubmenus(header);
      each(header, '[data-mobile-nav-panel], [data-mobile-nav-menu]', function (el) { swap(el, shown, hidden); });
      swap(header.querySelector('[data-mobile-nav-root]'), hidden, shown);
      swap(header.querySelector('[data-mobile-nav-back]'), 'flex', 'hidden');
    }
    function setDrawer(header, open) {
      var drawer = header.querySelector('[data-mobile-nav-drawer]');
      if (!drawer) return;
      drawer.classList.toggle(hidden, !open);
      swap(header.querySelector('[data-mobile-nav-open]'), open ? 'block' : 'hidden', open ? 'hidden' : 'block');
      header.classList.toggle('overflow-auto', open);
      header.classList.toggle('h-full', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) closePanels(header);
    }
    document.addEventListener('click', function (event) {
      if (document.documentElement.dataset.metalocatorReactReady === 'true') return;
      var header = document.getElementById('awHeaderMobile');
      if (!header || !header.contains(event.target)) return;
      var target = event.target.closest('[data-mobile-nav-open], [data-mobile-nav-close], [data-mobile-nav-back], [data-mobile-nav-group], [data-mobile-submenu-target]');
      if (!target) return;
      if (target.hasAttribute('data-mobile-nav-open')) return setDrawer(header, true);
      if (target.hasAttribute('data-mobile-nav-close')) return setDrawer(header, false);
      if (target.hasAttribute('data-mobile-nav-back')) {
        var openSub = Array.prototype.some.call(header.querySelectorAll('[data-mobile-submenu]'), function (el) {
          return el.classList.contains(shown);
        });
        return openSub ? closeSubmenus(header) : closePanels(header);
      }
      if (target.hasAttribute('data-mobile-nav-group')) {
        var title = target.dataset.navGroupTitle;
        var panel = title && Array.prototype.find.call(header.querySelectorAll('[data-mobile-nav-panel]'), function (el) {
          return el.dataset.navGroupTitle === title;
        });
        if (!panel) return;
        closePanels(header);
        swap(panel, hidden, shown);
        swap(panel.querySelector('[data-mobile-nav-menu]'), hidden, shown);
        swap(header.querySelector('[data-mobile-nav-root]'), shown, hidden);
        swap(header.querySelector('[data-mobile-nav-back]'), 'hidden', 'flex');
        return;
      }
      var menu = target.closest('[data-mobile-nav-menu]');
      var id = target.getAttribute('data-mobile-submenu-target');
      var sub = menu && Array.prototype.find.call(menu.querySelectorAll('[data-mobile-submenu]'), function (el) {
        return el.getAttribute('data-mobile-submenu') === id;
      });
      if (!sub) return;
      var wasOpen = sub.classList.contains(shown);
      closeSubmenus(menu);
      if (!wasOpen) {
        swap(sub, hidden, shown);
        each(menu, '[data-mobile-nav-list]', function (el) { swap(el, shown, hidden); });
      }
    });
  }
  initMobile();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`,
      }}
    />
  );
}

function MetaLocator_Default(props: MetaLocatorProps) {
  const itemId = props.fields?.metaLocatorItemId?.value;
  const abandonTimeoutMinutes = Number(props.fields?.cdpInactivityMinutes?.value ?? 15);
  const abandonTimeoutMs = abandonTimeoutMinutes * 60 * 1000;

  const divRef = useRef<HTMLDivElement>(null);
  const mlPayloadRef = useRef<MetaLocatorMessageDetail | null>(null);
  const abandonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abandonFiredRef = useRef(false);

  useEffect(() => {
    if (metalocatorHostnamePattern.test(globalThis.location.hostname)) {
      document.documentElement.dataset.metalocatorReactReady = 'true';
    }
  }, []);

  useEffect(() => {
    setSessionStorageItems({ [StringConstants.AW.WTB.ContactClickedKey]: 'false' });
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
        type: StringConstants.AW.WTB.MapPopupOpenEventType,
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
        type: StringConstants.AW.WTB.ContactClickEventType,
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
    (payload: MetaLocatorMessageDetail, includeElapsedMinutes = false) => {
      const cdpPayload = {
        type: StringConstants.AW.WTB.AbandonEventType,
        channel: 'WEB',
        language: 'EN',
        extensionData: {
          ...baseExtensionData(payload),
          ...(includeElapsedMinutes && { elapsedMinutes: abandonTimeoutMinutes }),
          searchZip: payload.searchZip ?? '',
        },
      };

      trackEvent(cdpPayload).catch(console.debug);
    },
    [abandonTimeoutMinutes, baseExtensionData]
  );

  const updateAbandonSession = useCallback(
    (payload: MetaLocatorMessageDetail) => {
      const extensionData = {
        ...baseExtensionData(payload),
        searchZip: payload.searchZip ?? '',
      };

      setSessionStorageItems({
        [StringConstants.AW.WTB.ActiveJourneyKey]: JSON.stringify({
          journey: StringConstants.AW.WTB.JourneyName,
          prevPath: globalThis.location.pathname,
          eventType: StringConstants.AW.WTB.AbandonEventType,
          payloadKey: StringConstants.AW.WTB.AbandonPayloadKey,
        }),
        [StringConstants.AW.WTB.AbandonPayloadKey]: JSON.stringify(extensionData),
      });
      clearSessionStorageItems([StringConstants.AW.WTB.AbandonEventTriggered]);
    },
    [baseExtensionData]
  );

  const clearAbandon = useCallback(() => {
    clearAbandonTimeout();
    clearSessionStorageItems([
      StringConstants.AW.WTB.ActiveJourneyKey,
      StringConstants.AW.WTB.AbandonPayloadKey,
      StringConstants.AW.WTB.AbandonEventTriggered,
    ]);
  }, [clearAbandonTimeout]);

  const startAbandonTimeout = useCallback(
    (payload: MetaLocatorMessageDetail) => {
      clearAbandonTimeout();
      abandonFiredRef.current = false;

      updateAbandonSession(payload);

      abandonTimeoutRef.current = setTimeout(() => {
        const contactClicked =
          sessionStorage.getItem(StringConstants.AW.WTB.ContactClickedKey) === 'true';
        const latestPayload = mlPayloadRef.current;

        if (contactClicked || abandonFiredRef.current || !latestPayload) {
          clearAbandonTimeout();
          return;
        }

        abandonFiredRef.current = true;
        fireAbandon(latestPayload, true);
        clearAbandon();
      }, abandonTimeoutMs);
    },
    [abandonTimeoutMs, clearAbandon, clearAbandonTimeout, fireAbandon, updateAbandonSession]
  );

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
        setSessionStorageItems({ [StringConstants.AW.WTB.ContactClickedKey]: 'false' });

        fireMapPopupOpen(payload);
        startAbandonTimeout(payload);
      } else if (payload.eventName === 'ml_phoneClicked') {
        setSessionStorageItems({ [StringConstants.AW.WTB.ContactClickedKey]: 'true' });
        clearAbandon();
        firePhoneClicked(payload);
      }
    };

    globalThis.addEventListener('ml-iframe-message', handleMetaLocatorIFrameMessage);

    return () => {
      globalThis.removeEventListener('ml-iframe-message', handleMetaLocatorIFrameMessage);
      clearAbandonTimeout();
    };
  }, [clearAbandon, clearAbandonTimeout, fireMapPopupOpen, firePhoneClicked, startAbandonTimeout]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const contactClicked =
        sessionStorage.getItem(StringConstants.AW.WTB.ContactClickedKey) === 'true';
      const latestPayload = mlPayloadRef.current;

      if (abandonFiredRef.current || contactClicked || !latestPayload) {
        return;
      }

      abandonFiredRef.current = true;
      fireAbandon(latestPayload, false);
      setSessionStorageItems({ [StringConstants.AW.WTB.AbandonEventTriggered]: 'true' });
    };

    globalThis.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      globalThis.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [fireAbandon]);

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
    <>
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
      <MetaLocatorNavFallback />
    </>
  );
}

export const Default = withDatasourceCheck(MetaLocator_Default);
