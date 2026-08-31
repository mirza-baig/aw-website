'use client';

import { FormsConstants } from 'lib/constants/forms-constants';
import { StringConstants } from 'lib/constants/string-constants';
import { firePageNavAbandonEvent } from 'lib/personalize/page-navigation-abandon-event';
import { clearSessionStorageItems } from 'lib/utils/session-storage';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const JOURNEY_SESSION_KEYS: Record<string, string[]> = {
  [StringConstants.AW.DesignTool.JourneyName]: [
    StringConstants.AW.DesignTool.ActiveJourneyKey,
    StringConstants.AW.DesignTool.AbandonPayloadKey,
    StringConstants.AW.DesignTool.GlassReachedKey,
    StringConstants.AW.DesignTool.DesignStartedKey,
    StringConstants.AW.DesignTool.AbandonEventTriggered,
  ],
  [StringConstants.AW.RequestQuote.JourneyName]: [
    StringConstants.AW.RequestQuote.ActiveJourneyKey,
    StringConstants.AW.RequestQuote.AbandonPayloadKey,
    StringConstants.AW.RequestQuote.StartTimeKey,
    StringConstants.AW.RequestQuote.SubmittedKey,
    StringConstants.AW.RequestQuote.AbandonEventTriggered,
    StringConstants.AW.RequestQuote.FromExperienceKey,
    StringConstants.AW.RequestQuote.ExperienceIdKey,
  ],
  [StringConstants.AW.WTB.JourneyName]: [
    StringConstants.AW.WTB.ActiveJourneyKey,
    StringConstants.AW.WTB.AbandonPayloadKey,
    StringConstants.AW.WTB.ContactClickedKey,
    StringConstants.AW.WTB.AbandonEventTriggered,
  ],
  [StringConstants.AW.GFBForm.JourneyName]: [
    StringConstants.AW.GFBForm.ActiveJourneyKey,
    StringConstants.AW.GFBForm.AbandonPayloadKey,
    StringConstants.AW.GFBForm.AbandonEventTriggered,
    FormsConstants.AW.Form.CCPFormStep,
    FormsConstants.AW.Form.CCPFormTimeout,
    FormsConstants.AW.Form.CCPFormCompleted,
  ],
};

// Per-journey flag set by beforeunload paths so the tracker doesn't double-fire.
const JOURNEY_ABANDON_TRIGGERED_KEYS: Record<string, string> = {
  [StringConstants.AW.DesignTool.JourneyName]: StringConstants.AW.DesignTool.AbandonEventTriggered,
  [StringConstants.AW.RequestQuote.JourneyName]:
    StringConstants.AW.RequestQuote.AbandonEventTriggered,
  [StringConstants.AW.WTB.JourneyName]: StringConstants.AW.WTB.AbandonEventTriggered,
  [StringConstants.AW.GFBForm.JourneyName]: StringConstants.AW.GFBForm.AbandonEventTriggered,
};

interface JourneyData {
  prevPath?: string;
  journey?: string;
  eventType?: string;
  payloadKey?: string;
}

export const AbandonRouteTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Find all journeys that are currently active by checking all possible ActiveJourneyKeys
    const activeJourneyEntries = Object.entries(JOURNEY_SESSION_KEYS).filter(([_, keys]) => {
      const activeKey = keys.find((k) =>
        k.includes(StringConstants.AW.Common.ActiveJourneyKeyPrefix)
      );
      return activeKey && sessionStorage.getItem(activeKey);
    });

    const currentPath = pathname;

    activeJourneyEntries.forEach(([activeJourney, sessionKeys]) => {
      const activeKey = sessionKeys.find((k) =>
        k.includes(StringConstants.AW.Common.ActiveJourneyKeyPrefix)
      );
      if (!activeKey) {
        return;
      }

      let journeyData: JourneyData = {};
      try {
        const rawData = sessionStorage.getItem(activeKey);
        journeyData = rawData && rawData !== 'undefined' ? JSON.parse(rawData) : {};
      } catch (e) {
        console.error('Failed to parse journey data for key:', activeKey, e);
      }

      const prevPath: string | undefined = journeyData.prevPath;

      if (!prevPath || prevPath === currentPath) {
        return;
      }

      const triggeredKey = JOURNEY_ABANDON_TRIGGERED_KEYS[activeJourney];
      if (!triggeredKey) {
        return;
      }

      const abandonEventTriggered = sessionStorage.getItem(triggeredKey) === 'true';
      if (abandonEventTriggered) {
        clearSessionStorageItems(sessionKeys);
        return;
      }

      firePageNavAbandonEvent(activeKey);
      clearSessionStorageItems(sessionKeys);
    });
  }, [pathname]);

  return null;
};
