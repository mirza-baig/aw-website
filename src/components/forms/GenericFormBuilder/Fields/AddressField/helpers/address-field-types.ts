export type ControlState = {
  cityLabel: string;
  stateLabel: string;
  zipCodeLabel: string;
  cityPlaceholder: string;
  zipCodePlaceholder: string;
  stateOptions: StateItem[];
  stateOrLocation: 'state' | 'location';
  lastCountryValue: string;
};

export type CountryItem = {
  id: string;
  title: string;
  value: string;
  states: StateItem[];
};

export type StateItem = {
  id: string;
  title: string;
  value: string;
};
