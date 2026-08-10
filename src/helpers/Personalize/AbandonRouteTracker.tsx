'use client';

import { FormsConstants } from 'lib/constants/forms-constants';
import { StringConstants } from 'lib/constants/string-constants';
import { firePageNavAbandonEvent } from 'lib/personalize/page-navigation-abandon-event';
import { clearSessionStorageItems } from 'lib/utils/session-storage';
import { useEffect } from 'react';

const JOURNEY_SESSION_KEYS: Record<string, string[]> = {
  [StringConstants.AW.DesignTool.JourneyName]: [
    StringConstants.AW.ActiveJourneyKey,
    StringConstants.AW.DesignTool.AbandonPayloadKey,
    StringConstants.AW.DesignTool.GlassReachedKey,
    StringConstants.AW.DesignTool.DesignStartedKey,
    StringConstants.AW.DesignTool.AbandonEventTriggered,
  ],
  [StringConstants.AW.RequestQuote.JourneyName]: [
    StringConstants.AW.ActiveJourneyKey,
    StringConstants.AW.RequestQuote.AbandonPayloadKey,
    StringConstants.AW.RequestQuote.StartTimeKey,
    StringConstants.AW.RequestQuote.SubmittedKey,
    StringConstants.AW.RequestQuote.AbandonEventTriggered,
    StringConstants.AW.RequestQuote.FromExperienceKey,
    StringConstants.AW.RequestQuote.ExperienceIdKey,
  ],
  [StringConstants.AW.WTB.JourneyName]: [
    StringConstants.AW.ActiveJourneyKey,
    StringConstants.AW.WTB.AbandonPayloadKey,
    StringConstants.AW.WTB.ContactClickedKey,
    StringConstants.AW.WTB.AbandonEventTriggered,
  ],
  [StringConstants.AW.GFBForm.JourneyName]: [
    StringConstants.AW.ActiveJourneyKey,
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

export const AbandonRouteTracker = () => {
  useEffect(() => {
    const journeyData = JSON.parse(
      sessionStorage.getItem(StringConstants.AW.ActiveJourneyKey) || '{}'
    );
    const activeJourney: string | undefined = journeyData.journey;
    const prevPath: string | undefined = journeyData.prevPath;
    const currentPath = globalThis.location.pathname;

    if (!activeJourney || !prevPath || prevPath === currentPath) {
      return;
    }

    const sessionKeys = JOURNEY_SESSION_KEYS[activeJourney];
    const triggeredKey = JOURNEY_ABANDON_TRIGGERED_KEYS[activeJourney];
    if (!sessionKeys || !triggeredKey) {
      return;
    }

    const abandonEventTriggered = sessionStorage.getItem(triggeredKey) === 'true';
    if (abandonEventTriggered) {
      clearSessionStorageItems(sessionKeys);
      return;
    }

    firePageNavAbandonEvent();
    clearSessionStorageItems(sessionKeys);
  });

  return null;
};
