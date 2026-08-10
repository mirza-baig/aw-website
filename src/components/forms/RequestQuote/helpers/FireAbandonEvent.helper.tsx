'use client';

import { event } from '@sitecore-content-sdk/events';
import { FormikValues } from 'formik';
import { StringConstants } from 'lib/constants/string-constants';

import { type AbandonReason, buildRaqAbandonExtensionData } from './buildRaqAbandonPayload';

type FireAbandonEventParams = {
  values: FormikValues;
  inactivityMinutes: number;
  pageIndex: number;
  reason?: AbandonReason;
};

export const fireAbandonEvent = ({
  values,
  inactivityMinutes,
  pageIndex,
  reason,
}: FireAbandonEventParams) => {
  const payload = {
    type: StringConstants.AW.RequestQuote.AbandonEventType,
    channel: 'WEB',
    language: 'EN',
    ext: buildRaqAbandonExtensionData({ values, inactivityMinutes, pageIndex, reason }),
  };

  event(payload).catch(console.debug);
};
