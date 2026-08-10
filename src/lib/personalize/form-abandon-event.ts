import { FormsConstants } from 'lib/constants/forms-constants';
import { StringConstants } from 'lib/constants/string-constants';
import { clearSessionStorageItems, setSessionStorageItems } from 'lib/utils/session-storage';

import { buildPersonalizePayload } from './build-personalize-payload';

type Attribute = {
  id?: string;
  key?: string;
  constantValue?: string;
  constantText?: string;
};

type CreateAbandonPayloadProps = {
  abandonEventType?: string;
  attributes: Attribute[];
};

export const createAbandonPayload = ({
  abandonEventType,
  attributes,
}: CreateAbandonPayloadProps) => {
  const formStep = Number(sessionStorage.getItem(FormsConstants.AW.Form.CCPFormStep) || 1);

  return buildPersonalizePayload({
    eventType: abandonEventType,
    attributes,
    additionalExt: {
      stepAbandonedAt: formStep,
    },
  });
};

type SetAbandonSessionProps = {
  journeyName?: string;
  abandonEventType?: string;
  abandonPayloadKey?: string;
  abandonEventTriggered?: string;
  payload?: unknown;
};

export const setAbandonSession = ({
  journeyName,
  abandonEventType,
  abandonPayloadKey,
  abandonEventTriggered,
  payload,
}: SetAbandonSessionProps) => {
  if (!abandonPayloadKey) {
    return;
  }

  // Check against undefined/null payloads.
  if (payload === undefined || payload === null) {
    return;
  }

  setSessionStorageItems({
    [StringConstants.AW.ActiveJourneyKey]: JSON.stringify({
      journey: journeyName,
      prevPath: globalThis.location.pathname,
      eventType: abandonEventType,
      payloadKey: abandonPayloadKey,
    }),
    [abandonPayloadKey]: JSON.stringify(payload),
  });

  if (abandonEventTriggered) {
    clearSessionStorageItems([abandonEventTriggered]);
  }
};
