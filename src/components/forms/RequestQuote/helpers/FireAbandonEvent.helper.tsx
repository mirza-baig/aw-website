'use client';

import { event } from '@sitecore-content-sdk/events';
import { FormikValues } from 'formik';

type FireAbandonEventParams = {
  values: FormikValues;
  inactivityMinutes: number;
  pageIndex: number;
};

export const fireAbandonEvent = ({
  values,
  inactivityMinutes,
  pageIndex,
}: FireAbandonEventParams) => {
  const isHomeowner = values['about'] === 'homeowner';

  const getSupplierName = (
    isHomeownerFlow: boolean,
    supplier: string,
    supplierName: string
  ): string => {
    return !isHomeownerFlow && supplier === 'Yes' ? supplierName : '';
  };

  const abandonPayload = {
    type: 'AW:FORM_RAQ_ABANDON',
    channel: 'WEB',
    language: 'EN',
    extensionData: {
      timestamp: new Date().toISOString(),
      pageUrl: globalThis.location.href,
      referrer: document.referrer,
      elapsedMinutes: inactivityMinutes,
      stepAbandonedAt: String(pageIndex),
      userType: isHomeowner ? 'Homeowner' : 'Professional',
      projectType: values['project_type'] ?? '',
      firstName: values['first_name'] ?? '',
      lastName: values['last_name'] ?? '',
      email: values['email'] ?? '',
      mobile: values['mobile_number'] ?? '',
      zip: values['zip'] ?? '',
      city: values['city'] ?? '',
      state: values['state'] ?? '',
      country: isHomeowner ? 'USA' : (values['country'] ?? ''),
      estimatedWindows: isHomeowner ? '' : (values['estimated_windows'] ?? ''),
      estimatedDoors: isHomeowner ? '' : (values['estimated_doors'] ?? ''),
      typeOfBusiness: isHomeowner ? '' : (values['trades'] ?? ''),
      businessName: isHomeowner ? '' : (values['company'] ?? ''),
      currentSupplier: isHomeowner ? '' : (values['supplier'] ?? ''),
      currentSupplierName: getSupplierName(
        isHomeowner,
        values['supplier'] ?? '',
        values['supplier_name'] ?? ''
      ),
      projectTiming: isHomeowner ? '' : (values['project_timing'] ?? ''),
      address: isHomeowner ? '' : (values['address1'] ?? ''),
      tellUsMore: values['additional_details'] ?? '',
    },
  };

  event(abandonPayload).catch(console.debug);
};
