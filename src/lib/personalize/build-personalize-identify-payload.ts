import { FormikValues } from 'formik';

type AttributeItem = {
  key?: string;
  value?: string | boolean | number;
};

type BuildIdentifyPayloadInput = {
  formValues: FormikValues;
  attributes: AttributeItem[];
};

const normalizePostalCode = (postalCode: string): string => {
  const value = postalCode.trim();

  if (/^\d{5}-\d{4}$/.test(value)) {
    return value.substring(0, 5);
  }

  return value.replaceAll(/\s/g, '');
};

export function buildPersonalizeIdentifyPayload(input: BuildIdentifyPayloadInput) {
  const extensionData = input.attributes.reduce(
    (acc, attribute) => {
      if (!attribute.key) {
        return acc;
      }

      acc[attribute.key] = attribute.value ?? '';
      return acc;
    },
    {} as Record<string, string | boolean | number>
  );
  const lastName = String(extensionData.AWLastName ?? '').trim();
  const email = String(extensionData.AWEmail ?? '').trim();
  const zipCode = normalizePostalCode(String(extensionData.AWZipCode ?? '').trim());
  if (!lastName || !email || !zipCode) {
    console.warn('[CDP] Missing required identify fields: AWLastName, AWEmail or AWZipCode');
    return null;
  }
  const awContactKey = `${lastName}|${zipCode}|${email}`.toLowerCase();

  extensionData.AWcontactKey = awContactKey;
  extensionData.AWLastName = lastName;
  extensionData.AWEmail = email;
  extensionData.AWZipCode = zipCode;
  return {
    channel: 'WEB',
    language: 'EN',
    identifiers: [
      {
        provider: 'AW_CONTACT_KEY',
        id: awContactKey,
      },
    ],
    extensionData,
  };
}
