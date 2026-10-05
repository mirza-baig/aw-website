import { FormikValues } from 'formik';

type AttributeItem = {
  key?: string;
  value?: string | boolean | number;
};

type BuildIdentifyPayloadInput = {
  formValues: FormikValues;
  extensionData: AttributeItem[];
  /**
   * Attribute items sourced from the submit action fields (same AW_FieldAttribute
   * template as extensionData). Mapped into the base level of the payload.
   */
  fieldData?: AttributeItem[];
};

const toAttributeRecord = (
  attributes: AttributeItem[]
): Record<string, string | boolean | number> =>
  attributes.reduce(
    (acc, attribute) => {
      if (!attribute.key) {
        return acc;
      }

      acc[attribute.key] = attribute.value ?? '';
      return acc;
    },
    {} as Record<string, string | boolean | number>
  );

const normalizePostalCode = (postalCode: string): string => {
  const value = postalCode.trim();

  if (/^\d{5}-\d{4}$/.test(value)) {
    return value.substring(0, 5);
  }

  return value.replaceAll(/\s/g, '');
};

export function buildPersonalizeIdentifyPayload(input: BuildIdentifyPayloadInput) {
  const extensionData = toAttributeRecord(input.extensionData);
  const fieldData = toAttributeRecord(input.fieldData ?? []);
  const lastName = String(fieldData?.lastName ?? extensionData.AWLastName ?? '').trim();
  const email = String(fieldData?.email ?? extensionData.AWEmail ?? '').trim();
  const zipCode = normalizePostalCode(
    String(fieldData?.postalCode ?? extensionData.AWZipCode ?? '').trim()
  );

  if (!lastName || !email || !zipCode) {
    console.warn('[CDP] Missing required identify fields: Last Name, Email or Zip Code');
    return null;
  }
  const awContactKey = `${lastName}|${zipCode}|${email}`.toLowerCase();

  extensionData.contactKey = awContactKey;
  extensionData.lastName = lastName;
  extensionData.email = email;
  extensionData.zipCode = zipCode;
  extensionData.brand = 'AW';

  const payload = {
    channel: 'WEB',
    language: 'EN',
    identifiers: [
      {
        provider: 'AW_CONTACT_KEY',
        id: awContactKey,
      },
    ],
    ...fieldData, // spread fieldData directly on the payload because Sitecore CDP expects this for certain fields.
    extensionData,
  };

  return payload;
}
