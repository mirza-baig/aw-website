'use client';

import { event } from '@sitecore-content-sdk/events';
import { FormikValues } from 'formik';

export const fireSubmitEvent = (values: FormikValues) => {
  const isHomeowner = values['about'] === 'homeowner';
  const getSupplierName = (
    isHomeowner: boolean,
    supplier: string,
    supplierName: string
  ): string => {
    return !isHomeowner && supplier === 'Yes' ? supplierName : '';
  };

  const submitPayload = {
    type: 'AW:FORM_RAQ_SUBMIT',
    channel: 'WEB',
    language: 'EN',
    extensionData: {
      timestamp: new Date().toISOString(),
      pageUrl: globalThis.location.href,
      fromExperience: sessionStorage.getItem('awRAQFromExperience') === 'true',
      experienceId: sessionStorage.getItem('awRAQExperienceId') ?? '',
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
        values['supplier'],
        values['supplier_name']
      ),
      projectTiming: isHomeowner ? '' : (values['project_timing'] ?? ''),
      address: isHomeowner ? '' : (values['address1'] ?? ''),
      tellUsMore: isHomeowner ? '' : (values['additional_details'] ?? ''),
    },
  };

  event(submitPayload).catch(console.debug);
};
