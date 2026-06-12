export const DEALER_MODE = 'dealer';
export const HOMEOWNER_MODE = 'homeowner';

export const EXCLUDE_BY_USER_TYPE: Record<string, string[]> = {
  [DEALER_MODE]: ['c0b94a1e-c64d-4c4a-864c-e5750218e1c3', '3cb393d0-c6ce-4721-8144-1ec2a3cf927c'],
  [HOMEOWNER_MODE]: [
    'c0b94a1e-c64d-4c4a-864c-e5750218e1c3',
    '3cb393d0-c6ce-4721-8144-1ec2a3cf927c',
    '4e177f9e-4589-4dd3-9ed8-466894fb553e',
    'a4699e17-787b-4c22-acf6-3aa537c3a963',
  ],
};
