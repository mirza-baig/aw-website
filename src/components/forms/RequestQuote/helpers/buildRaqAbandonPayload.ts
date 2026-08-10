import { FormikValues } from 'formik';

export type AbandonReason = 'timeout' | 'navigation' | null;

type BuildParams = {
  values: FormikValues;
  inactivityMinutes: number;
  pageIndex: number;
  reason?: AbandonReason;
};

export const buildRaqAbandonExtensionData = ({
  values,
  inactivityMinutes,
  pageIndex,
  reason,
}: BuildParams) => {
  const isHomeowner = values['about'] === 'homeowner';

  const getSupplierName = (
    isHomeownerFlow: boolean,
    supplier: string,
    supplierName: string
  ): string => (!isHomeownerFlow && supplier === 'Yes' ? supplierName : '');

  return {
    timestamp: new Date().toISOString(),
    pageUrl: globalThis.location.href,
    // Explicit resume URL so the Personalize return-experience banner can link
    // the visitor straight back to their in-progress RAQ. Matches the field
    // name Design Tool uses on its abandon event.
    resumeUrl: globalThis.location.href,
    referrer: document.referrer,
    // Only include elapsedMinutes for inactivity-timer abandons — navigation
    // abandons happen at an arbitrary point and elapsed time is meaningless.
    ...(reason === 'timeout' && { elapsedMinutes: inactivityMinutes }),
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
  };
};
