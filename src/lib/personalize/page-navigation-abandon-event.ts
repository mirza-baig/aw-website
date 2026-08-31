import { event } from '@sitecore-content-sdk/events';

export const firePageNavAbandonEvent = (journeyKey: string) => {
  const rawJourney = sessionStorage.getItem(journeyKey);
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
