import { event } from '@sitecore-content-sdk/events';
import { StringConstants } from 'lib/constants/string-constants';

export const firePageNavAbandonEvent = () => {
  const rawJourney = sessionStorage.getItem(StringConstants.AW.ActiveJourneyKey);
  if (!rawJourney || rawJourney === 'undefined') {
    return;
  }

  const journeyData = JSON.parse(rawJourney);
  if (!journeyData.eventType || !journeyData.payloadKey) {
    return;
  }

  const rawPayload = sessionStorage.getItem(journeyData.payloadKey);
  const abandonPayload = rawPayload && rawPayload !== 'undefined' ? JSON.parse(rawPayload) : {};

  event({
    type: journeyData.eventType,
    channel: 'WEB',
    language: 'EN',
    ext: {
      ...abandonPayload,
    },
  }).catch(console.error);
};
